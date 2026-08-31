
async function NomCoachInit() {
    // Recup datas
    let CoachUserDB = await db.JRM_Coach.toArray()

    if (CoachUserDB.length > 0) { // Si il y a des datas
        let NomCoach = CoachUserDB.map(elementDB => elementDB.nom)            
        document.getElementById("nom-coach").innerHTML = `<strong class="jrm-coach">${NomCoach}</strong>`
    }
}

function derniereMajView() {
    let lastViewVersion = localStorage.getItem("lastViewVersion") || "SPRINTIA 5.2"

    // si le user n'a pas regardé le patch note de la maj alorsil y aura un point rouge
    if (lastViewVersion != VERSION_SPRINTIA) {document.querySelector("span.point-bleu").classList.add("visible")}
}
function clickPatchNote(elt) {
    if (elt.querySelector("p.version").textContent == VERSION_SPRINTIA) {
        localStorage.setItem("lastViewVersion", elt.querySelector("p.version").textContent)
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const allCardPatchNote = document.querySelectorAll(".card-releases")
    if (allCardPatchNote) {
        allCardPatchNote.forEach(element => {
            element.addEventListener("click", () => {
                clickPatchNote(this)
            })
        });
    }

    const buttonToutVoir = document.getElementById("historique-versions")
    if (buttonToutVoir) {buttonToutVoir.addEventListener("click", () => {window.location.href = 'historique-versions/historique-versions.html'})}

    NomCoachInit()
    derniereMajView()
})