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
                window.location.href = "../../../index.html?workoutimport" // redirection vers l'historique d'entrainement après l'importation 
            }, 650)    
        } catch {
            alert("Une erreur s'est produite lors de l'importation de votre historique d'entraînement.")
            button.disabled = false
            button.textContent = "Importer CSV"
        }

    }

    return
}