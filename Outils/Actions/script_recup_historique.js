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
    const ParamURL = window.location.search
    const TableauSeparation = ParamURL.split("?")
    
    if (TableauSeparation.length > 1 && TableauSeparation[1] == "workoutregister") {
        logoDynamique("Bien joué·e 🔥")
    }

    SauvegardeHistorique(HistoriqueDB)
    return
}

function HTMLCard(CardWorkout, workout, DateEuropeen, dureeWorkout) {
    let StructureHTML = `        
    <a href="entrainement.html?workout=${workout.id}">  
        <div class="data-workout-column">
            <p class="name-workout">
                ${workout.nom}
            </p>
            <p class="sport-date-workout">
                ${workout.sport} · ${DateEuropeen}
            </p>
        </div>
        <div class="data-workout-paire">
            <p class="duree-workout">
                <strong>${dureeWorkout}</strong>
            </p>
            <p class="rpe-workout">
                RPE : <strong>${workout.rpe}</strong>
            </p>
        </div>
        <div class="data-workout-paire">
            <p class="charge-workout">
                Charge d'entraî. : <strong>${workout.charge_entrainement} CE</strong>
            </p>
        </div>
        <div class="action-button-card-workout">
            <button>Détail de l'entraînement</button>
        </div>
    </a>
    `

    CardWorkout.innerHTML = StructureHTML 

    let CardWorkoutHTML = CardWorkout

    return CardWorkoutHTML
}

async function SauvegardeHistorique(HistoriqueDB) {
    HistoriqueDB.forEach(element => {
        HistoriqueComplet.push(element)
    });
    await initialisationAffichage()

    return
}

async function initialisationAffichage() { // pour quand on recharge la page
    // Cacher le text comme quoi il n'y a pas dentrainement enregistrer
    if (HistoriqueComplet.length > 0) {
        document.getElementById("text-informatif").style.display = "none"
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

        // Inversion de la date de "2026-01-12" à "12-01-2026"
        let DateEuropeen = formatEuropeenDate(workout.date)
        let dureeWorkout = dureeFormatee(workout.duree, "null") // on exige aucun format

        let CardWorkoutHTML = HTMLCard(CardWorkout, workout, DateEuropeen, dureeWorkout)
        ConteneurCardsWorkout.appendChild(CardWorkoutHTML)
    }); 

    // maj de la variable 
    NbCardsWorkoutAfficher = NbTotalCardsWorkoutAfficher
}

async function AfficherData() { // lors d'un clic sur le bouton afficher plus
    // Cacher le text comme quoi il n'y a pas dentrainement enregistrer
    if (HistoriqueComplet.length > 0) {
        document.getElementById("text-informatif").style.display = "none"
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

        // Inversion de la date de "2026-01-12" à "12-01-2026"
        let DateEuropeen = formatEuropeenDate(workout.date)
        let dureeWorkout = dureeFormatee(workout.duree, "null") // on exige aucun format

        let CardWorkoutHTML = HTMLCard(CardWorkout, workout, DateEuropeen, dureeWorkout)
        ConteneurCardsWorkout.appendChild(CardWorkoutHTML)
    }); 

    if (NbCardsWorkoutAfficher > 12) {
        sessionStorage.setItem("NbCardHistoriqueSave", NbCardsWorkoutAfficher)
    }

    return
}

window.addEventListener("DOMContentLoaded", async () => {
    await Init()
})