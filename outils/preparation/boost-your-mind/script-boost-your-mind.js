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

function determinerIndexCurrentPhrase() {
    const pCurrently = document.querySelector("div.phrases p.currently")
    if (pCurrently) {
        const ensembleDesphrases = bddPhrases[ongletActuel]

        let index = -1 // on l'init à -1 pour éviter de switcher entre du undefined et du int
        let compteur = 0
        for (const elt of ensembleDesphrases) {
            if (elt == pCurrently.textContent) {
                index = compteur
            }

            compteur+=1
        }

        if (index <0) {
            return undefined
        } else {
            return index
        }

    } else {
        return undefined
    }
}

function parolesSuivantePrecedente(fleche) {
    const currentIndex = determinerIndexCurrentPhrase()
    // si on clique sur la fleche precedente alors on reprend les paroles de l'index avant -1
    // par contre si on fait suivant on ajoute 1 pour prendre les paroles suivantes
    let newCurrentIndex = currentIndex+1 // pour la fleche suivante
    if (fleche == "precedent") {
        newCurrentIndex = currentIndex-1 // pour la fleche précedente
    }

    if (bddPhrases[ongletActuel][newCurrentIndex]) {
        // on recup toutes les balises p pour les paroles
        const pPast = document.querySelector("div.phrases p.past") || undefined
        const pCurrently = document.querySelector("div.phrases p.currently") || undefined
        const pFuture = document.querySelector("div.phrases p.future") || undefined
        const pMore = document.querySelector("div.phrases p.more") || undefined

        // calcul des index
        const indexPast = newCurrentIndex-1
        const indexSuivant = newCurrentIndex+1
        const indexSuivantSuivant = newCurrentIndex+2

        // on remplit les p
        if (pPast!=undefined) {pPast.textContent = bddPhrases[ongletActuel][indexPast]}
        if (pCurrently!=undefined) {pCurrently.textContent = bddPhrases[ongletActuel][newCurrentIndex]}
        if (pFuture!=undefined) {pFuture.textContent = bddPhrases[ongletActuel][indexSuivant] || ""}
        if (pMore!=undefined) {pMore.textContent = bddPhrases[ongletActuel][indexSuivantSuivant] || ""}

        // désactivation/activation de la fleche haut ou bas quand on arrive à la fin ou au début du carrousel des paroles
        const flecheHaut = document.getElementById("precedent")
        if (flecheHaut) {
            if (bddPhrases[ongletActuel][indexPast]) {
                flecheHaut.classList.remove("desactiver")
            } else {
                flecheHaut.classList.add("desactiver")
            }
        }
        const flecheBas = document.getElementById("suivant")
        if (flecheBas) {
            if (bddPhrases[ongletActuel][indexSuivant]) {
                flecheBas.classList.remove("desactiver")
            } else {
                flecheBas.classList.add("desactiver")
            }
        }

    } else {
        console.log("c'est finit")
    }

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
                elt.textContent = "" // on met rien car ya aucune phrase avant le début
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

    const flechePrecedent = document.getElementById("precedent")
    if (flechePrecedent) {
        flechePrecedent.addEventListener("click", () => {parolesSuivantePrecedente("precedent")})
    }
    const flecheSuivant = document.getElementById("suivant")
    if (flecheSuivant) {
        flecheSuivant.addEventListener("click", () => {parolesSuivantePrecedente("suivant")})
    }

    init()
})