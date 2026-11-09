const containerLineHistorique = document.querySelector("section.container-historique-line")

function createCard(data) {
    if (containerLineHistorique) {
        let divCard = document.createElement("div")
        divCard.classList.add("card-historique-line")

        let spanDate = document.createElement("span")
        spanDate.classList.add("data")
        spanDate.id = "date"
        spanDate.textContent = data.date

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

async function init() {
    const dataRecuperation = await db.recuperation.orderBy("date").toArray()

    if (dataRecuperation.length > 0) {
        dataRecuperation.forEach(element => {
            createCard(element)
        });
    }
}

document.addEventListener("DOMContentLoaded", async() => {
    const segmentedButtonAnalyse = document.getElementById("segmented-button-analyse")
    if (segmentedButtonAnalyse) {segmentedButtonAnalyse.addEventListener("click", () =>{window.location.href = 'recuperation-analyse.html'})}

    await init()
})