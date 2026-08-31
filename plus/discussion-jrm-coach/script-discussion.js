async function NomCoachInit() {
    // Recup datas
    let CoachUserDB = await db.JRM_Coach.toArray()

    if (CoachUserDB.length > 0) { // Si il y a des datas
        let NomCoach = CoachUserDB.map(elementDB => elementDB.nom)
        document.getElementById("briefing").innerHTML = NomCoach
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const buttonBriefing = document.getElementById("button-SPRINTIA-briefing-ask")
    if (buttonBriefing) {
        buttonBriefing.addEventListener("click", () => {
            if (!document.getElementById('promt-user').value.trim()) {
                alert('Veuillez ajouter votre question dans le champs de texte avant de vouloir demander à une IA.')
            } else {
                windowsBriefing('Demander à Vibe')
            }
        })
    }

    NomCoachInit()
})