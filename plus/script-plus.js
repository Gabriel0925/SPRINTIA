function derniereMajView() {
    let lastViewVersion = localStorage.getItem("lastViewVersion") || "SPRINTIA 5.2"

    // elt html
    const spanPointBleu = document.querySelector("span.point-bleu")
    const spanPointBleuTabBars = document.querySelector("section.tab-bars ul.tab-bars-container-items li.tab-bars-items.point-bleu-tab-bars")
    const spanPointBleuHeader = document.querySelector("section.header ul.header-container-items li.header-items.point-bleu-header")

    // si le user n'a pas regardé le patch note de la maj alorsil y aura un point rouge
    if (lastViewVersion != VERSION_SPRINTIA) {
        if (spanPointBleu) {spanPointBleu.classList.add("visible")}
    } else {
        if (spanPointBleu) {spanPointBleu.classList.remove("visible")}
        if (spanPointBleuTabBars) {spanPointBleuTabBars.classList.remove("point-bleu-tab-bars")}
        if (spanPointBleuHeader) {spanPointBleuHeader.classList.remove("point-bleu-header")}
    }
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
                clickPatchNote(element)
            })
        });
    }

    const buttonToutVoir = document.getElementById("historique-versions")
    if (buttonToutVoir) {buttonToutVoir.addEventListener("click", () => {window.location.href = 'historique-versions/historique-versions.html'})}

    derniereMajView()
})

// Pour recharger le graphique si c'est dans le BFCache
window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        derniereMajView()
    }
})