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

async function gererSegmentedButton(newElt) {
    const lastEltSelected = document.querySelector("div.tabs-onglets.selected")
    if (lastEltSelected) {
        lastEltSelected.classList.remove("selected")
    }

    newElt.classList.add("selected")

    let sportNewElt = newElt.id.split("-")[2]
    if (dicoSportId[sportNewElt]) {
        gererDataOfSport(sportNewElt) // on met les bonnes distances en fonction du sport select
    }

    // on reformate le sport pour bien chercher dans la bdd
    if (sportNewElt == "course") {sportNewElt="Course"} else if (sportNewElt == "velo") {sportNewElt = "Vélo"} else {sportNewElt = "Natation"}
    await affichageRecord(sportNewElt)
}


async function affichageRecord(sport) {
    try {
        const recordData = await db.records.where("sport").equals(sport).toArray()
        if (recordData.length <=0) {
            const containerBlockData = document.querySelectorAll("p.container-block-data-data.skeleton")
            if (containerBlockData.length > 0) {
                containerBlockData.forEach(element => {
                    if (element) {
                        element.textContent = "--"
                        element.classList.remove("skeleton")
                    }
                });
            }

            const smallUnitElt = document.getElementById("unit-plus-longue-distance")
            if (smallUnitElt) {
                if (sport == "Natation") {
                    smallUnitElt.textContent = "m"
                } else {
                    smallUnitElt.textContent = "km"
                }
            }

        } else {
            recordData.forEach(element => {
                if (element.type_record) {
                    const eltHtml = document.getElementById(element.type_record)
                    if (eltHtml) {

                        if (element.type_record == "distance-plus-longue") {
                            eltHtml.textContent = element.distance
                            const smallUnit = document.createElement("small")
                            smallUnit.id = "unit-plus-longue-distance"

                            if (sport == "Natation") {
                                smallUnit.textContent = "m"
                            } else {
                                smallUnit.textContent = "km"
                            }

                            eltHtml.appendChild(smallUnit)
                        } else {
                            eltHtml.textContent = dureeFormatee(element.duree, "null")
                        }
                        eltHtml.classList.remove("skeleton")
                    }
                }
            });

        }

    } catch(error) {
        console.log(error)
        alert("Une erreur s'est produite lors la requête à la base de donnée.")
        return
    }
}

document.addEventListener("DOMContentLoaded", async() => {
    const tabsOngletCourse = document.getElementById("tabs-onglets-course")
    if (tabsOngletCourse) {tabsOngletCourse.addEventListener("click", async() => {await gererSegmentedButton(tabsOngletCourse)})}
    
    const tabsOngletVelo = document.getElementById("tabs-onglets-velo")
    if (tabsOngletVelo) {tabsOngletVelo.addEventListener("click", async() => {await gererSegmentedButton(tabsOngletVelo)})}

    const tabsOngletNatation = document.getElementById("tabs-onglets-natation")
    if (tabsOngletNatation) {tabsOngletNatation.addEventListener("click", async() => {await gererSegmentedButton(tabsOngletNatation)})}

    await affichageRecord("Course")
})