// Init for function Afficher data
let NbCardsWorkoutAfficher = 0
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
        // timeout remis a 0 (suppresion plutot)
        clearTimeout(Timer1)
        clearTimeout(Timer2)
        document.getElementById("a-logo").classList.remove("return", "pin-message")
        
        // petite récompense pour le user
        document.getElementById("a-logo").classList.add("pin-message")

        document.getElementById("a-logo").textContent = "Bien joué·e 🔥";

        Timer1 = setTimeout(() => { 
            document.getElementById("a-logo").classList.add("return") // a ré-ajoute une class pour qu'il y est une animation de retour
            document.getElementById("a-logo").textContent = "Sprintia"; // on raffiche Sprintia
        }, 2500); // on laisse le message pendant 2,5s pour que le user est le temps de le lire

        Timer2 = setTimeout(() => {
            // remise à l'état initial, on supprime les 2 class qu'on a mis dès la fin du setTimeout au dessus
            document.getElementById("a-logo").classList.remove("return")
            document.getElementById("a-logo").classList.remove("pin-message")
        }, 3100) // durée choisis à la main
    }

    SauvegardeHistorique(HistoriqueDB)
    return
}

// init pour le logo dynamique
let Timer1 = 0
let Timer2 = 0

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
            <p class="charge-workout">
                Charge d'entraînement : <strong>${workout.charge_entrainement}</strong>
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
    `

    if (workout.sport == "Course" || workout.sport == "Vélo" || workout.sport == "Marche") {
        StructureHTML += `
            <div class="data-workout-paire">
                <p class="duree-workout">
                    <strong>${workout.distance.toFixed(2).toString().replace(".", ",")} km</strong>
                </p>
                <p class="rpe-workout">
                    <strong>${workout.denivele} m</strong>
                </p>
            </div>
        `
    } else if (workout.sport == "Musculation") {
        StructureHTML += `
            <div class="data-workout-paire">
                <p class="muscles-workout">
                    ${workout.muscles_travailles}
                </p>
            </div>
        `
    }

    StructureHTML += `</a>`

    CardWorkout.innerHTML = StructureHTML 

    let CardWorkoutHTML = CardWorkout

    return CardWorkoutHTML
}

async function SauvegardeHistorique(HistoriqueDB) {
    HistoriqueDB.forEach(element => {
        HistoriqueComplet.push(element)
    });
    await AfficherData()

    return
}

async function AfficherData() {
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

    return
}

window.addEventListener("DOMContentLoaded", async () => {
    await Init()
})