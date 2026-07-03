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