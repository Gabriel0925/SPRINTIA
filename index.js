async function configSPRINTIA() { // permet d'enlever le panneau de configuration une fois que le user a configurer
    const profilData = await db.profil.get(1)
    const choixUserLocalStorage = localStorage.getItem("configurationProfil")

    if (profilData == undefined && choixUserLocalStorage != "ignorer") {
        document.getElementById("configurer-SPRINTIA").style.display = "block"
    }
}

function ignoreConfigurationProfil() {
    if (confirm("Êtes-vous sûr de vouloir ignorer la configuration de votre profil ?")) {
        document.getElementById("configurer-SPRINTIA").style.display = "none"
        localStorage.setItem("configurationProfil", "ignorer")
    }
}

window.addEventListener("DOMContentLoaded", configSPRINTIA())


// Init for function Afficher data
let NbCardsWorkoutAfficher = 0
let NbTotalCardsWorkoutAfficher = parseInt(sessionStorage.getItem("NbCardHistoriqueSave")) || 12
let HistoriqueComplet = []

async function Init() {
    // Recup de l'historique
    let HistoriqueDB = await db.entrainement.toArray() // recup de toutes les datas
    // Trier par date 
    HistoriqueDB.sort((element1, element2) => { // En js on peut comparer 2 dates comme des maths
        if (element1.date < element2.date) return 1
        if (element1.date > element2.date) return -1
    })

    // animation du dynamic logo pour féliciter le user
    verificationURL() // fonction dans base JS

    SauvegardeHistorique(HistoriqueDB)
    return
}

function HTMLCard(CardWorkout, workout, DateEuropeen, dureeWorkout) {
    const baliseA = document.createElement("a")
    baliseA.href = `entrainement/entrainement.html?workout=${workout.id}`

    // <div class="data-workout-column">
    const divDataColumn = document.createElement("div")
    divDataColumn.classList.add("data-workout-column")

    const paragrapheNameWorkout = document.createElement("p")
    paragrapheNameWorkout.classList.add("name-workout")
    paragrapheNameWorkout.textContent = workout.nom

    const paragrapheSportDateWorkout = document.createElement("p")
    paragrapheSportDateWorkout.classList.add("sport-date-workout")
    paragrapheSportDateWorkout.textContent = workout.sport + " · " + DateEuropeen

    divDataColumn.appendChild(paragrapheNameWorkout)
    divDataColumn.appendChild(paragrapheSportDateWorkout)

    // <div class="container-data-resume-workout">
    const divDataResumeWorkout = document.createElement("div")
    divDataResumeWorkout.classList.add("container-data-resume-workout")

    const paragrapheDureeWorkout = document.createElement("p")
    paragrapheDureeWorkout.classList.add("duree-workout")
    paragrapheDureeWorkout.textContent = dureeWorkout

    const paragrapheChargeWorkout = document.createElement("p")
    paragrapheChargeWorkout.classList.add("charge-workout")
    paragrapheChargeWorkout.textContent = workout.charge_entrainement

    const baliseSmallUnite = document.createElement("small") //<small>CE</small>
    baliseSmallUnite.textContent = "CE"
    paragrapheChargeWorkout.appendChild(baliseSmallUnite)

    divDataResumeWorkout.appendChild(paragrapheDureeWorkout)
    divDataResumeWorkout.appendChild(paragrapheChargeWorkout)

    // Ajout des 2 div à la balise a
    baliseA.appendChild(divDataColumn)
    baliseA.appendChild(divDataResumeWorkout)

    // Ajout de la balise "a" à la card workout
    CardWorkout.appendChild(baliseA)

    return CardWorkout
}

async function SauvegardeHistorique(HistoriqueDB) {
    HistoriqueDB.forEach(element => {
        HistoriqueComplet.push(element)
    });
    await initialisationAffichage()
}

async function initialisationAffichage() { // pour quand on recharge la page
    if (HistoriqueComplet.length <= 0) {
        document.getElementById("aucune-data").style.display = "flex"
        document.querySelector(".input-search").style.display = "none"
    } 
    if (HistoriqueComplet.length <= 12) {
        document.getElementById("button_afficher_plus").style.display = "none"
    }

    const ConteneurCardsWorkout = document.getElementById("liste-workouts")

    let HistoriqueSauvegarder = HistoriqueComplet.slice(0, NbTotalCardsWorkoutAfficher)
            
    // Creation structure HTML
    HistoriqueSauvegarder.forEach(workout => {
        const CardWorkout = document.createElement("div")

        CardWorkout.classList.add("cards-history-workout")

        // Inversion de la date de "2026-01-8" à "8-01-2026"
        let DateEuropeen = formatEuropeenDate(workout.date)
        let dureeWorkout = dureeFormatee(workout.duree, "null") // on exige aucun format

        let CardWorkoutHTML = HTMLCard(CardWorkout, workout, DateEuropeen, dureeWorkout)
        ConteneurCardsWorkout.appendChild(CardWorkoutHTML)
    }); 

    ConteneurCardsWorkout.classList.remove("skeleton")

    // maj de la variable 
    NbCardsWorkoutAfficher = NbTotalCardsWorkoutAfficher

    // si il n'y a plus de cartes a ajouter on fais disparaitre le bouton voir plus
    if (HistoriqueComplet.length <= NbCardsWorkoutAfficher) {
        document.getElementById("button_afficher_plus").style.display = "none"
    } else {
        document.getElementById("button_afficher_plus").style.display = "block"
    }
}

async function AfficherData() { // lors d'un clic sur le bouton afficher plus
    if (HistoriqueComplet.length <= 0) {
        document.getElementById("aucune-data").style.display = "flex"
        document.querySelector(".input-search").style.display = "none"
    } 
    // Cacher le bouton si il n'y a plus d'element a charger
    if (HistoriqueComplet.length <= NbCardsWorkoutAfficher) {
        document.getElementById("button_afficher_plus").style.display = "none"
    }
    if (HistoriqueComplet.length <= 12) {
        document.getElementById("button_afficher_plus").style.display = "none"
    }

    const ConteneurCardsWorkout = document.getElementById("liste-workouts")

    // Coupage des datas pr le nb limite de cards
    let HistoriqueNecessaire = HistoriqueComplet.slice(NbCardsWorkoutAfficher, NbCardsWorkoutAfficher+12)
    NbCardsWorkoutAfficher += 12

    // Creation structure HTML
    HistoriqueNecessaire.forEach(workout => {
        const CardWorkout = document.createElement("div")

        CardWorkout.classList.add("cards-history-workout")

        // Inversion de la date de "2026-01-8" à "8-01-2026"
        let DateEuropeen = formatEuropeenDate(workout.date)
        let dureeWorkout = dureeFormatee(workout.duree, "null") // on exige aucun format

        let CardWorkoutHTML = HTMLCard(CardWorkout, workout, DateEuropeen, dureeWorkout)
        ConteneurCardsWorkout.appendChild(CardWorkoutHTML)
    }); 
    ConteneurCardsWorkout.classList.remove("skeleton")

    if (NbCardsWorkoutAfficher > 12) {
        sessionStorage.setItem("NbCardHistoriqueSave", NbCardsWorkoutAfficher)
    }

    // si il n'y a plus de card a afficher alors on enleve le bouton
    if (HistoriqueComplet.length <= NbCardsWorkoutAfficher) {
        document.getElementById("button_afficher_plus").style.display = "none"
    }

    return
}

window.addEventListener("DOMContentLoaded", async () => {
    await Init()
})

// Recherche d'entraînement
let inputSearch = document.getElementById("input-search")
inputSearch.addEventListener("input", () => { // on recup en temps réel ce que le user tape
    let rechercheUser = inputSearch.value.toLowerCase()

    if (rechercheUser.trim() == "") {
        document.getElementById("aucun-resultat").style.display = "none"
        document.getElementById("liste-workouts").textContent = ""
        initialisationAffichage()
    } else {
        let filteredHistoriqueComplet = HistoriqueComplet.filter(workout => workout.nom.toLowerCase().includes(rechercheUser))

        document.getElementById("liste-workouts").textContent = ""
        document.getElementById("button_afficher_plus").style.display = "none"

        if (filteredHistoriqueComplet.length <= 0) {
            document.getElementById("aucun-resultat").style.display = "flex"
        } else {
            document.getElementById("aucun-resultat").style.display = "none"

            filteredHistoriqueComplet.forEach(element => {
                const CardWorkout = document.createElement("div")
                CardWorkout.classList.add("cards-history-workout")

                // Inversion de la date de "2026-01-8" à "8-01-2026"
                let DateEuropeen = formatEuropeenDate(element.date)
                let dureeWorkout = dureeFormatee(element.duree, "null") // on exige aucun format

                let CardWorkoutHTML = HTMLCard(CardWorkout, element, DateEuropeen, dureeWorkout)
                document.getElementById("liste-workouts").appendChild(CardWorkoutHTML)
            });
            
            document.getElementById("liste-workouts").classList.remove("skeleton")
        }
    }
})

document.addEventListener("DOMContentLoaded", () => {
    // LES BOUTONS
    let buttonIgnorer = document.getElementById("ignorer")
    if (buttonIgnorer) {buttonIgnorer.addEventListener("click", ignoreConfigurationProfil)}

    let buttonConfigurer = document.getElementById("configurer")
    if (buttonConfigurer) {buttonConfigurer.addEventListener("click", () => {location.href = 'plus/profil/modification-profil.html'})}

    let buttonAfficherPlus = document.getElementById("button_afficher_plus")
    if (buttonAfficherPlus) {buttonAfficherPlus.addEventListener("click", AfficherData)}

    // RECHERCHE ENTRAINEMENT
    let iconRecherche = document.querySelector("i.icon_search")
    if (iconRecherche) {iconRecherche.addEventListener("click", () => {document.getElementById('input-search').focus()})}
})