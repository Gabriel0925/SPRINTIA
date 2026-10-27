const bddPhrases = {
    "remotivation": [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
    ],
    "mental": [
        "11",
        "22",
        "33",
        "44",
        "55",
        "66",
    ],
    "confiance": [
        "111",
        "222",
        "333",
        "444",
        "555",
        "666",
    ]
}
let ongletActuel = "remotivation"

function gererTabsOnglets(idElement) {
    const tabsOngletsSelectionner = document.querySelector("div.tabs-onglets.selected")
    if (tabsOngletsSelectionner) {
        tabsOngletsSelectionner.classList.remove("selected")
    }

    const newSelected = document.getElementById(idElement)
    if (newSelected) {
        newSelected.classList.add("selected")
        ongletActuel = newSelected.id.split("-")[2] // "tabs-onglets-mental" -> "['tabs', 'onglets', 'mental']" -> "mental"
        init()
    }
}

function flecheSuivant() {

}
function flechePrecedent() {
    
}

function init() {
    const allP = document.querySelectorAll("div.track-phrase div.phrases p")

    if (allP.length>0) {
        // on desactive la fleche du haut car on peut pas remonter lors de l'init
        const flecheHaut = document.getElementById("precedent")
        if (flecheHaut) {
            flecheHaut.classList.add("desactiver")
        }

        for (const elt of allP) {
            if (elt.classList == "past") {
                // on fait rien car il n'y a pas de phrases passée
            } else if (elt.classList == "currently") {
                elt.textContent = bddPhrases[ongletActuel][0]
            } else if (elt.classList == "future") {
                elt.textContent = bddPhrases[ongletActuel][1]
            } else if (elt.classList == "more") {
                elt.textContent = bddPhrases[ongletActuel][2]
            }
        }

    }
}

window.addEventListener("DOMContentLoaded", () => {
    const tabsOngletsRemotivation = document.getElementById("tabs-onglets-remotivation")
    if (tabsOngletsRemotivation) {
        tabsOngletsRemotivation.addEventListener("click", () => {
            gererTabsOnglets("tabs-onglets-remotivation")
        })
    }

    const tabsOngletsMental = document.getElementById("tabs-onglets-mental")
    if (tabsOngletsMental) {
        tabsOngletsMental.addEventListener("click", () => {
            gererTabsOnglets("tabs-onglets-mental")
        })
    }

    const tabsOngletsConfiance = document.getElementById("tabs-onglets-confiance")
    if (tabsOngletsConfiance) {
        tabsOngletsConfiance.addEventListener("click", () => {
            gererTabsOnglets("tabs-onglets-confiance")
        })
    }

    init()
})