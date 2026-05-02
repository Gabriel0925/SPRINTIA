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

// parcours de la liste et ajout des jours en fonction de l'index de la liste hérité du dicoNumDay
listeIndex7derniersJours.forEach(element => {
    thisWeekForGraphic.push(week[element])
});

const dateActuelle = new Date()
let dateToday = new Date(dateActuelle).toISOString()
// On prend que ce qui nous interesse donc la premiere partie
dateToday = dateToday.split("T")[0] // on obtient "2026-01-21"

let dateMoins7J = new Date()
dateMoins7J = dateMoins7J.setDate(dateActuelle.getDate() - 7) // pour le calcul des dates il faut les mettre en timestamp enleve le nb de j ici, ça renvoie ex: 1769014250809
dateMoins7J = new Date(dateMoins7J).toISOString() // permet de recup "2026-01-21T17:13:53.151Z"
// On prend que ce qui nous interesse donc la premiere partie
dateMoins7J = dateMoins7J.split("T")[0] // on obtient "2026-01-21"

async function init() {
    // recup des datas pour le graphique
    const historique = await db.recuperation.where("date").aboveOrEqual(dateMoins7J).toArray()
    
    // init pr la boucle
    let dicoDataFormatee = {} // structure "Jour":FC_repos exemple : "M":43
    historique.forEach(element => {
        let dateElt = new Date(element.date) // création d'un objet en fonction de la date de la données
        let numDateElt = dateElt.getDay() // recup du jour exemple: Mercredi -> 2

        // week[numDateElt] pour récupérer un jour à la place du numéro exemple pour mercredi = 2 -> M
        dicoDataFormatee[week[numDateElt]] = element.fc_repos
    });

    // pour faire une copie du tableau et non pas modifier le tableau
    let tableauFcRepos = thisWeekForGraphic.slice() // exemple : ['D', 'L', 'M', 'M', 'J', 'V', 'S']
    // parcours du dico
    Object.entries(dicoDataFormatee).forEach(([day, fcRepos]) => { // day = par ex: D pour Dimanche
        if (thisWeekForGraphic.includes(day)) { // si le day est dans le tableau des 7 derniers jours pr le graphique alors
            // on garde en mémoire sa position
            let positionDay = thisWeekForGraphic.indexOf(day)
            // et on remplace dans notre nouveau tableau qui copie le "thisWeekForGraphic" exemple :
            // on passe de ça ['D', 'L', 'M', 'M', 'J', 'V', 'S'] à ça ['D', 'L', 'M', 'M', 'J', 'V', 34] donc on remplace par la fc repos
            tableauFcRepos[positionDay] = fcRepos
        }
    });

    let tableauFcReposComplete = [] // nouveau tableau qui remplacera le "tableauFcRepos" par la suite
    tableauFcRepos.forEach(element => { // parcours du tableau
        // on convertit en number au moins si c'est pas un chiffre la valeur sera en isNan et donc on pourra mettre 0 à la place du lettre
        element = Number(element) 

        if (isNaN(element)) {
            tableauFcReposComplete.push(0)
        } else {
            tableauFcReposComplete.push(Number(element))
        }
    });
    // en gros la boucle si dessus permet de passer de ça ['D', 'L', 'M', 'M', 'J', 'V', 34] à [0, 0, 0, 0, 0, 0, 34]

    // maj du contenu de certaines partie de la page
    let zoneReponseCoach = document.getElementById("reponse-coach")
    let interpretation = "Pour analyser ta récupération, j'ai besoin de 7 jours d'affilée de FC repos pour comparer ta FC repos du jour à la FC repos moyenne des 7 derniers jours."
    zoneReponseCoach.innerHTML = interpretation

    // mise à jour de la valeur de la fc repos du jour 
    let fcReposToday = await db.recuperation.where("date").aboveOrEqual(dateToday).toArray()
    if (fcReposToday.length > 0) {
        fcReposToday = fcReposToday[0].fc_repos
    } else {
        fcReposToday = "--"
    }
    document.getElementById("fc-repos-today").innerHTML = `${fcReposToday}  <small>bpm</small>`

    // generation du graphique
    genererGraphiqueLine(thisWeekForGraphic, tableauFcReposComplete)

    return
}

window.addEventListener("DOMContentLoaded", init())