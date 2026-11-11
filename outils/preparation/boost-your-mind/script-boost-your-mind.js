const bddPhrases = {
    "remotivation": [
        "Tu ne peux pas apprendre à voler sans t'écraser au sol au moins une fois.",
        "Le travail finira toujours par surpasser le talent.",
        "Si tu ne le fais pas maintenant, tu ne le feras sans doute pas plus tard.",
        "Rappelle-toi pourquoi tu as commencé et tu ne repenseras plus jamais à arrêter.",
        "Si c'était facile, tout le monde l'aurait fait.",
        "Ta seule concurrence, c'est la personne que tu étais hier.",
        "Parfois on perd, parfois on gagne et c'est comme ça!",
        "Si tu rêves aussi grand, c'est parce que cette version de toi existe déjà dans le futur.",
        "Personne ne viendra le faire à ta place alors écris ton histoire.",
        "Dans 6 mois, tu te diras 'Heureusement que j'ai continué!' alors avance."
    ],
    "mental": [
        "Quelques minutes de sport, c'est quoi dans ta vie?",
        "C'est quand tu es dans le dur que tu progresses vraiment!",
        "Ne laisse pas ta peur te contrôler.",
        "C'est dur ? Pense à cette personne, ferme les yeux et avance.",
        "Pense toujours à la sensation que tu obtiens après le sport.",
        "Tu as la chance d'avoir un corps qui puisse faire du sport, alors honore-le.",
        "Accepte l'inconfort, c'est le prix à payer pour progresser",
        "Le corps fait ce que l'esprit lui ordonne de faire.",
        "Quand ton cerveau te dit d'arrêter, continue, pousse encore un peu, tu serais étonné de là où tu peux aller."
    ],
    "confiance": [
        "La clé de la victoire c'est la patience et la régularité.",
        "Parfois, le mieux que tu puisses faire, c'est d'arrêter de stresser pour le futur et simplement profiter de là où tu es.",
        "C'est la peur qui t'empêche de faire tout ce que tu devrais faire.",
        "La grandeur demande du temps.",
        "La seule façon d'échouer, c'est d'abandonner!",
        "Arrête de te faire du mal, concentre-toi sur le positif.",
        "Un esprit négatif ne t'offrira jamais des résultats positifs.",
        "Regarde tout le chemin que tu as parcouru : tu as déjà fait le plus dur en décidant de t'y mettre.",
        "Pendant que tu doutes de toi, certaines personnes aimeraient être à ta place, alors avance et profite.",
        "N'attends pas d'être parfait pour être fier de ce que tu accomplis aujourd'hui."
    ]
}
let ongletActuel = localStorage.getItem("last_onglet_Boost_your_Mind") || "remotivation"

// voir "https://fr.javascript.info/task/shuffle"
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}
function shuffleAllPhrases() {
    Object.keys(bddPhrases).forEach(cle => {
        shuffle(bddPhrases[cle]) // on mélange chaque tableau du dico alétoirement
    });
}

function refresh() {
    let firstPhraseBeforeRefresh = bddPhrases[ongletActuel][0]
    shuffleAllPhrases();
    let firstPhraseAfterRefresh = bddPhrases[ongletActuel][0]

    while (firstPhraseBeforeRefresh == firstPhraseAfterRefresh) {
        // si la première phrase est la même après le refresh alors on refait un shuffle
        shuffleAllPhrases();
        firstPhraseAfterRefresh = bddPhrases[ongletActuel][0]
    }

    init();
}

function gererTabsOnglets(idElement) {
    const tabsOngletsSelectionner = document.querySelector("div.tabs-onglets.selected")
    if (tabsOngletsSelectionner) {
        tabsOngletsSelectionner.classList.remove("selected")
    }

    const newSelected = document.getElementById(idElement)
    if (newSelected) {
        newSelected.classList.add("selected")
        ongletActuel = newSelected.id.split("-")[2] // "tabs-onglets-mental" -> "['tabs', 'onglets', 'mental']" -> "mental"
        localStorage.setItem("last_onglet_Boost_your_Mind", ongletActuel)
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

function createParaPast(phrase, divPhrases, fleche) {
    let pPast = document.createElement("p")
    pPast.classList.add("past")
    pPast.textContent = phrase

    if (fleche == "precedent") {
        pPast.classList.add("precedent")
    }

    divPhrases.appendChild(pPast)
}
function createParaCurrently(phrase, divPhrases, fleche) {
    let pCurrently = document.createElement("p")
    pCurrently.classList.add("currently")
    pCurrently.textContent = phrase

    if (fleche == "precedent") {
        pCurrently.classList.add("precedent")
    }
    divPhrases.appendChild(pCurrently)
}
function createParaFuture(phrase, divPhrases, fleche) {
    let pFuture = document.createElement("p")
    pFuture.classList.add("future")
    pFuture.textContent = phrase

    if (fleche == "precedent") {
        pFuture.classList.add("precedent")
    }

    divPhrases.appendChild(pFuture)
}
function createParaMore(phrase, divPhrases, fleche) {
    let pMore = document.createElement("p")
    pMore.classList.add("more")
    pMore.textContent = phrase

    if (fleche == "precedent") {
        pMore.classList.add("precedent")
    }

    divPhrases.appendChild(pMore)
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
        // on supprime les p existants
        let allP = document.querySelectorAll("div.track-phrase div.phrases p")
        for (const elt of allP) {
            elt.remove()
        }
        
        // calcul des index
        const indexPast = newCurrentIndex-1
        const indexSuivant = newCurrentIndex+1
        const indexSuivantSuivant = newCurrentIndex+2
        const divPhrases = document.querySelector("div.track-phrase div.phrases")

        if (divPhrases) {
            // on crée les p avec les nouvelles phrases
            createParaPast(bddPhrases[ongletActuel][indexPast] || "", divPhrases, fleche)
            createParaCurrently(bddPhrases[ongletActuel][newCurrentIndex], divPhrases, fleche)
            createParaFuture(bddPhrases[ongletActuel][indexSuivant] || "", divPhrases, fleche)
            createParaMore(bddPhrases[ongletActuel][indexSuivantSuivant] || "", divPhrases, fleche)
        }

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
    // on met la bonne classe au container
    const containerPhrase = document.querySelector("section.container-phrase")
    if (containerPhrase) {
        // on supprime l'ancienne classe
        containerPhrase.classList.remove("remotivation")
        containerPhrase.classList.remove("confiance")
        containerPhrase.classList.remove("mental")

        containerPhrase.classList.add(ongletActuel) // on ajoute la bonne classe
    }
    // puis on selectionne le bon onglet
    if (ongletActuel != "remotivation") {
        const dicoIdNameOnglet = {
            "remotivation": "tabs-onglets-remotivation",
            "mental": "tabs-onglets-mental",
            "confiance": "tabs-onglets-confiance",
        }
        const newSelectedOnglet = document.getElementById(dicoIdNameOnglet[ongletActuel])
        if (newSelectedOnglet) {
            // on déséléctionne le selected actuellement
            document.querySelector("div.tabs-onglets.selected").classList.remove("selected")

            // on met le nouveau seleted
            newSelectedOnglet.classList.add("selected")
        }
    }

    // on remplit les p
    const allP = document.querySelectorAll("div.track-phrase div.phrases p")
    // on supprime les p existants
    for (const elt of allP) {
        elt.remove()
    }

    const divPhrases = document.querySelector("div.track-phrase div.phrases")
    if (divPhrases) {
        // on créer les nouveaux p avec les phrases d'init
        createParaPast("", divPhrases, "suivant")
        createParaCurrently(bddPhrases[ongletActuel][0], divPhrases, "suivant")
        createParaFuture(bddPhrases[ongletActuel][1], divPhrases, "suivant")
        createParaMore(bddPhrases[ongletActuel][2], divPhrases, "suivant")
    }
    
    // on desactive la fleche du haut car on peut pas remonter lors de l'init
    const buttonFlecheHaut = document.getElementById("precedent")
    if (buttonFlecheHaut) {buttonFlecheHaut.classList.add("desactiver")}

    const buttonFlecheBas = document.getElementById("suivant")
    if (buttonFlecheBas) {buttonFlecheBas.classList.remove("desactiver")}

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
    const autorenew = document.getElementById("refresh")
    if (autorenew) {
        autorenew.addEventListener("click", () => {refresh()})
    }
    const flecheSuivant = document.getElementById("suivant")
    if (flecheSuivant) {
        flecheSuivant.addEventListener("click", () => {parolesSuivantePrecedente("suivant")})
    }

    shuffleAllPhrases()
    init()
})