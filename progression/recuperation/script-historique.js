const containerLineHistorique = document.querySelector("section.container-historique-line")
let dataRecuperation = undefined

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