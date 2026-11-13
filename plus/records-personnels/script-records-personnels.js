const dicoSportId = {
    "course": "record-course",
    "velo": "record-velo",
    "natation": "record-natation"
}
function gererDataOfSport(sport) {
    // on cache toutes les datas
    const allContainerBlock = document.querySelectorAll("section.container-block")
    if (allContainerBlock) {
        allContainerBlock.forEach(element => {
            // on cache tous les container block sauf la plus longue distance qui a pour id -> "pas-toucher"
            if (element.id != "pas-toucher") {
                element.style.display = "none"
            }
        });
    }

    // puis on affiche suelement celle du sport en questrion
    const eltASelected = document.getElementById(dicoSportId[sport])
    if (eltASelected) {eltASelected.style.display = "flex"}
}

function gererSegmentedButton(newElt) {
    const lastEltSelected = document.querySelector("div.segmented-button-button.actif")
    if (lastEltSelected) {
        lastEltSelected.classList.remove("actif")
    }

    newElt.classList.add("actif")

    let sportNewElt = newElt.id.split("-")[2]
    if (dicoSportId[sportNewElt]) {
        gererDataOfSport(sportNewElt) // on met les bonnes distances en fonction du sport select
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const segmentedButtonCourse = document.getElementById("segmented-button-course")
    if (segmentedButtonCourse) {segmentedButtonCourse.addEventListener("click", () => {gererSegmentedButton(segmentedButtonCourse)})}
    
    const segmentedButtonVelo = document.getElementById("segmented-button-velo")
    if (segmentedButtonVelo) {segmentedButtonVelo.addEventListener("click", () => {gererSegmentedButton(segmentedButtonVelo)})}

    const segmentedButtonNatation = document.getElementById("segmented-button-natation")
    if (segmentedButtonNatation) {segmentedButtonNatation.addEventListener("click", () => {gererSegmentedButton(segmentedButtonNatation)})}
})