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
                            await db.entrainement.add({
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
                            })
                        } else { // si le sport est libre
                            await db.entrainement.add({
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
                            })
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
                            await db.entrainement.add({
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
                            })
                        } else { // si le sport est libre
                            await db.entrainement.add({
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
                            })
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
        try {
            // transmet info au user
            button.disabled = true
            button.textContent = "Importation..."

            // Lecture du fichier en texte
            let textFile = await fileTCX.text()
            
            // Création d'un objet pour transformer le texte en DOM
            const parser = new DOMParser()

            // transformation du texte en document XML c'est un langage équivalent à HTML
            const xmlDoc = parser.parseFromString(textFile, "text/xml") // "parseFromString" pour convertir ce text en str

            //console.log(xmlDoc)

            const dataLap = xmlDoc.getElementsByTagName("Lap")
            const tableauDataLap = Array.from(dataLap) // création d'un tableau pour les balises LAP

            // Recup du sport et de la date
            const workoutSport = dicoNameSport[xmlDoc.querySelector("Activity").getAttribute("Sport")] || "Libre" // si le sport n'est pas dans le dico on le met en Libre
            let XmlDate = xmlDoc.querySelector("Id").textContent // on obtient ça : 2026-03-28T08:08:56Z
            let tableauXmlDate = XmlDate.split("T") // ["2026-03-28", "08:08:56Z"]
            const workoutDate = tableauXmlDate[0] // 2026-03-28

            // Init pour la boucle
            let workoutTime = 0
            let workoutDistance = 0
            let lapFcMoy= []
            let lapFcMax = []
            let lapMaximumSpeed = []

            // Boucle qui parcoure tous les lap de l'entraînement et qui convertit par exemple des metres au km directement
            tableauDataLap.forEach(element => {
                workoutTime += Number(element.querySelector("TotalTimeSeconds").textContent) // on ne convertit pas ici car lors du calcul de la FC moyenne on va diviser par le temps total de l'entrainement en secondes
                workoutDistance += Number(element.querySelector("DistanceMeters").textContent)/1000 // conversion des m en km

                // Récup des BPM moyen et max de l'entraînement
                let fcMoy = element.querySelector("AverageHeartRateBpm Value")
                // formule pr la fc moy d'un entrainement : (FC moy du lap * durée du lap en secondes) / durée totale de l'entrainement en secondes
                if (fcMoy) {lapFcMoy.push(Number(fcMoy.textContent)*Number(element.querySelector("TotalTimeSeconds").textContent))} 
                let fcMax = element.querySelector("MaximumHeartRateBpm Value")
                if (fcMax) {lapFcMax.push(Number(fcMax.textContent))}

                // recup de la vitesse max si cette donnée est présente
                let maximumSpeed = element.querySelector("MaximumSpeed")
                if (maximumSpeed) {lapMaximumSpeed.push(Number(maximumSpeed.textContent)*3.6)} // conversion des m/s en km/h

            });

            // Boucle pour trouver la fc maxi du tableau qui contient la fc max de chaque tour
            let workoutFcMax = lapFcMax[0] || undefined
            if (lapFcMax.length > 0) {
                lapFcMax.forEach(element => {
                    if (element > workoutFcMax) {workoutFcMax=element}
                });
            } else {
                workoutFcMax = undefined
            }

            // boucle pour parcourir les FC moyenne de chaque lap et trouver la FC moyenne de l'entraînement
            let workoutFcMoy = 0
            if (lapFcMoy.length > 0) {
                lapFcMoy.forEach(element => {
                    workoutFcMoy += element
                });
                // On divise par le nombre de lap
                workoutFcMoy = Math.round(workoutFcMoy/workoutTime) // rappel de la formule : (FC moy du lap * durée du lap en secondes) / durée totale de l'entrainement en secondes
            } else {
                workoutFcMoy = undefined
            }

            // Boucle pour trouver la vitesse max du tableau qui contient la vitesse max de chaque tour
            let workoutMaximumSpeed = lapMaximumSpeed[0] || undefined
            if (lapMaximumSpeed.length > 0) {
                lapMaximumSpeed.forEach(element => {
                    if (element > workoutMaximumSpeed) {workoutMaximumSpeed=element}
                });
            } else {
                workoutMaximumSpeed = undefined
            }

            // conversion des secondes en minutes pour la durée de l'entrainement
            workoutTime = workoutTime/60

            // arrondi des valeurs de distance et du vitesse max
            if (workoutDistance != 0 && workoutDistance != undefined) {workoutDistance = Number(workoutDistance.toFixed(2))} else {workoutDistance = undefined}
            if (workoutMaximumSpeed != 0 && workoutMaximumSpeed != undefined) {workoutMaximumSpeed = Number(workoutMaximumSpeed.toFixed(2))} else {workoutMaximumSpeed = undefined}

            // récup du dénivelé positif de l'entraînement 
            const dataAltitude = xmlDoc.getElementsByTagName("AltitudeMeters")
            // init pour la boucle
            let workoutDenivele = 0
            if (dataAltitude.length > 0) {
                const tableauDataAltitude = Array.from(dataAltitude) // conversion du xml en tableau
                let deniveleLastLap = Number(tableauDataAltitude[0].textContent)
                tableauDataAltitude.forEach(element => {
                    // formule pr calculer le denivele positif : si le denivele du lap actuel est supérieur au denivele du lap précédent alors on ajoute la différence au dénivelé total de l'entraînement
                    if (Number(element.textContent) > deniveleLastLap) {
                        workoutDenivele = workoutDenivele+(Number(element.textContent)-deniveleLastLap) 
                    }

                    deniveleLastLap = Number(element.textContent) // on met à jour le dénivelé du lap précédent pour la prochaine itération de la boucle
                });

                // arrondi des valeurs
                workoutDenivele = Math.floor(workoutDenivele)

            }
            if (workoutDenivele == 0) {workoutDenivele = undefined}

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

            // calcul du RPE
            // formule ci dessous à améliorer parce qu'elle n'est pas prouvé scientifiquement
            let rpeWorkout = Math.round((workoutFcMoy/workoutFcMax)*10) || 1 // formule pour calculer le RPE : (FC moy / FC max) * 10
            if (rpeWorkout < 1) { // si inférieur à 1 on le met sur la valeur minimum (=1)
                rpeWorkout = 1
            } else if (rpeWorkout > 10) { // si supérieur à 10 on le met sur la valeur max (=10)
                rpeWorkout = 10
            }
            let chargeEntrainementWorkout = Math.floor(rpeWorkout*workoutTime) 

            // si la durée de l'entrainement est pas définie ou égale à 0 on enregsitre rien
            if (workoutTime == 0 || workoutTime == undefined) {
                alert("Une erreur s'est produite lors de l'importation de la séance. Veuillez vérifier que votre fichier TCX contient une durée d'entraînement valide.")
                button.disabled = false
                button.textContent = "Importer fichier"
                return
            }
            // pareil mais pour la date
            if (workoutDate == undefined || new Date(workoutDate) == "Invalid Date") {
                alert("Une erreur s'est produite lors de l'importation de la séance. Veuillez vérifier que votre fichier TCX contient une date d'entraînement valide.")
                button.disabled = false
                button.textContent = "Importer fichier"
                return
            }

            // Calcul de la transpiration
            let profilDB = await db.profil.get(1)
            let TranspirationEstimee = 0
            let HydratationEstimee = 0

            if (profilDB != undefined) {
                let poidsUser = Number(profilDB.poids)
                let DureeHeure = workoutTime/60 // Conversion de la durée en heure
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

            // enregistrement des datas recup dans la BDD 
            if (workoutSport != "Libre") { 
                await db.entrainement.add({
                    sport: workoutSport,
                    nom: workoutSport+" le "+workoutDate.split("-")[2]+"/"+workoutDate.split("-")[1].padStart(2, "0"), // exemple : Course le 28/04
                    date: workoutDate,
                    duree: workoutTime,     
                    rpe: rpeWorkout,
                    fc_moy: workoutFcMoy,
                    fc_max: workoutFcMax,
                    distance:workoutDistance,
                    allure_moy: workoutAllureMoy,
                    vitesse_moy: workoutVitesseMoy,
                    vitesse_max: workoutMaximumSpeed,
                    denivele: workoutDenivele,
                    charge_entrainement: chargeEntrainementWorkout,
                    transpiration_estimee: TranspirationEstimee,
                    hydratation_estimee: HydratationEstimee
                });
            } else { // si le sport est libre on enregistre mais on limite le nombre de données on autorise de prendre que la distance comme datas spe
                await db.entrainement.add({
                    sport: workoutSport,
                    nom: workoutSport+" le "+workoutDate.split("-")[2]+"/"+workoutDate.split("-")[1].padStart(2, "0"), // exemple : Course le 28/04
                    date: workoutDate,
                    duree: workoutTime,     
                    rpe: rpeWorkout,
                    fc_moy: workoutFcMoy,
                    fc_max: workoutFcMax,
                    distance:workoutDistance,
                    charge_entrainement: chargeEntrainementWorkout,
                    transpiration_estimee: TranspirationEstimee,
                    hydratation_estimee: HydratationEstimee
                });
            }

            // logo dynamique pour dire que c'est okk
            setTimeout(() => {              
                button.disabled = false
                button.textContent = "Importer TCX"
                window.location.href = "../../index.html?workoutimport" // redirection vers l'historique d'entrainement après l'importation 
            }, 650)   

        } catch {
            alert("Une erreur s'est produite lors de l'importation de la séance. Veuillez vérifier que votre fichier TCX est valide et réessayez.")
            button.disabled = false
            button.textContent = "Importer TCX"
        }

    } 

    return
}
