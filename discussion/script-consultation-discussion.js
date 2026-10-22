const dicoMois = {
    "01": "Jan.",
    "02": "Fév.",
    "03": "Mars",
    "04": "Avr.",
    "05": "Mai",
    "06": "Juin",
    "07": "Juil.",
    "08": "Août",
    "09": "Sep.",
    "10": "Oct.",
    "11": "Nov.",
    "12": "Déc."
}

function cleanDate(date) {
    let datePropre = date.split("-") // [22, 10, 2026]
    return datePropre[0] + " " + dicoMois[datePropre[1]] + " " + datePropre[2]
}

async function init(id) {
    const dataOfThisDiscussion = await db.discussion.get(id)

    // si l'id n'existe pas dans la bdd alors on revient à l'historique
    if (dataOfThisDiscussion == undefined) {
        window.location.href = "historique.html"
        return
    }

    let date = formatEuropeenDate(dataOfThisDiscussion.date)
    document.getElementById("date").textContent = cleanDate(date)
    document.getElementById("date").classList.remove("skeleton")

    document.getElementById("question").textContent = dataOfThisDiscussion.question
    document.getElementById("question").classList.remove("skeleton")

    document.getElementById("prompt").textContent = dataOfThisDiscussion.prompt
    document.getElementById("prompt").classList.remove("skeleton")

    // on donne un role au suppr et au copier
    const buttonToolbarSuprr = document.querySelector("i.icon_supprimer")
    if (buttonToolbarSuprr) {
        buttonToolbarSuprr.addEventListener("click",async () => {
            if (confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) {
                try {
                    await db.discussion.delete(id)

                    window.location.href = "historique.html"
                } catch(error) {
                    console.log(error)
                    alert("Une erreur s'est produite lors de la suppression de cette question.")
                }
            }
        })
    }

    const buttonCopy = document.querySelector("i.icon_copy")
    if (buttonCopy) {
        buttonCopy.addEventListener("click",async () => {
            navigator.clipboard.writeText(dataOfThisDiscussion.prompt)
            .then(async() => {
                logoDynamique("📋 Copié !")
            }).catch(error => {
                console.log(error)
                alert("Une erreur s'est produite lors de la copie du prompt dans votre papier presse.")
                return
            })
        })
    }
}

window.addEventListener("DOMContentLoaded", async () => {
    const id = Number(window.location.search.split("=")[1]) // '?discussion=44' -> ['?discussion', '44'] -> '44' -> 44
    if (id == undefined) { // si ya pas d'id dans l'url alors on revient à l'historique
        window.location.href = "historique.html"
    }

    await init(id)
})