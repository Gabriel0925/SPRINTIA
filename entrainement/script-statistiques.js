// Variables d'état globales pour la période et le sport
let dureeDemandee = 7 // 7, 30, 90, 365
let offsetPeriode = 0 // 0 = période actuelle, 1 = période précédente, etc.
let dateDebutDemandee = ""
let dateFinDemandee = ""
let sportDemandee = "Course"

// Calcul précis de date au format YYYY-MM-DD
function getDateDaysAgo(nbJourEnMoins) {
    const d = new Date()
    d.setHours(12, 0, 0, 0)
    d.setDate(d.getDate() - nbJourEnMoins)
    const annee = d.getFullYear()
    const mois = String(d.getMonth() + 1).padStart(2, "0")
    const jour = String(d.getDate()).padStart(2, "0")
    return `${annee}-${mois}-${jour}`
}

// Formatage textuel élégant en français
function formaterAffichagePeriode(dateDebutStr, dateFinStr) {
    const partsDebut = dateDebutStr.split("-").map(Number)
    const partsFin = dateFinStr.split("-").map(Number)

    const dateDebut = new Date(partsDebut[0], partsDebut[1] - 1, partsDebut[2], 12, 0, 0)
    const dateFin = new Date(partsFin[0], partsFin[1] - 1, partsFin[2], 12, 0, 0)

    const anneeDebut = dateDebut.getFullYear()
    const anneeFin = dateFin.getFullYear()
    const anneeCourante = new Date().getFullYear()

    const optionsJourMois = { day: "numeric", month: "short" }
    const optionsComplet = { day: "numeric", month: "short", year: "numeric" }

    if (anneeDebut === anneeFin) {
        if (anneeDebut === anneeCourante) {
            return `${dateDebut.toLocaleDateString("fr-FR", optionsJourMois)} – ${dateFin.toLocaleDateString("fr-FR", optionsJourMois)}`
        } else {
            return `${dateDebut.toLocaleDateString("fr-FR", optionsJourMois)} – ${dateFin.toLocaleDateString("fr-FR", optionsComplet)}`
        }
    } else {
        return `${dateDebut.toLocaleDateString("fr-FR", optionsComplet)} – ${dateFin.toLocaleDateString("fr-FR", optionsComplet)}`
    }
}

async function statistiquesParSport(sportForFunction) {
    // recup data de la période sélectionnée en fonction des dates
    const historiqueDBStats = await db.entrainement
        .where("date")
        .between(dateDebutDemandee, dateFinDemandee, true, true)
        .toArray()

    // maj de la variable globale
    sportDemandee = sportForFunction

    // init du compteur pour compter le nb d'entrainement
    let compteurNbEntrainement = 0
    let compteurDuree = 0
    let compteurDistance = 0

    historiqueDBStats.forEach(element => {
        // si le sport dans la BDD est égale aux sport de la navbar stats par sport
        if (element.sport == sportDemandee) {
            // si il y a une durée et qu'elle est utilisable alors on ajoute
            if (element.duree != undefined && !isNaN(Number(element.duree))) {
                compteurDuree += Number(element.duree)

                // si la distance n'est pas en undefined ou autre alors on l'ajoute
                if (element.distance != undefined && !isNaN(element.distance)) {
                    compteurDistance += element.distance
                }
            
                compteurNbEntrainement += 1 // maj de la variable pr compter le nombre d'entrainement en course par exemple
            }

        }
    }); 

    // remplissage des champs
    document.getElementById("duree-sport").textContent = dureeFormatee(compteurDuree, null)
    document.getElementById("duree-sport").classList.remove("skeleton")
    document.getElementById("nb-entrainement-sport").textContent = compteurNbEntrainement.toLocaleString('fr-FR')
    document.getElementById("nb-entrainement-sport").classList.remove("skeleton")

    if (sportDemandee == "Natation") { // si c'est de la natation alors on met en metre
        compteurDistance = compteurDistance * 1000
        document.getElementById("distance-sport").textContent = compteurDistance.toFixed(1).replace(".", ",")
        document.getElementById("unite-distance-sport").textContent = "m"
    } else {
        document.getElementById("distance-sport").textContent = compteurDistance.toFixed(2).replace(".", ",")
        document.getElementById("unite-distance-sport").textContent = "km"
    }
    document.getElementById("distance-sport").classList.remove("skeleton")
}
        
async function init(duree = dureeDemandee, offset = 0) {
    dureeDemandee = duree
    offsetPeriode = offset

    // Calcul des bornes de la période
    dateFinDemandee = getDateDaysAgo(offsetPeriode * dureeDemandee)
    dateDebutDemandee = getDateDaysAgo((offsetPeriode + 1) * dureeDemandee)

    // maj du libellé de période et de l'état du bouton suivant
    const textePeriode = document.getElementById("texte-periode")
    if (textePeriode) {
        textePeriode.textContent = formaterAffichagePeriode(dateDebutDemandee, dateFinDemandee)
    }
    const btnSuivant = document.getElementById("periode-suivante")
    if (btnSuivant) {
        btnSuivant.disabled = (offsetPeriode === 0)
    }

    // recup data dans la tranche de date sélectionnée
    const historiqueDB = await db.entrainement
        .where("date")
        .between(dateDebutDemandee, dateFinDemandee, true, true)
        .toArray()

    // on enleve les skeletons des stats générales
    document.getElementById("duree").classList.remove("skeleton")
    document.getElementById("nb-entrainement").classList.remove("skeleton")
    document.getElementById("charge-entrainement").classList.remove("skeleton")

    // quand il n'y a pas de datas
    if (historiqueDB.length <= 0) {
        document.querySelector(".sports-pratiques").style.display = "none"
        document.getElementById("aucune-data").style.display = "flex"
        document.getElementById("message-tips-graph").style.display = "none"

        // remise à 0 des champs pr éviter d'avoir des anciennes datas lors d'une autre période
        document.getElementById("duree").textContent = "00:00"
        document.getElementById("charge-entrainement").textContent = "0"
        document.getElementById("nb-entrainement").textContent = "0"

        // pareil pour les datas dans les sports spé
        document.getElementById("duree-sport").textContent = "00:00"
        document.getElementById("duree-sport").classList.remove("skeleton")

        document.getElementById("nb-entrainement-sport").textContent = "0"
        document.getElementById("nb-entrainement-sport").classList.remove("skeleton")

        document.getElementById("distance-sport").textContent = "0,00"
        document.getElementById("distance-sport").classList.remove("skeleton")

        document.getElementById("barCanvas").style.display = "none"

        // destruction propre de l'ancien graphique le cas échéant
        if (typeof barChart !== "undefined" && barChart) {
            barChart.destroy()
            barChart = null
        }
        return
    } else { 
        // si le user n'a pas de datas sur les 7 derniers jours et qu'il veut afficher les stats des 30j 
        // il faut remettre le graph et le message visible sinon le graph ne sera pas là
        document.querySelector(".sports-pratiques").style.display = "block"
        document.getElementById("aucune-data").style.display = "none"
        document.getElementById("message-tips-graph").style.display = "block"
        document.getElementById("barCanvas").style.display = "block"
    }

    // Tableau des entraînements en fonction de ce qu'a choisis le user comme date (7J, 30J, 365J)
    let tableauDuree = historiqueDB.map(elt => elt.duree)
    let tableauSport = historiqueDB.map(elt => elt.sport)
    let tableauCharge = historiqueDB.map(elt => elt.charge_entrainement)

    // init pr la boucle
    let dureeEntrainementUser = 0
    let chargeEntrainementUser = 0
    let compteur = 0

    tableauDuree.forEach(element => { // boucle pour faire la somme de la durée et de la charge d'entraînement
        dureeEntrainementUser += element
        chargeEntrainementUser += tableauCharge[compteur]

        compteur += 1
    });

    dureeEntrainementUser = dureeFormatee(dureeEntrainementUser, null) // conversion au format hh:mm:ss ou mm:ss

    // remplissage des champs
    document.getElementById("duree").textContent = dureeEntrainementUser
    // .toLocaleString('fr-FR') pour passer de 10000 -> 10 000
    document.getElementById("charge-entrainement").textContent = chargeEntrainementUser.toLocaleString('fr-FR')
    document.getElementById("nb-entrainement").textContent = tableauDuree.length.toLocaleString('fr-FR')
    
    let DicoNbEntrainementSport = {} // init pour les futures boucles ex : {"Course":3} 3 pour le nb d'entrainement en course
    tableauSport.forEach(elt => {
        if (!DicoNbEntrainementSport[elt]) { // si il n'y a pas ce sport dans le dico alors on le init à 1
            DicoNbEntrainementSport[elt] = 1
        } else { // sinon on prend le nombre d'activité dans le dico et on lui ajoute 1
            let nbActuelSport = DicoNbEntrainementSport[elt]
            let newNbSport = nbActuelSport + 1
            DicoNbEntrainementSport[elt] = newNbSport
        }
    });

    let nbTotaleEntrainement = 0 // init pour compter le nombre d'entraînement totale pour préparer la prochaine boucle
    Object.entries(DicoNbEntrainementSport).forEach(([sport, nbWorkout]) => {
        nbTotaleEntrainement += nbWorkout
    })
            
    // init de 2 tableaux
    let pourcentageSport = []
    let labelSport = []
    Object.entries(DicoNbEntrainementSport).forEach(([sport, nbEntrainement]) => {
        // calcul du pourcentage ex : 10 entrainements totale (donc 10 entrainements c'est 100%) -> dont 2 entrainements de course
        // donc (2*100)/10
        let pourcentageDeCeSport = (nbEntrainement * 100) / nbTotaleEntrainement

        // ajout de la data dans les tableaux
        pourcentageSport.push(pourcentageDeCeSport.toFixed(2))
        labelSport.push(sport)
    })

    // genereation du graphique
    genererGraphiqueDoughnut(labelSport, pourcentageSport)

    // remplissage des stats par sport
    await statistiquesParSport(sportDemandee)
}

document.addEventListener("DOMContentLoaded", () => {
    const segmentedButtonSemaine = document.getElementById("semaine")
    if (segmentedButtonSemaine) {
        segmentedButtonSemaine.addEventListener("click", () => {
            document.querySelector('.segmented-button.duree .segmented-button-button.actif').classList.remove('actif')
            document.getElementById('semaine').classList.add('actif')
            init(7, 0)
        })
    }
    const segmentedButtonMois = document.getElementById("mois")
    if (segmentedButtonMois) {
        segmentedButtonMois.addEventListener("click", () => {
            document.querySelector('.segmented-button.duree .segmented-button-button.actif').classList.remove('actif')
            document.getElementById('mois').classList.add('actif')
            init(30, 0)
        })
    }
    const segmentedButton3Mois = document.getElementById("trois-mois")
    if (segmentedButton3Mois) {
        segmentedButton3Mois.addEventListener("click", () => {
            document.querySelector('.segmented-button.duree .segmented-button-button.actif').classList.remove('actif')
            document.getElementById('trois-mois').classList.add('actif')
            init(90, 0)
        })
    }
    const segmentedButtonAnnee = document.getElementById("annee")
    if (segmentedButtonAnnee) {
        segmentedButtonAnnee.addEventListener("click", () => {
            document.querySelector('.segmented-button.duree .segmented-button-button.actif').classList.remove('actif')
            document.getElementById('annee').classList.add('actif')
            init(365, 0)
        })
    }

    // Navigation des périodes (précédente / suivante)
    const btnPeriodePrecedente = document.getElementById("periode-precedente")
    if (btnPeriodePrecedente) {
        btnPeriodePrecedente.addEventListener("click", () => {
            init(dureeDemandee, offsetPeriode + 1)
        })
    }
    const btnPeriodeSuivante = document.getElementById("periode-suivante")
    if (btnPeriodeSuivante) {
        btnPeriodeSuivante.addEventListener("click", () => {
            if (offsetPeriode > 0) {
                init(dureeDemandee, offsetPeriode - 1)
            }
        })
    }

    const segmentedButtonCourse = document.getElementById("sport-course")
    if (segmentedButtonCourse) {
        segmentedButtonCourse.addEventListener("click", () => {
            document.querySelector('.segmented-button.stats-sport .segmented-button-button.actif').classList.remove('actif')
            document.getElementById('sport-course').classList.add('actif')
            statistiquesParSport('Course')
        })
    }
    const segmentedButtonVelo = document.getElementById("sport-velo")
    if (segmentedButtonVelo) {
        segmentedButtonVelo.addEventListener("click", () => {
            document.querySelector('.segmented-button.stats-sport .segmented-button-button.actif').classList.remove('actif')
            document.getElementById('sport-velo').classList.add('actif')
            statistiquesParSport('Vélo')
        })
    }
    const segmentedButtonNatation = document.getElementById("sport-natation")
    if (segmentedButtonNatation) {
        segmentedButtonNatation.addEventListener("click", () => {
            document.querySelector('.segmented-button.stats-sport .segmented-button-button.actif').classList.remove('actif')
            document.getElementById('sport-natation').classList.add('actif')
            statistiquesParSport('Natation')
        })
    }

    // on cache le message comme quoi il n'y a pas de données
    const messagePasDatas = document.getElementById("aucune-data")
    if (messagePasDatas) {messagePasDatas.style.display="none"}

    init(7, 0)
})