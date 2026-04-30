async function saveRecuperation() {
    alert("Pas encore disponible")
    return
}

function init() {
    let zoneReponseCoach = document.getElementById("reponse-coach")
    let interpretation = "Pour analyser ta récupération, j'ai besoin de 7 jours d'affiler de données pour pouvoir."

    zoneReponseCoach.innerHTML = interpretation

    // generation du graphique
    genererGraphiqueLine(["L", "M", "M", "J", "V"], [45, 47, 49, 46, 43])

    return
}

window.addEventListener("DOMContentLoaded", init())