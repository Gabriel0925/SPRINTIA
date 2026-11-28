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


function resetParagraphe() {
    const paragrapheData = document.querySelectorAll("p.container-block-data-data")
    if (paragrapheData.length > 0) {
        paragrapheData.forEach(element => {
            // si ils n'ont pas la class skeleton on remet tout avec des skeletons avant de charger des new data
            if (!element.classList.contains("skeleton")) {
                element.textContent = ""
                element.classList.add("skeleton")
            }
        });
    }
}
async function affichageRecord(sport) {
    resetParagraphe()

    try {
        const recordData = await db.records.where("sport").equals(sport).toArray()

        for (const elt of recordData) {
            if (elt.type_record) {
                const eltHtml = document.getElementById(elt.type_record)
                const dataWorkout = await db.entrainement.get(elt.id_entrainement)

                if (eltHtml && dataWorkout != undefined) {
                    // on recreer une balise small avec l'unité du sport mais uniquement pour l'elt html avec l'id "distance-plus-longue"
                    if (elt.type_record == "distance-plus-longue") {
                        if (dataWorkout.distance) {
                            // si c'est en natation on convertit la distance des km ->m
                            if (sport == "Natation") {
                                eltHtml.textContent = Number(dataWorkout.distance*1000).toFixed(2).toString().replace(".", ",")
                            } else {
                                eltHtml.textContent = dataWorkout.distance.toFixed(2).toString().replace(".", ",")
                            }

                            const smallUnit = document.createElement("small")
                            smallUnit.id = "unit-plus-longue-distance"

                            if (sport == "Natation") {smallUnit.textContent = "m"} else {smallUnit.textContent = "km"}
                            eltHtml.appendChild(smallUnit)
                        }

                    } else {
                        if (dataWorkout.duree) {
                            eltHtml.textContent = dureeFormatee(dataWorkout.duree, "null")
                        }
                    }

                    // on attribue un click à cet eltHtml pour ouvrir l'entraînement direct
                    if (dataWorkout.id && eltHtml.parentElement) {
                        // on réinitialise l'ancien eltHtml onclick
                        eltHtml.parentElement.onclick = null
                        // on prend la card et pas le p grâce à parentElement
                        eltHtml.parentElement.onclick = () => {window.location.href = `../../entrainement/entrainement.html?workout=${dataWorkout.id}`}
                    }

                    eltHtml.classList.remove("skeleton")
                }
            }
        }

        // si il reste des P avec des skeleton on ne met rien dans leurs champs
        const containerBlockData = document.querySelectorAll("p.container-block-data-data.skeleton")
        if (containerBlockData.length > 0) {
            containerBlockData.forEach(element => {
                if (element) {
                    element.textContent = "--"
                            
                    // on recreer une balise small avec l'unité du sport mais uniquement pour l'elt html avec l'id "distance-plus-longue"
                    if (element.id == "distance-plus-longue") {
                        const smallUnit = document.createElement("small")
                        smallUnit.id = "unit-plus-longue-distance"

                        if (sport == "Natation") {
                            smallUnit.textContent = "m"
                        } else {
                            smallUnit.textContent = "km"
                        }
                        element.appendChild(smallUnit)
                    }

                    // on attribue un click à cet eltHtml pour ouvrir l'entraînement direct
                    if (element.parentElement) {
                        // on réinitialise l'ancien eltHtml onclick
                        element.parentElement.onclick = null
                        // on prend la card et pas le p grâce à parentElement
                        element.parentElement.onclick = () => {alert("Il n'y a pas de record pour ce type de record particulier.")}
                    }

                    element.classList.remove("skeleton")
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

    const buttonRefreshRecord = document.getElementById("button-refresh-records")
    if (buttonRefreshRecord) {
        buttonRefreshRecord.addEventListener("click", async() => {
            if (confirm("Êtes-vous sûr de vouloir recalculer tous vos records personnels ?")) {
                let thereIsError = await refreshRecord()

                // on reformate le sport pour bien chercher dans la bdd
                let sportSelect = document.querySelector(".tabs-onglets.selected").id.split("-")[2]
                if (sportSelect == "course") {sportSelect="Course"} else if (sportSelect == "velo") {sportSelect = "Vélo"} else {sportSelect = "Natation"}
                await affichageRecord(sportSelect)
                if (thereIsError == "error") {
                    alert("Une erreur s'est produite lors du recalcule de vos records personnels !")
                }
            }
        })
    }

    await affichageRecord("Course")
})