const dicoInterpretation = {
    "Bienveillant": [
        "Pour analyser ta récupération du jour, j'ai besoin de 7 données de récupération sur les 28 derniers jours pour pouvoir comparer ta FC repos du jour à ta moyenne habituelle des 30 derniers jours.",
        "Ta FC repos du jour est inférieure à ta moyenne habituelle, c'est un très bon signe ! Ça signifie que tu es en forme et que tu es prêt·e à affronter un entraînement intense aujourd'hui si tu le souhaites.",
        "Ta FC repos du jour est dans la moyenne habituelle. Ça signifie que tu peux faire une séance aujourd'hui (si tu le souhaites) et que ton corps a bien récupéré de tes dernières séances d'entraînement. Garde cette régularité et tu verras que les résultats seront au rendez-vous !",
        "Ta FC repos du jour indique que ton corps n'a pas encore récupéré de tes dernières séances d'entraînement. Je te conseille donc de ne pas t'entraîner aujourd'hui pour que ton corps récupère et que tu puisses retourner au plus tôt t'entraîner."
    ],
    "Strict-Motivant": [
        "Pour analyser ta récupération du jour, j'ai besoin de 7 données de récupération sur les 28 derniers jours pour pouvoir comparer ta FC repos du jour à ta moyenne habituelle des 30 derniers jours.",
        "Ta FC repos du jour est plus basse que d'habitude. C'est parfait, tu es en pleine forme ! Profite de ce pic de forme pour te dépasser et mettre un max d'intensité dans ta séance du jour.",
        "Ta FC repos du jour est stable. Ton corps a fait le job pour récupérer, c'est bien. Tu peux t'entraîner normalement, mais ne t'endors pas sur tes acquis, reste bien concentré·e sur tes objectifs.",
        "Ta FC repos est trop élevée. Ton corps est fatigué·e et tu n'es pas au top. Ne joue pas avec le feu, aujourd'hui c'est repos obligatoire pour ne pas risquer la blessure, ça serait bête."
    ],
    "Copain": [
        "Pour analyser ta récupération du jour, j'ai besoin de 7 données de récupération sur les 28 derniers jours pour pouvoir comparer ta FC repos du jour à ta moyenne habituelle des 30 derniers jours.",
        "Ta FC repos du jour est bien basse, franchement c'est top ! Tu pètes la forme, c'est le moment idéal pour aller te donner à fond, rien ne peut t'arrêter aujourd'hui.",
        "Ta FC repos est dans la normale. C'est cool, ça veut dire que tu as bien récupéré de tes efforts passés. Tu peux aller t'entraîner sans problème si tu avez prévu une séance aujourd'hui.",
        "Ta FC repos du jour est un peu haute. Je pense que ton corps a besoin de repos. Prends une journée de repos, pour aider ton corps à se régénérer, c'est plus prudent et ça te permettra de revenir plus fort·e !"
    ]
}
let historiqueData28J = undefined
const dateMoins7J = createObjetDate(7)
const dateMoins14J = createObjetDate(14)
const dateMoins21J = createObjetDate(21)
const dateMoins28J = createObjetDate(28)

async function recupHistorique() {
    try {
        historiqueData28J = await db.recuperation.where("date").aboveOrEqual(dateMoins28J).toArray()
        historiqueData28J.reverse()

        // on met en undefined si ya pas de datas
        if (historiqueData28J.length <=0) {
            historiqueData28J=undefined
        }
    } catch(error) {
        console.log(error)
    }
}

function fcToday() {
    if (historiqueData28J!=undefined) {
        let dateToday = createObjetDate(0)
        let fcFind = undefined

        historiqueData28J.forEach(element => {
            if (element.date == dateToday) {
                fcFind = element.fc_repos
            }
        });

        return fcFind

    } else { // si ya pas de datas on return undefined
        return undefined
    }
}
async function statutInterpretation(fcReposToday, moyenne28j) {
    // recup des elt html interressant pour le statut
    let pStatut = document.querySelector(".zone-coach p.title")
    let spanStatut = document.getElementById("statut")
    if (spanStatut) {
        // init de la phrase de base
        spanStatut.textContent = "Pas de statut"
        pStatut.classList.remove("skeleton")
    }

    let zoneReponseCoach = document.getElementById("reponse-coach")

    if (historiqueData28J!=undefined && historiqueData28J.length >= 7) {
        // on recup le style de coach du user
        let styleCoach = await db.JRM_Coach.toArray()
        if (styleCoach.length <= 0) {
            styleCoach = "Bienveillant"
        } else {
            styleCoach = styleCoach[0].style
        }

        // calcul de l'écart
        let ecartToday = parseInt(fcReposToday-moyenne28j)
        let interpretation = dicoInterpretation["Bienveillant"][0]

        if (ecartToday <= -3) {
            interpretation = dicoInterpretation[styleCoach][1]
            document.getElementById("statut").textContent = "Totalement reposé"

        } else if (ecartToday >= 4) {
            interpretation = dicoInterpretation[styleCoach][3]
            document.getElementById("statut").textContent = "Ton corps a besoin de repos"

        } else {
            interpretation = dicoInterpretation[styleCoach][2]
            document.getElementById("statut").textContent = "Récupération optimale"
        }

        if (zoneReponseCoach) {
            zoneReponseCoach.textContent = interpretation
            zoneReponseCoach.classList.remove("skeleton")
        }

    } else {
        if (zoneReponseCoach) {
            zoneReponseCoach.textContent = dicoInterpretation["Bienveillant"][0]
            zoneReponseCoach.classList.remove("skeleton")
        }
        return undefined
    }
}

async function graphique() {
    if (historiqueData28J!=undefined) {
        let timeWorkoutWeek1 = {"somme":0, "nbElement":0}
        let timeWorkoutWeek2 = {"somme":0, "nbElement":0}
        let timeWorkoutWeek3 = {"somme":0, "nbElement":0}
        let timeWorkoutWeek4 = {"somme":0, "nbElement":0}

        historiqueData28J.forEach(element => {
            if (element.date >= dateMoins7J) {
                timeWorkoutWeek1["somme"]+=element.fc_repos
                timeWorkoutWeek1["nbElement"]+=1
            } else if (element >= dateMoins14J) {
                timeWorkoutWeek2["somme"]+=element.fc_repos
                timeWorkoutWeek2["nbElement"]+=1
            } else if (element >= dateMoins21J) {
                timeWorkoutWeek3["somme"]+=element.fc_repos
                timeWorkoutWeek3["nbElement"]+=1
            } else if (element >= dateMoins28J) {
                timeWorkoutWeek4["somme"]+=element.fc_repos
                timeWorkoutWeek4["nbElement"]+=1
            }
        });

        timeWorkoutWeek1 = timeWorkoutWeek1["somme"]/timeWorkoutWeek1["nbElement"]  || 0
        timeWorkoutWeek2 = timeWorkoutWeek2["somme"]/timeWorkoutWeek2["nbElement"]  || 0
        timeWorkoutWeek3 = timeWorkoutWeek3["somme"]/timeWorkoutWeek3["nbElement"]  || 0
        timeWorkoutWeek4 = timeWorkoutWeek4["somme"]/timeWorkoutWeek4["nbElement"]  || 0

        await genererGraphiqueLine(["S-4", "S-3", "S-2", "S-1"], [timeWorkoutWeek4, timeWorkoutWeek3, timeWorkoutWeek2, timeWorkoutWeek1])
    } else {
        await genererGraphiqueLine(["S-4", "S-3", "S-2", "S-1"], [0,0,0,0])
    }
}

function statistiqueEndessousGraph() {
    if (historiqueData28J!=undefined) {
        let valueMin = historiqueData28J[0]["fc_repos"] || undefined
        let valueMax = historiqueData28J[0]["fc_repos"] || undefined
        
        let sommeFcRepos = 0
        let compteur = 0

        historiqueData28J.forEach(element => {
            if (element.fc_repos < valueMin) {
                valueMin = element.fc_repos
            }

            if (element.fc_repos > valueMax) {
                valueMax = element.fc_repos
            }

            sommeFcRepos+=element.fc_repos
            compteur+=1
        });

        // calcul de la moyenne
        let moyenne28J = undefined
        if (compteur!=0) {
            moyenne28J = Math.round(sommeFcRepos/compteur)
        }

        return [moyenne28J, valueMin, valueMax]
    } else {
        return [undefined, undefined, undefined]
    }
    
}

async function init() {
    await recupHistorique() // on met à jour la var globale de l'historique des 30 derniers jours

    // FC TODAY
    let fcReposAujourdhui = fcToday()
    if (fcReposAujourdhui !=undefined) {
        let pResultat = document.getElementById("fc-repos-today")
        if (pResultat) {
            pResultat.textContent = fcReposAujourdhui
        }
    }

    // STATS SOUS LE GRAPHIQUE
    let tableauStats = statistiqueEndessousGraph() // [moyenne28J, valueMin, valueMax]
    if (tableauStats!=undefined) {
        let spanMoyenne = document.getElementById("fc-repos-moyenne-28j")
        if (spanMoyenne && tableauStats[0] != undefined) { // on check si ya des datas de moyenne
            spanMoyenne.textContent = tableauStats[0]
        }

        let spanFaible = document.getElementById("fc-repos-faible-28j")
        if (spanFaible && tableauStats[1] != undefined) {
            spanFaible.textContent = tableauStats[1]
        }

        let spanEleve = document.getElementById("fc-repos-eleve-28j")
        if (spanEleve && tableauStats[2] != undefined) {
            spanEleve.textContent = tableauStats[2]
        }
    }

    // STATUT & INTERPRETATION
    statutInterpretation(fcReposAujourdhui, tableauStats[0])

    // on désactive le coeur si ya pas de datas
    if (historiqueData28J ==undefined) {
        let divCoeur = document.getElementById("coeur")
        if (divCoeur) {
            divCoeur.classList.add("desactive")
        }
    }
}

document.addEventListener("DOMContentLoaded", async() => {
    const buttonAnalyse = document.getElementById("button-SPRINTIA-analyse")
    if (buttonAnalyse){

        buttonAnalyse.addEventListener("click", () => {
            const fcReposToday = document.getElementById("fc-repos-today")
            if (fcReposToday && fcReposToday.textContent != "--") { // si il y a des datas on renvoie à discussion
                // on regarde si ya un statut
                const statutRecup = document.getElementById("statut")
                if (statutRecup && statutRecup.textContent != "Pas de statut") {
                    window.location.href = "../../discussion/discussion.html?question=Analyse ma récupération du jour pour que je sache si je suis en forme pour faire un entraînement, trouve des corrélations avec mes entraînements récents et suggère-moi un entraînement en fonction de mes entraînements récents et de ma récupération."
                } else {
                    alert("Pour analyser votre récupération du jour, veuillez enregistrer 7 données de récupération sur les 30 derniers jours.")
                }

            } else { // sinon on previent le user
                alert("Pour analyser votre récupération, veuillez enregistrer votre FC repos du jour !")
            }
        })
    }

    const segmentedButtonHistorique = document.getElementById("segmented-button-historique")
    if (segmentedButtonHistorique) {segmentedButtonHistorique.addEventListener("click", () =>{window.location.href = 'recuperation-historique.html'})}

    await init()
    graphique()
})