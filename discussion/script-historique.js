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
    divCard.appendChild(paragrapheQuestion)
    divCard.appendChild(paragrapheDate)

    // on ajoute la carte au conteneur
    containerCard.appendChild(divCard)

    if (containerCard.classList.contains("skeleton")) {
        containerCard.classList.remove("skeleton")
    }
}

async function init() {
    const historiqueDiscussion = await db.discussion.toArray()

    if (historiqueDiscussion.length > 0) { // si ya des datas
        historiqueDiscussion.forEach(dataDiscussion => {
            createCard(dataDiscussion.date, dataDiscussion.question, dataDiscussion.id)
        });
    } else {
        document.getElementById("aucune-data").style.display = "flex" // on affiche le visuel quand ya aucune ancienne discussion
        document.querySelector("div.input-search").style.display = "none" // on cache la barre de recherche
        document.querySelector("div.container-card-prompt.skeleton").style.display = "none" // on cache le conteneur de card
    }
}

window.addEventListener("DOMContentLoaded", async() =>{
    await init()
})