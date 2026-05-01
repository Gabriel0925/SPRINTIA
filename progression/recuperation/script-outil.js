const week = ["D", "L", "M", "M", "J", "V", "S"]
// dico pour savoir quelle jour a va chercher ex on est vendredi qui est à l'index 5 dans la liste ci-dessus
// donc on doit prendre les 5 derniers jours, il nous faut Vendredi, Jeudi, Mercredi, Mardi, Lundi, Dimanche, Samedi
// et ces jours la ils sont dans ce dico avec la liste qui possède les index [5, 4, 3, 2, 1, 0, 6]
const dicoNumDay = {
    0:[0, 6, 5, 4, 3, 2, 1],
    1:[1, 0, 6, 5, 4, 3, 2],
    2:[2, 1, 0, 6, 5, 4, 3],
    3:[3, 2, 1, 0, 6, 5, 4],
    4:[4, 3, 2, 1, 0, 6, 5],
    5:[5, 4, 3, 2, 1, 0, 6],
    6:[6, 5, 4, 3, 2, 1, 0]
}

// date
let numeroDuJour = new Date()
numeroDuJour = numeroDuJour.getDay() // pour récupérer le numéro de la semaine, exemple 0 pour Dimanche
let listeIndex7derniersJours = dicoNumDay[numeroDuJour] // recup de la liste dans le dico
listeIndex7derniersJours = listeIndex7derniersJours.reverse() // on inverse la liste pour que ça soit dans le bon ordre pour le graphique
let thisWeekForGraphic = []

listeIndex7derniersJours.forEach(element => {
    thisWeekForGraphic.push(week[element])
});

async function saveRecuperation() {
    // recup
    let champsDate = document.getElementById("date-recuperation").value
    let champsFcRepos = parseInt(document.getElementById("fc-repos-recuperation").value)
    let BoutonSauvegarde = document.getElementById("button-sauvegarder")

    // verif des champs
    if (!champsDate || !champsFcRepos || isNaN(champsFcRepos)) {
        alert("Les champs avec '*' sont obligatoire, vous devez les remplir.")
        return
    }

    // Prépa date pour les comparer ensuite
    const dateUserFormatee = new Date(champsDate)
    const dateActuelle = new Date()
    if (dateUserFormatee > dateActuelle) { // Comparaison de 2 dates
        alert("La date ne peut pas être dans le future.")
        return
    }
    
    if (champsFcRepos <= 0) {
        alert("Valeur non valide, la FC repos doit être un nombre supérieur à 0.")
        return
    }
    if (champsFcRepos < 20 || champsFcRepos > 140) {
        alert("Valeur non valide, la fréquence cardiaque de repos doit être un nombre compris entre 20 et 140 bpm.")
        return
    }

    // sauvegarde

    // Transmet l'info au user
    BoutonSauvegarde.disabled = true 
    BoutonSauvegarde.textContent = "Sauvegarde..."

    setTimeout(() => {
        BoutonSauvegarde.textContent = "Sauvegarder"
        BoutonSauvegarde.disabled = false

        //window.location.href = `recuperation.html?recuperationregister` // on met un param dans l'URL pour le logo dynamique
    }, 800)

    return
}

function init() {
    let zoneReponseCoach = document.getElementById("reponse-coach")
    let interpretation = "Pour analyser ta récupération, j'ai besoin de 7 jours d'affilée de FC repos pour comparer ta FC repos du jour à la FC repos moyenne des 7 derniers jours."

    zoneReponseCoach.innerHTML = interpretation

    // generation du graphique
    genererGraphiqueLine(thisWeekForGraphic, [45, 47, 49, 46, 43, 42, 46])

    return
}

window.addEventListener("DOMContentLoaded", init())