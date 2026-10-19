const ideasQuestions = {
    "recuperation": [
        "Pourquoi je suis fatigué aujourd'hui?",
        "Analyse ma récupération du jour",
        "Ma FC de repos est-elle bonne?",
        "Est-ce que je suis assez reposé pour m'entraîner?",
        "Comment accélérer ma récupération aujourd'hui?",
        "Donne-moi des conseils pour mieux dormir ce soir.",
        "Douche chaude ou froide après mon entraînement?"
    ],
    "entrainement": [
        "Donne-moi une idée d'entraînement pour aujourd'hui.",
        "Analyse le dernier entraînement que j'ai effectué.",
        "Planifie ma semaine d'entraînement en fonction de mes derniers entraînements.",
        "Quelle allure je devrais viser pour ma prochaine course?",
        "Y a-t-il des courses prochainement autour de chez moi?",
        "Donne-moi des idées d'objectifs à réaliser ce mois-ci.",
        "Comment courir plus vite?",
        "Comment améliorer mon endurance?",
        "Donne-moi 3 conseils pour améliorer ma VMA.",
        "C'est quoi la VMA et à quoi ça sert?",
        "Créer un entraînement basé sur ma récupération.",
        "Quels exercices de renforcement faire pour devenir plus rapide?"
    ],
    "conseils": [
        "Donne-moi 3 exercices de récupération active.",
        "Comment m'échauffer correctement?",
        "Quelles sont les erreurs à ne pas faire le jour d'une course?",
        "Quels aliments manger avant un entraînement?",
        "Puis-je m'entraîner en étant malade?",
        "Motive moi à aller m'entraîner aujourd'hui!"
    ]
}

function generateNbAleatoire() {
    const nbAleatoireForRecuperation = Math.floor(Math.random() * ideasQuestions["recuperation"].length)
    const nbAleatoireForEntrainement = Math.floor(Math.random() * ideasQuestions["entrainement"].length)
    const nbAleatoireForConseils = Math.floor(Math.random() * ideasQuestions["conseils"].length)

    return [nbAleatoireForRecuperation, nbAleatoireForEntrainement, nbAleatoireForConseils]
}

function raccourciPrompt() {
    const tableauNbAleatoire = generateNbAleatoire() // ça renvoie un tableau avec le nombre aléatoire pour [recuperation, entrainement, conseils]

    // on va cherche les phrases correspondante dans le dico
    const ideasForRecup = ideasQuestions["recuperation"][tableauNbAleatoire[0]]
    const ideasForEntrainement = ideasQuestions["entrainement"][tableauNbAleatoire[1]]
    const ideasForConseils = ideasQuestions["conseils"][tableauNbAleatoire[2]]

    // création d'un tableau pour ensuite pouvoir chercher avec un compteur ses phrases dans la boucle for
    const tableauIdeas = [ideasForRecup, ideasForEntrainement, ideasForConseils]

    const allIdeePrompt = document.querySelectorAll(".idee-prompt")
    if (allIdeePrompt) {
        let compteur = 0
        for (const elt of allIdeePrompt) {
            const ideasCorrespondante = tableauIdeas[compteur]

            elt.classList.remove("skeleton") // on enleve les loaders
            elt.textContent = ideasCorrespondante // on attribue une phrase à un element

            // on ajoute un onclick
            elt.addEventListener("click", () => {
                const inputForPrompt = document.getElementById("promt-user")
                if (inputForPrompt) {
                    if (inputForPrompt.value != "") { // si le user a déjà mis qqch dans le textarea
                        // pour éviter d'effacer le prompt que le user était potentiellement en train de taper
                        if (confirm("Êtes-vous sur de vouloir continuer car le prompt que vous étiez en train d'écrire va être effacé ?")) {
                            inputForPrompt.value = ideasCorrespondante // on met le texte de l'élement dans l'input (enfin le textarea)
                        }
                    } else {
                        inputForPrompt.value = ideasCorrespondante // on met le texte de l'élement dans l'input (enfin le textarea)
                    }
                }
            })

            compteur+=1
        }

    }
}

async function affichageStyleCoach() {
    const dataCoach = await db.JRM_Coach.get(1)
    let styleCoach = "Bienveillant"
    if (dataCoach != undefined) { // si ya des données alors on change la var
        styleCoach=dataCoach.style
    }

    const allSVG = document.querySelectorAll("div.container-avatar svg")
    if (allSVG) {
        for (const elt of allSVG) {
            elt.style.display = "none"
        }
    }

    const convertisseurNameId = {
        "Bienveillant": "bienveillant",
        "Strict-Motivant": "strict-motivant",
        "Copain": "copain",
    }
    document.getElementById(convertisseurNameId[styleCoach]).style.display = "block"    
    document.querySelector(".container-avatar.skeleton").classList.remove("skeleton")
}

document.addEventListener("DOMContentLoaded", async() => {
    const buttonAnalyse = document.getElementById("button-SPRINTIA-analyse-ask")
    if (buttonAnalyse) {
        buttonAnalyse.addEventListener("click", () => {
            if (!document.getElementById('promt-user').value.trim()) {
                alert('Veuillez ajouter votre question dans le champs de texte avant de vouloir demander à une IA.')
            } else {
                windowsAnalyse('Demander à Vibe')
            }
        })
    }
    const buttonCopy = document.getElementById("copy")
    if (buttonCopy) {buttonCopy.addEventListener("click", () => {copyPrompt()})}

    await affichageStyleCoach()
    raccourciPrompt()
})