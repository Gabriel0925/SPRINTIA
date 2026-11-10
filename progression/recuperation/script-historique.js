const containerLineHistorique = document.querySelector("section.container-historique-line")
let dataRecuperation = undefined

function deleteButtonCard() {
    let buttonSupprimerClose = document.getElementById("supprimer")
    if (buttonSupprimerClose) {
        buttonSupprimerClose.remove()
    }
    let buttonModifierClose = document.getElementById("modifier")
    if (buttonModifierClose) {
        buttonModifierClose.remove()
    }
}
function createButtonCard(card, data) {
    // si la card n'est pas open on l'ouvre
    if (!card.classList.contains("open")) {
        // si ya une card qui est open on la referme et on supprime les boutons
        let carOpen = document.querySelector("section.container-historique-line div.card-historique-line.open")
        if (carOpen) {
            carOpen.classList.remove("open")
        }
        deleteButtonCard()

        // on ouvre la card et on créer les boutons
        card.classList.add("open")

        let buttonModifier = document.createElement("button")
        buttonModifier.classList.add("button-card-open")
        buttonModifier.id = "modifier"
        buttonModifier.textContent = "Modifier"

        let buttonSupprimer = document.createElement("button")
        buttonSupprimer.classList.add("button-card-open")
        buttonSupprimer.id = "supprimer"
        buttonSupprimer.textContent = "Supprimer"

        //  on leur donne un role
        buttonModifier.addEventListener("click", () => {
            window.location.href = `ajouter-recuperation.html?edit=${data.id}`
        })
        buttonSupprimer.addEventListener("click", async() => {
            if (confirm("Supprimer votre récupération du " + formatEuropeenDate(data.date) + " ?")) {
                await db.recuperation.delete(data.id)
                card.remove()
            }
        })

        // ajout dans la card
        card.appendChild(buttonModifier)
        card.appendChild(buttonSupprimer)
    } else { // si la card est open on la referme et on supprime les boutons
        card.classList.remove("open")

        deleteButtonCard()
    }
}
function createCard(data) {
    if (containerLineHistorique) {
        let divCard = document.createElement("div")
        divCard.classList.add("card-historique-line")

        let spanDate = document.createElement("span")
        spanDate.classList.add("data")
        spanDate.id = "date"
        spanDate.textContent = formatEuropeenDate(data.date)

        let divContainerData = document.createElement("div")
        divContainerData.classList.add("container-data")

        let spanFcRepos = document.createElement("span")
        spanFcRepos.classList.add("data")
        spanFcRepos.id = "fc-repos"
        spanFcRepos.textContent = data.fc_repos
        divContainerData.appendChild(spanFcRepos)

        let smallUnit = document.createElement("small")
        smallUnit.textContent = "bpm"
        divContainerData.appendChild(smallUnit)

        divCard.appendChild(spanDate)
        divCard.appendChild(divContainerData)

        // on lui donne un role
        divCard.addEventListener("click", (e) => {
            // si le click n'est pas sur un bouton on ouvre/ferme la card
            if (e.target.tagName !== "BUTTON") {
                createButtonCard(divCard, data)
            }
        })
        
        // on l'ajoute au container-principale
        containerLineHistorique.appendChild(divCard)

    } else {
        return undefined
    }
}

function findDataRecuperation(inputSearch) {
    let rechercheUser = inputSearch.value.toLowerCase()
    console.log(rechercheUser)
}

async function init() {
    dataRecuperation = await db.recuperation.orderBy("date").toArray()
    if (dataRecuperation.length <= 0) {dataRecuperation = undefined} 
    else {
        // si ya des datas on le reverse car quand on créer la première card ça doit être la plus ancienne et la deuxieme card doit être plus récent que la premiere card
        dataRecuperation.reverse()
    }

    if (dataRecuperation != undefined) {
        dataRecuperation.forEach(element => {
            createCard(element)

            if (containerLineHistorique.classList.contains("skeleton")) {
                containerLineHistorique.classList.remove("skeleton")
            }
        });
    } else {
        let visuelInformation = document.getElementById("aucune-data")
        if (visuelInformation) {visuelInformation.style.display = "flex"}

        let divInputSearch = document.querySelector("div.input-search")
        if (divInputSearch) {divInputSearch.style.display="none"}

        if (containerLineHistorique) {containerLineHistorique.style.display = "none"}
    }
}

document.addEventListener("DOMContentLoaded", async() => {
    const segmentedButtonAnalyse = document.getElementById("segmented-button-analyse")
    if (segmentedButtonAnalyse) {segmentedButtonAnalyse.addEventListener("click", () =>{window.location.href = 'recuperation-analyse.html'})}

    let inputSearch = document.getElementById("input-search")
    if (inputSearch) {inputSearch.addEventListener("input", () => {findDataRecuperation(inputSearch)})}

    let iconRecherche = document.querySelector("i.icon_search")
    if (iconRecherche) {iconRecherche.addEventListener("click", () => {document.getElementById('input-search').focus()})}

    await init()
})