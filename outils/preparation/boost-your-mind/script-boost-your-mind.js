const bddPhrases = {
    "remotivation": [
        "Tu ne peux pas apprendre à voler sans t'écraser au sol au moins une fois.",
        "C'est dur mais parfois il y a certaines choses qu'on ne peut pas éviter, tout ce qu'on peut faire c'est essayer de vivre avec.",
        "Le travail finira toujours par surpasser le talent.",
        "Si tu ne le fais pas maintenant, tu ne le feras sans doute pas plus tard.",
        "Rappelle-toi pourquoi tu as commencé et tu ne repenseras plus jamais à arrêter.",
        "Si c'était facile tout le monde l'aurait fait.",
        "Ta seule concurrence c'est la personne que tu étais hier.",
        "Parfois on perd, parfois on gagne et c'est comme ça!",
        "Si tu rêves aussi grand, c'est parce que cette version de toi existe déjà dans le futur.",
        "Personne ne viendra le faire à ta place alors écris ton histoire.",
        "Dans 6 mois, tu te diras 'Heureusement que j'ai continué!' alors avance."
    ],
    "mental": [
        "Quelques minutes de sport c'est quoi dans ta vie?",
        "C'est quand tu es dans le dur que tu progresses vraiment!",
        "Ne laisse pas ta peur te contrôler.",
        "C'est dur ? Pense à cette personne, ferme les yeux et avance.",
        "Pense toujours à la sensation que tu obtiens après le sport.",
        "Tu as la chance d'avoir un corps qui puisse faire du sport, alors honore-le.",
        "Quand ton cerveau te dit d'arrêter, continue, pousse encore un peu, tu serais étonné de là où tu peux aller."
    ],
    "confiance": [
        "La clé de la victoire c'est la patience et la régularité.",
        "Parfois, le mieux que tu puisses faire, c'est d'arrêter de stresser pour le futur et simplement profiter de là où tu es.",
        "C'est la peur qui t'empêche de faire tout ce que tu devrais faire.",
        "La grandeur demande du temps.",
        "La seule façon d'échouer, c'est d'abandonner!",
        "Je suis sûr que tu te fais du mal, arrête de penser au négatif et pense plutôt au positif.",
        "Un esprit négatif ne t'offrira jamais des résultats positifs.",
        "Regarde tout le chemin que tu as parcouru : tu as déjà fait le plus dur en décidant de t'y mettre.",
        "Pendant que tu doutes de toi, certaines personnes aimeraient être à ta place, alors avance et profite.",
        "N'attends pas d'être parfait pour être fier de ce que tu accomplis aujourd'hui."
    ]
}
let ongletActuel = "remotivation"

// voir "https://fr.javascript.info/task/shuffle"
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}
Object.keys(bddPhrases).forEach(cle => {
    shuffle(bddPhrases[cle]) // on mélange chaque tableau du dico alétoirement
});

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
    // on met la bonne classe au container
    const containerPhrase = document.querySelector("section.container-phrase")
    if (containerPhrase) {
        // on supprime l'ancienne classe
        containerPhrase.classList.remove("remotivation")
        containerPhrase.classList.remove("confiance")
        containerPhrase.classList.remove("mental")

        containerPhrase.classList.add(ongletActuel) // on ajoute la bonne classe
    }

    // on remplit les p
    const allP = document.querySelectorAll("div.track-phrase div.phrases p")

    if (allP.length>0) {
        // on desactive la fleche du haut car on peut pas remonter lors de l'init
        const buttonFlecheHaut = document.getElementById("precedent")
        if (buttonFlecheHaut) {buttonFlecheHaut.classList.add("desactiver")}

        const buttonFlecheBas = document.getElementById("suivant")
        if (buttonFlecheBas) {buttonFlecheBas.classList.remove("desactiver")}

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