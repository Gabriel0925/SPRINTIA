// variable globale
let nbCardsAfficher = 0 
let nbTotalCardsAfficher = parseInt(sessionStorage.getItem("nbCardDiscussionSave")) || 12
let historiqueComplet = []

function createCard(date, question, id) {
    const divCard = document.createElement("div")
    divCard.classList.add("card-prompt")
    divCard.addEventListener("click", () => {
        window.location.href = `consultation-discussion.html?discussion=${id}`
    })

    const paragrapheQuestion = document.createElement("p")
    paragrapheQuestion.classList.add("question-user")
    paragrapheQuestion.textContent = question

    const paragrapheDate = document.createElement("p")
    paragrapheDate.classList.add("date")
    paragrapheDate.textContent = date

    const containerCard = document.querySelector("div.container-card-prompt")
    
    // maintenant on assemble tout

    // on ajoute tout dans la carte
    divCard.appendChild(paragrapheDate)
    divCard.appendChild(paragrapheQuestion)

    // on ajoute la carte au conteneur
    containerCard.appendChild(divCard)

    if (containerCard.classList.contains("skeleton")) {
        containerCard.classList.remove("skeleton")
    }
}

function affichageCard() {
    // si ya moins de 12 discussions on affiche pas le button plus
    if (historiqueComplet.length <= 12) {
        document.getElementById("button_afficher_plus").style.display = "none"
    }
    // si il n'y a plus de cartes a ajouter on fais disparaitre le bouton voir plus
    if (historiqueComplet.length <= nbCardsAfficher) {
        document.getElementById("button_afficher_plus").style.display = "none"
    } else {
        document.getElementById("button_afficher_plus").style.display = "block"
    }

    let historiqueSaveForAfficher = historiqueComplet.slice(nbCardsAfficher, nbTotalCardsAfficher)
    historiqueSaveForAfficher.forEach(dataDiscussion => {
        createCard(dataDiscussion.date, dataDiscussion.question, dataDiscussion.id)
    })
        
    // maj de la variable 
    nbCardsAfficher = nbTotalCardsAfficher

    if (nbCardsAfficher > 12) {
        sessionStorage.setItem("nbCardDiscussionSave", nbCardsAfficher)
    }
}

async function init() {
    const historiqueDiscussion = await db.discussion.toArray()

    if (historiqueDiscussion.length > 0) { // si ya des datas
        historiqueDiscussion.forEach(elt => {
            historiqueComplet.push(elt) // on ajoute tout dans un tableau pour éviter de faire trop de requete à la bdd
        });

        affichageCard()

    } else {
        document.getElementById("aucune-data").style.display = "flex" // on affiche le visuel quand ya aucune ancienne discussion
        document.querySelector("div.input-search").style.display = "none" // on cache la barre de recherche
        document.querySelector("div.container-card-prompt.skeleton").style.display = "none" // on cache le conteneur de card
        document.getElementById("button_afficher_plus").style.display = "none" // on cache le bouton afficher plus
    }
}

window.addEventListener("DOMContentLoaded", async() =>{
    const buttonAfficherPlus = document.getElementById("button_afficher_plus")
    if (buttonAfficherPlus) {
        buttonAfficherPlus.addEventListener("click", () => {
            nbCardsAfficher += 12
            affichageCard()
        })
    }

    await init()
})