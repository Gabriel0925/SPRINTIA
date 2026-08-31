async function NomCoachInit() {
    // Recup datas
    let CoachUserDB = await db.JRM_Coach.toArray()

    if (CoachUserDB.length > 0) { // Si il y a des datas
        let NomCoach = CoachUserDB.map(elementDB => elementDB.nom)            
        document.getElementById("nom-coach").innerHTML = `Configurer <strong class="jrm-coach">${NomCoach}</strong>`
    }
}

window.addEventListener("DOMContentLoaded", () => {
    NomCoachInit()
})