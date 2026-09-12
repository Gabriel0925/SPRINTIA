async function NomCoachInit() {
    // Recup datas
    let CoachUserDB = await db.JRM_Coach.toArray()

    if (CoachUserDB.length > 0) { // Si il y a des datas
        let NomCoach = CoachUserDB.map(elementDB => elementDB.nom)            
        document.querySelector(".jrm-coach").textContent = NomCoach
    }
}

window.addEventListener("DOMContentLoaded", () => {
    NomCoachInit()
})