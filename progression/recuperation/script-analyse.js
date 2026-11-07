let historiqueData28J = undefined

async function recupHistorique() {
    try {
        historiqueData28J = await db.recuperation.where("date").aboveOrEqual(createObjetDate(28)).toArray()
        historiqueData28J.reverse()

        // on met en undefined si ya pas de datas
        if (historiqueData28J.lenght <=0) {
            historiqueData28J=undefined
        }
    } catch(error) {
        console.log(error)
    }
}

async function fcToday() {
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
async function statut() {
    
}
async function interpretation() {
    
}

async function graphique() {

}

async function statistiqueEndessousGraph() {
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
            moyenne28J = sommeFcRepos/compteur
        }

        return [moyenne28J, valueMin, valueMax]
    } else {
        return undefined
    }
    
}

async function init() {
    await recupHistorique() // on met à jour la var globale de l'historique des 30 derniers jours

    // FC TODAY
    let fcReposAujourdhui = await fcToday()
    if (fcReposAujourdhui !=undefined) {
        let pResultat = document.getElementById("fc-repos-today")
        if (pResultat) {
            pResultat.textContent = fcReposAujourdhui
        }
    }

    // STATS SOUS LE GRAPHIQUE
    let tableauStats = await statistiqueEndessousGraph() // [moyenne28J, valueMin, valueMax]
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

    await init()
})