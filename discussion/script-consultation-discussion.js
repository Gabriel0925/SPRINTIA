async function init(id) {
    const dataOfThisDiscussion = await db.discussion.get(id)

    // si l'id n'existe pas dans la bdd alors on revient à l'historique
    if (dataOfThisDiscussion == undefined) {
        window.location.href = "historique.html"
        return
    }

    document.getElementById("date").textContent = dataOfThisDiscussion.date
    document.getElementById("question").textContent = dataOfThisDiscussion.question
    document.getElementById("prompt").textContent = dataOfThisDiscussion.prompt

    console.log(dataOfThisDiscussion)
}

window.addEventListener("DOMContentLoaded", async () => {
    const id = Number(window.location.search.split("=")[1]) // '?discussion=44' -> ['?discussion', '44'] -> '44' -> 44
    if (id == undefined) { // si ya pas d'id dans l'url alors on revient à l'historique
        window.location.href = "historique.html"
    }

    await init(id)
})