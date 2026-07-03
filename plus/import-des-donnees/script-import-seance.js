// fonction générale
function removeValueUndefined(dicoData) {
    const cleanDico = {}
    for (const key in dicoData) { // on parcourt les clé du dico
        if (dicoData[key] != undefined) { // si la valeur n'est pas en undefined donc exploitable alors on l'ajoute au dico clean qui renvoie ensuite
            cleanDico[key] = dicoData[key]
        }
    }
    return cleanDico
}

// Pour l'import Garmin
function extractionDate(dateWorkout) {
    if (dateWorkout == undefined) {return "jj:mm:aaaa"} // si pas de datas

    // ex: dateWorkout = "2026-02-25 15:41:45"
    let separationDate = dateWorkout.split(" ") // ex: ["2026-02-25", "15:41:45"]

    return separationDate[0]
}
function conversionMinutesGarmin(DureeWorkoutUser) {
    if (DureeWorkoutUser == undefined) {return ""} // si pas de datas

    if (DureeWorkoutUser.includes(":")) {
        let FormatDuree = DureeWorkoutUser.split(":")

        if (FormatDuree.length == 3) { // quand il y a les heures, minutes et secondes
            // Extraction des heures minutes et secondes
            let heures = parseInt(FormatDuree[0])
            let minutes = parseInt(FormatDuree[1])
            let secondes = parseInt(FormatDuree[2])

            // Conversion de la durée en minutes
            DureeWorkoutUser = (heures*60) + minutes + (secondes/60)
            return DureeWorkoutUser
        } else if (FormatDuree.length == 2) { // quand il y a que les minutes et secondes
            // Extraction des minutes et secondes
            let minutes = parseInt(FormatDuree[0])
            let secondes = parseInt(FormatDuree[1])

            // Conversion de la durée en minutes
            DureeWorkoutUser = minutes + (secondes/60)
            return DureeWorkoutUser
        } else { // sinon ça veut dire qu'il y a que des minutes
            return FormatDuree[0] // on prend les minutes
        }

    } else { // si il n'y a pas de ":" on en déduit qu'il y a que les minutes
        return DureeWorkoutUser
    }

}
async function uploadGarmin(event) {
    const fileCSV = event.target.files[0]
    let button = document.getElementById("button-import-garmin")
    let langueEnglish = false

    if (fileCSV) {
        try {
            // transmet info au user
            button.disabled = true
            button.textContent = "Importation..."

            // on lit le fichier et on convertit en texte
            const readFile = await fileCSV.text()
            
            const ligneFile = Papa.parse(readFile) 
            // on extrait uniquement la partie data du dico car les erreurs et meta on s'en fou
            let dataHistoriqueEntrainement = ligneFile["data"]
            // on récupere les entetes (ex : ["Sport,Duree,RPE"])  on supprimme l'élément à l'index 0 et on supprime que 1 élément
            const enteteFile = dataHistoriqueEntrainement.splice(0, 1)[0] // index 0 car splice va renvoyer [["elem1", "elem2"]]

            // recup des index
            let indexSportWorkout = enteteFile.indexOf("Type d'activité")
            let indexDateWorkout = enteteFile.indexOf("Date")
            let indexNomWorkout = enteteFile.indexOf("Titre")
            let indexDureeWorkout = enteteFile.indexOf("Durée")
            let indexTrainingEffectWorkout = enteteFile.indexOf("TE aérobie")
            let indexDistanceWorkout = enteteFile.indexOf("Distance")
            let indexFcMoyWorkout = enteteFile.indexOf("Fréquence cardiaque moyenne")
            let indexFcMaxWorkout = enteteFile.indexOf("Fréquence cardiaque maximale")        
            let indexCadenceWorkout = enteteFile.indexOf("Cadence de course moyenne")
            let indexAllureMoyWorkout = enteteFile.indexOf("Allure moyenne")

            // on regarde si le csv est en anglais
            if (indexSportWorkout == -1 && indexDureeWorkout == -1 && indexNomWorkout == -1) {
                langueEnglish = true // on préviens que le CSV est en anglais pour la suite du code

                indexSportWorkout = enteteFile.indexOf("Activity Type")
                indexDateWorkout = enteteFile.indexOf("Date")
                indexNomWorkout = enteteFile.indexOf("Title")
                indexDureeWorkout = enteteFile.indexOf("Time")
                indexTrainingEffectWorkout = enteteFile.indexOf("Aerobic TE")
                indexDistanceWorkout = enteteFile.indexOf("Distance")
                indexFcMoyWorkout = enteteFile.indexOf("Avg HR")
                indexFcMaxWorkout = enteteFile.indexOf("Max HR")        
                indexCadenceWorkout = enteteFile.indexOf("Avg Run Cadence")
                indexAllureMoyWorkout = enteteFile.indexOf("Avg Pace")
            }

            for (const elt of dataHistoriqueEntrainement) {
                // recup des datas
                let sportWorkout = elt[indexSportWorkout]
                let dateWorkout = elt[indexDateWorkout]
                let nomWorkout = elt[indexNomWorkout]
                let dureeWorkout = elt[indexDureeWorkout]
                let trainingEffectWorkout = elt[indexTrainingEffectWorkout] || undefined
                let distanceWorkout = elt[indexDistanceWorkout] || undefined
                let fcMoyWorkout = elt[indexFcMoyWorkout] || undefined
                let fcMaxWorkout = elt[indexFcMaxWorkout]  || undefined
                let cadenceWorkout = elt[indexCadenceWorkout] || undefined
                let allureMoyWorkout = elt[indexAllureMoyWorkout] || undefined

                if (elt.length <= 1) { // car la derniere ligne du CSV Garmin renvoie ça [''] et length == 1
                    //pass
                } else {
                    // extraction uniquement de la date et passage du format hh:mm:ss en minutes pour la durée
                    dateWorkout = extractionDate(dateWorkout)
                    dureeWorkout = conversionMinutesGarmin(dureeWorkout)

                    // vérification
                    if (trainingEffectWorkout == "--" || trainingEffectWorkout == undefined) {
                        trainingEffectWorkout = "0.5" // car quand on va multiplier par 2 ça fera 1
                    } else if (Number(trainingEffectWorkout) > 5.0) { // petite sécurité car le TE aérobie max est de 5.0
                        trainingEffectWorkout = "5.0"
                    }

                    if (dureeWorkout == "" || dureeWorkout == undefined || dureeWorkout == 0) {
                        // pas de datas donc on enregistre pas
                    } else {
                        // vérification pour voir si la data est vide
                        if (distanceWorkout == "--" || distanceWorkout == "0") { // petite sécurité pour pas que les distances à 0 s'enregistre
                            distanceWorkout = undefined
                        }
                        if (fcMoyWorkout == "--" || fcMoyWorkout == "0") { // petite sécurité pour pas que les FC moy à 0 s'enregistre
                            fcMoyWorkout = undefined
                        }
                        if (fcMaxWorkout == "--" || fcMaxWorkout == "0") { // petite sécurité pour pas que les FC max à 0 s'enregistre
                            fcMaxWorkout = undefined
                        }
                        if (cadenceWorkout == "--" || cadenceWorkout == "0") { // petite sécurité pour pas que les cadence à 0 s'enregistre
                            cadenceWorkout = undefined
                        }
                        if (allureMoyWorkout == "--") {
                            allureMoyWorkout = undefined
                        }

                        // petite correction si valeur incohérente
                        fcMoyWorkout = parseInt(fcMoyWorkout) || 0
                        fcMaxWorkout = parseInt(fcMaxWorkout) || 0

                        if (fcMoyWorkout < 1 || fcMoyWorkout > 220) {fcMoyWorkout = undefined}
                        if (fcMaxWorkout < 1 || fcMaxWorkout > 220) {fcMaxWorkout = undefined}

                        // on remet les bon nom de sport pour que SPRINTIA mettre les bonnes cartes dans l'historique d'entraînement
                        if (langueEnglish == false) { // le csv est en anglais
                            if (sportWorkout == "Course à pied") {
                                sportWorkout="Course"
                            } else if (sportWorkout == "Cyclisme") {
                                sportWorkout="Vélo"
                                allureMoyWorkout = undefined // en vélo on enregistre plutot la vitesse moy

                            } else if (sportWorkout == "Marche à pied") {
                                sportWorkout="Marche"
                                cadenceWorkout = undefined // la cadence n'est pas pertinente pour la marche donc on ne l'enregistre pas

                            } else if (sportWorkout == "Randonnée") {
                                sportWorkout="Randonnée"
                                cadenceWorkout = undefined // la cadence n'est pas pertinente pour la randonnée donc on ne l'enregistre pas
                                
                            } else if (sportWorkout == "Rameur d'intérieur") {
                                sportWorkout="Rameur d'intérieur"
                                allureMoyWorkout = undefined // car c'est pas sur /500m

                            } else if (sportWorkout == "Nat. piscine") {
                                sportWorkout="Natation"
                                allureMoyWorkout = undefined // car c'est pas sur /100m
                                cadenceWorkout = undefined // la cadence n'est pas pertinente pour la natation donc on ne l'enregistre pas

                            } else if (sportWorkout == "Ski en station") {
                                sportWorkout="Ski"
                                cadenceWorkout = undefined // la cadence n'est pas pertinente pour le ski donc on ne l'enregistre pas
                                allureMoyWorkout = undefined // en ski on enregistre plutot la vitesse moy

                            } else if (sportWorkout == "Basket-ball") {
                                sportWorkout="Basketball"
                                allureMoyWorkout = undefined
                                cadenceWorkout = undefined

                            } else if (sportWorkout == "Volley-ball") {
                                sportWorkout="Volley"
                                allureMoyWorkout = undefined
                                cadenceWorkout = undefined
                                distanceWorkout = undefined

                            } else if (sportWorkout == "Football") {
                                sportWorkout="Football"
                                allureMoyWorkout = undefined
                                cadenceWorkout = undefined

                            } else if (sportWorkout == "Badminton") {
                                sportWorkout="Badminton"
                                allureMoyWorkout = undefined
                                cadenceWorkout = undefined
                                distanceWorkout = undefined

                            } else if (sportWorkout == "Musculation") { // ça peut paraitre debile mais ne pas enlever sinon le sport muscu va se transformer en Libre
                                sportWorkout="Musculation"
                                allureMoyWorkout = undefined
                                cadenceWorkout = undefined
                                distanceWorkout = undefined

                            } else {
                                sportWorkout = "Libre"
                            }
                        } else { // le csv est en anglais donc on change les if pour mettre en anglais
                            if (sportWorkout == "Running") {
                                sportWorkout="Course"
                            } else if (sportWorkout == "Cycling") {
                                sportWorkout="Vélo"
                                allureMoyWorkout = undefined // en vélo on enregistre plutot la vitesse moy

                            } else if (sportWorkout == "Walking") {
                                sportWorkout="Marche"                                
                                cadenceWorkout = undefined // la cadence n'est pas pertinente pour la marche donc on ne l'enregistre pas

                            } else if (sportWorkout == "Hiking") {
                                sportWorkout="Randonnée"
                                cadenceWorkout = undefined

                            } else if (sportWorkout == "Indoor Rowing") {
                                sportWorkout="Rameur d'intérieur"
                                allureMoyWorkout = undefined // car c'est pas sur /500m

                            } else if (sportWorkout == "Pool Swim") {
                                sportWorkout="Natation"
                                allureMoyWorkout = undefined // car c'est pas sur /100m
                                cadenceWorkout = undefined // la cadence n'est pas pertinente pour la natation donc on ne l'enregistre pas

                            } else if (sportWorkout == "Resort Skiing") {
                                sportWorkout="Ski"
                                cadenceWorkout = undefined // la cadence n'est pas pertinente pour le ski donc on ne l'enregistre pas
                                allureMoyWorkout = undefined // en ski on enregistre plutot la vitesse moy

                            } else if (sportWorkout == "Basketball") {
                                sportWorkout="Basketball"
                                allureMoyWorkout = undefined
                                cadenceWorkout = undefined

                            } else if (sportWorkout == "Volleyball") {
                                sportWorkout="Volley"
                                allureMoyWorkout = undefined
                                cadenceWorkout = undefined
                                distanceWorkout = undefined

                            } else if (sportWorkout == "Soccer/Football") {
                                sportWorkout="Football"
                                allureMoyWorkout = undefined
                                cadenceWorkout = undefined

                            } else if (sportWorkout == "Badminton") {
                                sportWorkout="Badminton"
                                allureMoyWorkout = undefined
                                cadenceWorkout = undefined
                                distanceWorkout = undefined

                            } else if (sportWorkout == "Strength Training") {
                                sportWorkout="Musculation"
                                allureMoyWorkout = undefined
                                cadenceWorkout = undefined
                                distanceWorkout = undefined

                            } else {
                                sportWorkout = "Libre"
                            }
                        }

                        // petit nettoyage des données pour éviter les erreurs d'enregistrement
                        if (distanceWorkout != undefined) {
                            distanceWorkout = parseFloat(distanceWorkout.replace(",", ".")) // Garmin met une virgule pour les décimales donc on la remplace par un point pour que parseFloat puisse le lire
                        }
                        if (Number(distanceWorkout)== 0) {distanceWorkout = undefined} // si la distance est à 0 on la met à undefined pour pas l'enregistrer
                        
                        if (trainingEffectWorkout == undefined) {
                            trainingEffectWorkout = 0.5
                        } else {
                            trainingEffectWorkout = parseInt(trainingEffectWorkout)
                        }

                        // calcul du RPE et de la charge d'entrainement
                        let rpeWorkout = 1 // init
                        if (!isNaN(fcMoyWorkout) && !isNaN(fcMaxWorkout)) {
                            // calcule du rpe d'une autre manière mais a revoir car pas très prouvé scientifiquement
                            rpeWorkout = Math.round((fcMoyWorkout/fcMaxWorkout)*10) || 1 // formule pour calculer le RPE : (FC moy / FC max) * 10
                        } else {
                            rpeWorkout = Number(trainingEffectWorkout)*2
                        }

                        if (rpeWorkout < 1) { // si inférieur à 1 on le met sur la valeur minimum (=1)
                            rpeWorkout = 1
                        }
                        if (rpeWorkout > 10) { // si supérieur à 10 on le met sur la valeur max (=10)
                            rpeWorkout = 10
                        }

                        let chargeEntrainementWorkout = Math.floor(rpeWorkout*dureeWorkout)
                        // petite sécurité 
                        if (chargeEntrainementWorkout < 1 || chargeEntrainementWorkout == undefined) {chargeEntrainementWorkout = 1} // si inférieur à 1 on le met sur la valeur minimum (=1)

                        // Calcul de la transpiration
                        let profilDB = await db.profil.get(1)
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

                        if (sportWorkout != "Libre") { // si le sport est différent de Libre on enregistre toutes les datas
                            const dicoData = {
                                sport: sportWorkout,
                                date: dateWorkout,
                                nom: nomWorkout,
                                duree: dureeWorkout,
                                rpe: rpeWorkout,
                                distance: distanceWorkout,
                                fc_moy: fcMoyWorkout,
                                fc_max: fcMaxWorkout,
                                cadence_moy: cadenceWorkout,
                                allure_moy: allureMoyWorkout,
                                charge_entrainement: chargeEntrainementWorkout,
                                transpiration_estimee: TranspirationEstimee,
                                hydratation_estimee:HydratationEstimee
                            }
                            const dicoDataClean = removeValueUndefined(dicoData)
                            await db.entrainement.add(dicoDataClean)

                        } else { // si le sport est libre
                            const dicoData = {
                                sport: sportWorkout,
                                date: dateWorkout,
                                nom: nomWorkout,
                                duree: dureeWorkout,
                                rpe: rpeWorkout,
                                distance: distanceWorkout,
                                fc_moy: fcMoyWorkout,
                                fc_max: fcMaxWorkout,
                                charge_entrainement: chargeEntrainementWorkout,
                                transpiration_estimee: TranspirationEstimee,
                                hydratation_estimee:HydratationEstimee
                            }
                            const dicoDataClean = removeValueUndefined(dicoData)
                            await db.entrainement.add(dicoDataClean)
                        }

                    }
                }
            }

            // petite attente pour que le user voit le message dans le bouton
            setTimeout(() => {              
                button.disabled = false
                button.textContent = "Importer CSV"
                    window.location.href = "../../index.html?workoutimport" // redirection vers l'historique d'entrainement après l'importation 
            }, 650)    
        } catch {
            alert("Une erreur s'est produite lors de l'importation de votre historique d'entraînement.")
            button.disabled = false
            button.textContent = "Importer CSV"
        }

    }

    return
}

// Pour l'import TrainingPeaks
function conversionMinutesTP(DureeWorkoutUser) {
    // petite vérif pr s'assurer
    if (DureeWorkoutUser != undefined) {
        // training peaks renvoie 1.5 heure donc on le repasse en minutes -> 90 minutes
        try {
            DureeWorkoutUser = Number(DureeWorkoutUser)*60
        } catch {
            return undefined
        }
        return DureeWorkoutUser

    } else {
        return undefined
    }
}
async function uploadTrainingPeaks(event) {
    const fileCSV = event.target.files[0]
    let button = document.getElementById("button-import-TP")

    if (fileCSV) {
        try {
            // transmet info au user
            button.disabled = true
            button.textContent = "Importation..."

            // on lit le fichier et on convertit en texte
            const readFile = await fileCSV.text()
            
            const ligneFile = Papa.parse(readFile) 
            // on extrait uniquement la partie data du dico car les erreurs et meta on s'en fou
            let dataHistoriqueEntrainement = ligneFile["data"]
            // on récupere les entetes (ex : ["Sport,Duree,RPE"])  on supprimme l'élément à l'index 0 et on supprime que 1 élément
            const enteteFile = dataHistoriqueEntrainement.splice(0, 1)[0] // index 0 car splice va renvoyer [["elem1", "elem2"]]

            // recup des index
            let indexSportWorkout = enteteFile.indexOf("WorkoutType")
            let indexDateWorkout = enteteFile.indexOf("WorkoutDay")
            let indexNomWorkout = enteteFile.indexOf("Title")
            let indexDureeWorkout = enteteFile.indexOf("TimeTotalInHours")
            let indexRpe = enteteFile.indexOf("Rpe")
            let indexDistanceWorkout = enteteFile.indexOf("DistanceInMeters")
            let indexFcMoy = enteteFile.indexOf("HeartRateAverage")
            let indexFcMax = enteteFile.indexOf("HeartRateMax")
            let indexCadenceMoy = enteteFile.indexOf("CadenceAverage")
            let indexDescription = enteteFile.indexOf("WorkoutDescription")

            for (const elt of dataHistoriqueEntrainement) {
                // recup des datas
                let sportWorkout = elt[indexSportWorkout]
                let dateWorkout = elt[indexDateWorkout]
                let nomWorkout = elt[indexNomWorkout]
                let dureeWorkout = elt[indexDureeWorkout]
                let rpeWorkout = elt[indexRpe] || undefined
                let distanceWorkout = elt[indexDistanceWorkout] || undefined
                let fcMoyWorkout = elt[indexFcMoy] || undefined
                let fcMaxWorkout = elt[indexFcMax] || undefined
                let cadenceMoyWorkout = elt[indexCadenceMoy] || undefined
                let descriptionWorkout = elt[indexDescription] || undefined

                if (elt.length <= 1) { // car la derniere ligne du CSV renvoie ça [''] et length == 1
                    //pass
                } else {
                    // passage du format hh:mm:ss en minutes pour la durée
                    dureeWorkout = conversionMinutesTP(dureeWorkout)

                    // arrondi de la distance car TP ne le fait pas
                    distanceWorkout = Number(distanceWorkout/1000).toFixed(2) // on convertit des metres au kilometre
                    // vérif
                    if (distanceWorkout == 0 || distanceWorkout < 0) {distanceWorkout = undefined} 

                    // vérification
                    if (rpeWorkout == "" || rpeWorkout == undefined) {
                        rpeWorkout = 1
                    }
                    if (dureeWorkout == "" || dureeWorkout == undefined || dureeWorkout == 0) {
                        // pas de datas donc on enregistre pas
                    } else {
                        // on remet les bon nom de sport pour que SPRINTIA mettre les bonnes cartes dans l'historique d'entraînement
                        if (sportWorkout == "Run") {
                            sportWorkout="Course"
                        } else if (sportWorkout == "Bike") {
                            sportWorkout="Vélo"
                        } else if (sportWorkout == "Walk") {
                            sportWorkout="Marche"
                            cadenceMoyWorkout = undefined // la cadence n'est pas pertinente pour la marche donc on ne l'enregistre pas
                        } else if (sportWorkout == "Hike") {
                            sportWorkout="Randonnée"
                            cadenceMoyWorkout = undefined // la cadence n'est pas pertinente pour la randonnée donc on ne l'enregistre pas
                        } else if (sportWorkout == "Strength") {
                            sportWorkout="Musculation"
                            // petite sécurité pour pas que les sports de muscu aient des données incohérentes
                            cadenceMoyWorkout = undefined
                            distanceWorkout = undefined
                        }  else if (sportWorkout == "Rowing") {
                            sportWorkout="Rameur d'intérieur"
                        }  else if (sportWorkout == "XC-Ski") {
                            sportWorkout="Ski"
                            cadenceMoyWorkout = undefined
                        } else {
                            sportWorkout = "Libre"
                        }

                        // conversion de type + arrondi
                        rpeWorkout = parseInt(rpeWorkout)
                        if (cadenceMoyWorkout != undefined) {
                            cadenceMoyWorkout = parseInt(cadenceMoyWorkout)
                        }
                        fcMoyWorkout = parseInt(fcMoyWorkout)
                        fcMaxWorkout = parseInt(fcMaxWorkout)

                        if (cadenceMoyWorkout == 0) {cadenceMoyWorkout = undefined} // si la cadence est à 0 on la met à undefined pour pas l'enregistrer
                        // vérification pour voir si la data est vide ou incohérente
                        if (fcMoyWorkout < 1 || fcMoyWorkout > 220) {fcMoyWorkout = undefined} 
                        if (fcMaxWorkout < 1 || fcMaxWorkout > 220) {fcMaxWorkout = undefined}

                        if (!isNaN(fcMoyWorkout) && !isNaN(fcMaxWorkout)) {
                            // calcule du rpe d'une autre manière
                            // a revoir plus tard parce que c'est pas prouvé scientifiquement
                            rpeWorkout = Math.round((fcMoyWorkout/fcMaxWorkout)*10) || 1 // formule pour calculer le RPE : (FC moy / FC max) * 10
                        }

                        if (descriptionWorkout == "") {
                            descriptionWorkout = undefined
                        }

                        // calcul du RPE et de la charge d'entrainement (petite sécurité mais normalement c'est bon)
                        if (rpeWorkout < 1) { // si inférieur à 1 on le met sur la valeur minimum (=1)
                            rpeWorkout = 1
                        }
                        if (rpeWorkout > 10) { // si supérieur à 10 on le met sur la valeur max (=10)
                            rpeWorkout = 10
                        }
                        let chargeEntrainementWorkout = Math.floor(rpeWorkout*dureeWorkout)

                        if (chargeEntrainementWorkout < 1) {chargeEntrainementWorkout = 1} // si inférieur à 1 on le met sur la valeur minimum (=1)

                        // Calcul de la transpiration
                        let profilDB = await db.profil.get(1)
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

                        // enregistrement différent selon le sport
                        if (sportWorkout != "Libre") { // si le sport est différent de Libre on enregistre toutes les datas
                            const dicoData = {
                                sport: sportWorkout,
                                date: dateWorkout,
                                nom: nomWorkout,
                                duree: dureeWorkout,
                                rpe: rpeWorkout,
                                distance: distanceWorkout,
                                fc_moy: fcMoyWorkout,
                                fc_max: fcMaxWorkout,
                                cadence_moy: cadenceMoyWorkout,
                                charge_entrainement: chargeEntrainementWorkout,
                                note: descriptionWorkout,
                                transpiration_estimee: TranspirationEstimee,
                                hydratation_estimee:HydratationEstimee
                            }
                            const dicoDataClean = removeValueUndefined(dicoData)
                            await db.entrainement.add(dicoDataClean)

                        } else { // si le sport est libre
                            const dicoData = {
                                sport: sportWorkout,
                                date: dateWorkout,
                                nom: nomWorkout,
                                duree: dureeWorkout,
                                rpe: rpeWorkout,
                                distance: distanceWorkout,
                                fc_moy: fcMoyWorkout,
                                fc_max: fcMaxWorkout,
                                charge_entrainement: chargeEntrainementWorkout,
                                note: descriptionWorkout,
                                transpiration_estimee: TranspirationEstimee,
                                hydratation_estimee:HydratationEstimee
                            }
                            const dicoDataClean = removeValueUndefined(dicoData)
                            await db.entrainement.add(dicoDataClean)
                        }

                    } 
                }
            }

            // petite attente pour que le user voit le message dans le bouton
            setTimeout(() => {              
                button.disabled = false
                button.textContent = "Importer CSV"
                    window.location.href = "../../index.html?workoutimport" // redirection vers l'historique d'entrainement après l'importation 
            }, 650)  

        } catch {
            alert("Une erreur s'est produite lors de l'importation de votre historique d'entraînement.")
            button.disabled = false
            button.textContent = "Importer CSV"
        }
    }


    return
}

// Pour l'import TCX
const dicoNameSport = {
    "Running":"Course",
    "Biking":"Vélo",
    "Other":"Libre"
}
async function uploadFileTCX(event) {
    const fileTCX = event.target.files[0]
    let button = document.getElementById("button-import-tcx")

    if (fileTCX) {
        button.disabled = true
        button.textContent = "Importation..."

        try {
            let textFile = await fileTCX.text() // on récup le contenu du fichier en texte
            
            const parser = new DOMParser() // création d'un objet pr transformer le txt en DOM
            const xmlDoc = parser.parseFromString(textFile, "text/xml") // transformation du texte en document XML c'est un langage équivalent à HTML

            //console.log(xmlDoc)

            const dataLap = xmlDoc.getElementsByTagName("Lap")
            const tableauDataLap = Array.from(dataLap) // transformation des balises en tableau js pr les laps

            // Recup du sport et de la date
            const workoutSport = dicoNameSport[xmlDoc.querySelector("Activity").getAttribute("Sport")] || "Libre" // si le sport n'est pas dans le dico on le met en Libre
            let xmlDate = xmlDoc.querySelector("Id").textContent // on obtient ça : 2026-03-28T08:08:56Z
            let tableauXmlDate = xmlDate.split("T") // ["2026-03-28", "08:08:56Z"]
            const workoutDate = tableauXmlDate[0] // 2026-03-28

            // Init pour la boucle
            let workoutTime = 0
            let workoutDistance = 0
            let workoutFcMoy = 0
            let workoutFcMax = 0
            let workoutMaximumSpeed = 0

            let workoutDenivele = 0
            let deniveleLastLap = undefined

            let lapFcMoy= []
            let lapFcMax = []
            let lapMaximumSpeed = []
            let lapPointGps = []
            let timeLastTrackpoint = undefined

            // Boucle qui parcoure tous les lap de l'entraînement et qui convertit par exemple des metres au km directement
            tableauDataLap.forEach(element => {
                // l'opérateur ?. permet de ne pas faire planter le code si la balise n'est pas présente dans le TCX et donc prendre 0 à la place
                workoutTime += Number(element.querySelector("TotalTimeSeconds")?.textContent ?? 0) // on ne convertit pas ici car lors du calcul de la FC moyenne on va diviser par le temps total de l'entrainement en secondes
                workoutDistance += Number(element.querySelector("DistanceMeters")?.textContent ?? 0)/1000 // conversion des m en km

                // Récup des BPM moyen et max de l'entraînement
                // formule pr la fc moy d'un entrainement : (FC moy du lap * durée du lap en secondes) / durée totale de l'entrainement en secondes
                workoutFcMoy += Number(element.querySelector("AverageHeartRateBpm Value")?.textContent??0)*Number(element.querySelector("TotalTimeSeconds")?.textContent??0)

                let fcMaxLap = Number(element.querySelector("MaximumHeartRateBpm Value")?.textContent ?? 0)
                if (fcMaxLap > workoutFcMax) {
                    workoutFcMax = fcMaxLap
                }

                // recup de la vitesse max si cette donnée est présente sinon ça vaut 0
                let maximumSpeedLap = Number(element.querySelector("MaximumSpeed")?.textContent??0)*3.6 // conversion des m/s en km/h
                if (maximumSpeedLap > workoutMaximumSpeed) {
                    workoutMaximumSpeed = maximumSpeedLap
                }

                // recup du dénivelé si il est présent
                const pointsAltitudeLap = element.querySelectorAll("AltitudeMeters") // du lap actuel uniquement
                pointsAltitudeLap.forEach(elt => {
                    const altitudeNow = Number(elt?.textContent ?? 0)

                    // si c'est le premier point on l'init
                    if (deniveleLastLap == undefined) {deniveleLastLap=altitudeNow}

                    if (altitudeNow > deniveleLastLap) { // si ça monte on ajoute la différence
                        workoutDenivele = workoutDenivele+(altitudeNow-deniveleLastLap)
                    }

                    deniveleLastLap = altitudeNow
                })

                // recupéré les points gps
                const pointGpsLap = element.querySelectorAll("Trackpoint")
                pointGpsLap.forEach(elt => {
                    const timeTrackpoint = elt.querySelector("Time")?.textContent??undefined
                    const latitudePoint = Number(elt.querySelector("Position LatitudeDegrees")?.textContent ?? undefined)
                    const longitudePoint = Number(elt.querySelector("Position LongitudeDegrees")?.textContent ?? undefined)

                    // un number en undefined ça renvoie NaN
                    if (!isNaN(latitudePoint) && !isNaN(longitudePoint)) {
                        // si c'est le premier point time alors on le init
                        if (timeLastTrackpoint == undefined) {timeLastTrackpoint = timeTrackpoint}

                        let tempsEcouleEntre2Points = new Date(timeTrackpoint).getTime()-new Date(timeLastTrackpoint).getTime()

                        // Filtrage des datas (peut-être à enlever si on perd trop en qualité de tracé GPS)
                        if (tempsEcouleEntre2Points >= 3000) { // en ms donc 3000ms->3s on filtre que si on a un point GPS toutes les une à 2 ou 3 sec
                            lapPointGps.push([latitudePoint, longitudePoint])
                            timeLastTrackpoint = timeTrackpoint
                        }
                    }
                })
            });

            // nettoyage des datas
            if (workoutFcMax == 0) {workoutFcMax=undefined}
            if (workoutMaximumSpeed == 0) {workoutMaximumSpeed=undefined}
            if (workoutDenivele == 0) {workoutDenivele=undefined} else {
                workoutDenivele = Math.floor(workoutDenivele) // clean data
            }

            // derniere étape pour le calcul de la fc moyenne
            if (workoutFcMoy == 0) {workoutFcMoy = undefined} else {
                workoutFcMoy = Math.round(workoutFcMoy/workoutTime) // rappel de la formule : (FC moy du lap * durée du lap en secondes) / durée totale de l'entrainement en secondes
            }

            // conversion des secondes en minutes pour la durée de l'entrainement
            workoutTime = workoutTime/60

            // arrondi des valeurs de distance et du vitesse max
            if (workoutDistance != 0 && workoutDistance != undefined) {workoutDistance = Number(workoutDistance.toFixed(2))} else {workoutDistance = undefined}
            if (workoutMaximumSpeed != 0 && workoutMaximumSpeed != undefined) {workoutMaximumSpeed = Number(workoutMaximumSpeed.toFixed(2))} else {workoutMaximumSpeed = undefined}

            // calcul de l'allure moyenne ou de la vitesse en fonction du sport
            let workoutAllureMoy = 0
            let workoutVitesseMoy = 0
            if (workoutSport != "Libre") {
                if (workoutSport == "Course" && workoutDistance > 0) {
                    // Calcul de l'allure en course à pied
                    workoutAllureMoy = workoutTime/workoutDistance // on obtient par exemple : 7.65

                    let min = Math.floor(workoutAllureMoy) // pour recup les minutes
                    let sec = Math.round((workoutAllureMoy%1)*60) // conversion du reste en seconde 
                    workoutAllureMoy = `${min}:${sec.toString().padStart(2, "0")}`

                } else if (workoutSport == "Vélo" && workoutDistance > 0) {
                    // conversion des min en heures
                    let workoutTimeHour = workoutTime/60
                    workoutVitesseMoy = Number((workoutDistance/workoutTimeHour).toFixed(2))

                }
            }
            if (workoutAllureMoy == 0) {workoutAllureMoy = undefined}
            if (workoutVitesseMoy == 0) {workoutVitesseMoy = undefined}

// !!! à revoir !!!
            // calcul du RPE
            // formule ci dessous à améliorer parce qu'elle n'est pas prouvé scientifiquement
            let rpeWorkout = Math.round((workoutFcMoy/workoutFcMax)*10) || 1 // formule pour calculer le RPE : (FC moy / FC max) * 10
            if (rpeWorkout < 1) { // si inférieur à 1 on le met sur la valeur minimum (=1)
                rpeWorkout = 1
            } else if (rpeWorkout > 10) { // si supérieur à 10 on le met sur la valeur max (=10)
                rpeWorkout = 10
            }
            let chargeEntrainementWorkout = Math.floor(rpeWorkout*workoutTime)
// !!! fin de à revoir !!! 

            // si la durée ou la date de l'entrainement n'est pas définie ou égale à 0 on enregistre rien
            if (workoutTime == 0 || new Date(workoutDate) == "Invalid Date") {
                alert("Une erreur s'est produite lors de l'importation de la séance. Veuillez vérifier que votre fichier TCX contient une durée d'entraînement valide.")
                button.disabled = false
                button.textContent = "Importer fichier"
                return
            }

            // Calcul de la transpiration
            let profilDB = await db.profil.get(1)
            let transpirationEstimee = 0
            let HydratationEstimee = 0

            if (profilDB != undefined) {
                let poidsUser = Number(profilDB.poids)
                let DureeHeure = workoutTime/60 // Conversion de la durée en heure
                let coefficientRpe = [0.4, 0.8, 1.2, 1.6]

                // Attribution de la valeur du RPE
                if (rpeWorkout <= 3) {coefficientRpe = coefficientRpe[0]} 
                else if (rpeWorkout <= 6) {coefficientRpe = coefficientRpe[1]}
                else if (rpeWorkout <= 8) {coefficientRpe = coefficientRpe[2]}
                else {coefficientRpe = coefficientRpe[3]}

                // Calcul
                transpirationEstimee = Math.round((DureeHeure*coefficientRpe*(poidsUser/70))*1000)
                hydratationEstimee = Math.round(transpirationEstimee*1.2)
            } else {
                transpirationEstimee = undefined
                hydratationEstimee = undefined
            }

            // enregistrement des datas recup dans la BDD 
            let dicoDataBase = {                    
                sport: workoutSport,
                nom: workoutSport+" le "+workoutDate.split("-")[2]+"/"+workoutDate.split("-")[1].padStart(2, "0"), // exemple : Course le 28/04
                date: workoutDate,
                duree: workoutTime,     
                rpe: rpeWorkout,
                fc_moy: workoutFcMoy,
                fc_max: workoutFcMax,
                
                distance:workoutDistance,

                charge_entrainement: chargeEntrainementWorkout,
                transpiration_estimee: transpirationEstimee,
                hydratation_estimee: hydratationEstimee
            }
            if (workoutSport != "Libre") {
                // ajout des datas spé à la couse et au vélo
                dicoDataBase["allure_moy"] = workoutAllureMoy
                dicoDataBase["vitesse_moy"] = workoutVitesseMoy
                dicoDataBase["vitesse_max"] = workoutMaximumSpeed
                dicoDataBase["denivele"] = workoutDenivele
                dicoDataBase["points_gps"] = lapPointGps
            }
            const dicoDataClean = removeValueUndefined(dicoDataBase) // toutes les valeurs en undefined sont enlever du dico
            await db.entrainement.add(dicoDataClean);

            button.textContent = "Importé"
            await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))
            window.location.href = "../../index.html?workoutimport" // redirection vers l'historique d'entrainement après l'importation 

        } catch(error) {
            console.log(error)
            button.textContent = "Une erreur s'est produite"
            await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))
        } finally {
            button.textContent = "Importer TCX"
            button.disabled = false
        }

    }
}
