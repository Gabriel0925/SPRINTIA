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
    const lastEltSelected = document.querySelector("div.tabs-onglets.selected")
    if (lastEltSelected) {
        lastEltSelected.classList.remove("selected")
    }

    newElt.classList.add("selected")

    let sportNewElt = newElt.id.split("-")[2]
    if (dicoSportId[sportNewElt]) {
        gererDataOfSport(sportNewElt) // on met les bonnes distances en fonction du sport select
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const tabsOngletCourse = document.getElementById("tabs-onglets-course")
    if (tabsOngletCourse) {tabsOngletCourse.addEventListener("click", () => {gererSegmentedButton(tabsOngletCourse)})}
    
    const tabsOngletVelo = document.getElementById("tabs-onglets-velo")
    if (tabsOngletVelo) {tabsOngletVelo.addEventListener("click", () => {gererSegmentedButton(tabsOngletVelo)})}

    const tabsOngletNatation = document.getElementById("tabs-onglets-natation")
    if (tabsOngletNatation) {tabsOngletNatation.addEventListener("click", () => {gererSegmentedButton(tabsOngletNatation)})}
})