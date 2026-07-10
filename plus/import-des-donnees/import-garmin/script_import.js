const dicoNameSportFrancais = {
    // SPORT BASIQUES
    "Course à pied": "Course", "Cyclisme": "Vélo", "Marche à pied": "Marche", "Randonnée": "Randonnée",

    // SPORT DE RAQUETTE
    "Badminton": "Badminton",

    // SPORT COLLECTIFS
    "Basket-ball": "Basketball", "Volley-ball": "Volley", "Football": "Football",

    // SPORT DE RENFORCEMENT
    "Musculation": "Musculation", "Rameur d'intérieur": "Rameur d'intérieur",

    // SPORT D'EAU
    "Nat. piscine": "Natation",

    // SPORT D'HIVER
    "Ski en station": "Ski"
}
const dicoNameSportEnglish = {
    // SPORT BASIQUES
    "Running": "Course", "Cycling": "Vélo", "Walking": "Marche", "Hiking": "Randonnée",

    // SPORT DE RAQUETTE
    "Badminton": "Badminton",

    // SPORT COLLECTIFS
    "Basketball": "Basketball", "Volleyball": "Volley", "Soccer/Football": "Football",

    // SPORT DE RENFORCEMENT
    "Strength Training": "Musculation", "Indoor Rowing": "Rameur d'intérieur",

    // SPORT D'EAU
    "Pool Swim": "Natation",

    // SPORT D'HIVER
    "Resort Skiing": "Ski"
}

function extractionDate(dateWorkout) {
    // ex: dateWorkout = "2026-02-25 15:41:45"
    return dateWorkout.split(" ")[0] // ex: ["2026-02-25", "15:41:45"]
}
function conversionMinGarmin(dureeWorkoutUser) {
    if (dureeWorkoutUser.includes(":")) {
        let formatDuree = dureeWorkoutUser.split(":")

        if (formatDuree.length == 3) { // quand il y a les heures, minutes et secondes
            // Extraction des heures minutes et secondes
            let heures = parseInt(formatDuree[0])
            let minutes = parseInt(formatDuree[1])
            let secondes = parseInt(formatDuree[2])

            // Conversion de la durée en minutes
            return (heures*60) + minutes + (secondes/60)
        } else if (formatDuree.length == 2) { // quand il y a que les minutes et secondes
            // Extraction des minutes et secondes
            let minutes = parseInt(formatDuree[0])
            let secondes = parseInt(formatDuree[1])

            // Conversion de la durée en minutes
            return minutes + (secondes/60)
        } else { // sinon ça veut dire qu'il y a que des minutes
            return parseInt(formatDuree[0] )// on prend les minutes
        }

    } else { // si il n'y a pas de ":" on en déduit qu'il y a que les minutes
        return parseInt(dureeWorkoutUser)
    }

}

async function uploadFileGarmin(event) {
    const fileCSV = event.target.files[0]
    let button = document.getElementById("button-import-garmin")
    
    if (fileCSV) {
        // Transmission de l'info au
        button.disabled = true
        button.textContent = "Importation..."

        try {
            const readFile = await fileCSV.text() // lecture du fichier et transformation en texte
            const ligneFile = Papa.parse(readFile) // appelle à la bibliothèque qui renvoie direct le dico

            // on recup les datas dans le dico
            let dataHistoriqueEntrainement = ligneFile["data"]
            // on récupere les entetes (ex : ["Sport,Duree,RPE"]) et on supprimme l'élément à l'index 0 et on supprime que 1 élément
            const enteteFile = dataHistoriqueEntrainement.splice(0, 1)[0] // index 0 car splice va renvoyer [["elem1", "elem2"]]

            // --- Extraction des index des données dans le fichier CSV pour le récupérer dans la boucle for ---
            
            // si la version française == -1 alors on tente de récupérer avec le nom du header en anglais sinon on le met sur -1
            let indexSportWorkout = enteteFile.indexOf("Type d'activité") == -1 ? enteteFile.indexOf("Activity Type"):enteteFile.indexOf("Type d'activité")
            let indexDateWorkout = enteteFile.indexOf("Date")
            let indexNomWorkout = enteteFile.indexOf("Titre") == -1 ? enteteFile.indexOf("Title"):enteteFile.indexOf("Titre")
            let indexDureeWorkout = enteteFile.indexOf("Durée") == -1 ? enteteFile.indexOf("Time"):enteteFile.indexOf("Durée")
            let indexTrainingEffectWorkout = enteteFile.indexOf("TE aérobie") == -1 ? enteteFile.indexOf("Aerobic TE"):enteteFile.indexOf("TE aérobie")

            let indexFcMoyWorkout = enteteFile.indexOf("Fréquence cardiaque moyenne") == -1 ? enteteFile.indexOf("Avg HR"):enteteFile.indexOf("Fréquence cardiaque moyenne")
            let indexFcMaxWorkout = enteteFile.indexOf("Fréquence cardiaque maximale") == -1 ? enteteFile.indexOf("Max HR"):enteteFile.indexOf("Fréquence cardiaque maximale")

            let indexDistanceWorkout = enteteFile.indexOf("Distance") == -1 ? enteteFile.indexOf("Distance"):enteteFile.indexOf("Distance")

            let nbWorkoutImporter = 0 // compteur pour compter le nombre d'entraînement importé
            let profilDB = await db.profil.get(1) // pour des calculs de transpiration,... par la suite
            for (const elt of dataHistoriqueEntrainement) {
                // -- data de base pour n'importe quel sport --
                let sportWorkout = elt?.[indexSportWorkout]??undefined // si "indexSportWorkout" n'existe pas au lieu de faire planter le code on le met sur undefined
                let dateWorkout = elt?.[indexDateWorkout]??undefined
                let nomWorkout = elt?.[indexNomWorkout]??undefined
                let dureeWorkout = elt?.[indexDureeWorkout]??undefined
                let trainingEffectWorkout = Number(elt[indexTrainingEffectWorkout]) || undefined

                // -- data un peu plus avancée --
                let fcMoyWorkout = parseInt(elt[indexFcMoyWorkout]) || undefined
                let fcMaxWorkout = parseInt(elt[indexFcMaxWorkout]) || undefined

                // -- data spécifique aux sports extérieurs --
                // Garmin met une virgule pour les décimales donc on la remplace par un point
                let distanceWorkout = Number(Number(elt[indexDistanceWorkout]).toFixed(2)) || undefined // arrondi -> ex : 14.23 
                
                if (elt.length <= 1) { // car la derniere ligne du CSV Garmin est une ligne vide renvoie ça [''] et length == 1
                    //pass
                } else {
                    // on adapte le nom du sport donné par Garmin à SPRINTIA
                    sportWorkout = dicoNameSportFrancais?.[sportWorkout] ?? dicoNameSportEnglish?.[sportWorkout] ?? "Libre"
                    dateWorkout = extractionDate(dateWorkout) // extraction uniquement de la date

                    // si le nom dépasse la limite imposée par SPRINTIA alors on lui donne un autre nom
                    if (nomWorkout.length > 40) {nomWorkout = sportWorkout+" le "+dateWorkout.split("-")[2]+"/"+dateWorkout.split("-")[1].padStart(2, "0")} // exemple : Course le 28/04

                    if (dureeWorkout != undefined) {
                        dureeWorkout = conversionMinGarmin(dureeWorkout) // nettoyage de la durée inscrit dans le CSV Garmin
                    }                    
                    
                    if (dureeWorkout == undefined || new Date(dateWorkout) == "Invalid Date") {
                        continue // on passe au tour suivant
                    }
                    else {
                        nbWorkoutImporter+=1 // incrémentation
                    }

                    // calcul de l'allure moyenne ou de la vitesse en fonction du sport
                    let allureMoyWorkout = 0
                    let vitesseMoyWorkout = 0
                    if (sportWorkout != "Libre") {
                        if (sportWorkout == "Course" && distanceWorkout > 0) {
                            // Calcul de l'allure en course à pied
                            allureMoyWorkout = dureeWorkout/distanceWorkout // on obtient par exemple : 7.65

                            let min = Math.floor(allureMoyWorkout) // pour recup les minutes
                            let sec = Math.round((allureMoyWorkout%1)*60) // conversion du reste en seconde 
                            allureMoyWorkout = `${min}:${sec.toString().padStart(2, "0")}`

                        } else if (sportWorkout == "Vélo" && distanceWorkout > 0) {
                            // conversion des min en heures
                            let workoutTimeHour = dureeWorkout/60
                            vitesseMoyWorkout = Number((distanceWorkout/workoutTimeHour).toFixed(2))
                        }
                    }
                    if (allureMoyWorkout == 0) {allureMoyWorkout = undefined}
                    if (vitesseMoyWorkout == 0) {vitesseMoyWorkout = undefined}

                    if (trainingEffectWorkout == undefined) {
                        trainingEffectWorkout = 0.5 // car quand on va multiplier par 2 ça fera 1 soit le minimum en RPE
                    } else if (trainingEffectWorkout > 5) { // petite sécurité car le TE aérobie max est de 5, et donc en multipliant par 2 on obtient 10 qui est le max en RPE
                        trainingEffectWorkout = 5
                    }

                    // calcul du RPE et de la charge d'entrainement
                    let rpeWorkout = 1 // init
                    if (fcMoyWorkout != undefined && fcMaxWorkout != undefined) {
                        rpeWorkout = Math.round(trainingEffectWorkout*2)
                    }
                    if (rpeWorkout < 1) {rpeWorkout=1} else if (rpeWorkout > 10) {rpeWorkout=10}
                    
                    let chargeEntrainementWorkout = Math.floor(rpeWorkout*dureeWorkout)
                    if (chargeEntrainementWorkout < 1) {chargeEntrainementWorkout = 1} // petite sécurité

                    // Calcul de la transpiration
                    let TranspirationEstimee = 0
                    let HydratationEstimee = 0

                    if (profilDB != undefined) {
                        let poidsUser = Number(profilDB.poids)
                        let DureeHeure = dureeWorkout/60 // Conversion de la durée en heure
                        let CoefficientRpe = [0.4, 0.8, 1.2, 1.6]

                        // Attribution de la valeur du RPE
                        if (rpeWorkout <= 3) {
                            CoefficientRpe = CoefficientRpe[0]
                        } else if (rpeWorkout <= 6) {
                            CoefficientRpe = CoefficientRpe[1]
                        } else if (rpeWorkout <= 8) {
                            CoefficientRpe = CoefficientRpe[2]
                        } else {
                            CoefficientRpe = CoefficientRpe[3]
                        }

                        // Calcul
                        TranspirationEstimee = Math.round((DureeHeure*CoefficientRpe*(poidsUser/70))*1000)
                        HydratationEstimee = Math.round(TranspirationEstimee*1.2)
                    } else {
                        TranspirationEstimee = undefined
                        HydratationEstimee = undefined
                    }

                    // dico de base
                    let dicoBase = {
                        sport: sportWorkout,
                        date: dateWorkout,
                        nom: nomWorkout,
                        duree: dureeWorkout,
                        rpe: rpeWorkout,
                        fc_moy: fcMoyWorkout,
                        fc_max: fcMaxWorkout,
                        distance: distanceWorkout,
                        transpiration_estimee: TranspirationEstimee,
                        hydratation_estimee:HydratationEstimee,
                        charge_entrainement: chargeEntrainementWorkout
                    }

                    // on ajoute les données de sport spécifique
                    if (sportWorkout != "Libre") {
                        dicoBase["allure_moy"] = allureMoyWorkout
                        dicoBase["vitesse_moy"] = vitesseMoyWorkout
                    }

                    const dicoDataClean = removeValueUndefined(dicoBase)
                    await db.entrainement.add(dicoDataClean)
                }
            }
            
            button.textContent = `${nbWorkoutImporter} entraînements importés`
            await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 500))
            window.location.href = "../../../index.html?workoutimport" // redirection vers l'historique d'entrainement après l'importation 
        } catch(error) {
            console.log(error)
            button.textContent = "Une erreur s'est produite"
            await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))
        } finally {
            button.textContent = "Importer fichier Garmin"
            button.disabled = false
        }

    }
}
