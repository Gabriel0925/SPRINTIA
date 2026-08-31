function derniereMajView() {
    let lastViewVersion = localStorage.getItem("lastViewVersion") || "SPRINTIA 5.2"

    // si le user n'a pas regardé le patch note de la maj alorsil y aura un point rouge
    if (lastViewVersion != VERSION_SPRINTIA) {document.querySelector("span.point-bleu").classList.add("visible")}
}

function clickPatchNote(elt, url) {
    if (elt.querySelector(".card-releases-image-last-maj p.version-last-maj").textContent == VERSION_SPRINTIA) {
        localStorage.setItem("lastViewVersion", elt.querySelector(".card-releases-image-last-maj p.version-last-maj").textContent)
    }
    location.href = url
}

document.addEventListener("DOMContentLoaded", () => {
    const lastBoxPatchNote = document.querySelector(".box-last-maj")
    if (lastBoxPatchNote) {lastBoxPatchNote.addEventListener("click", () => {clickPatchNote(this, 'generation-26/v26.10.html')})}

    derniereMajView()
})