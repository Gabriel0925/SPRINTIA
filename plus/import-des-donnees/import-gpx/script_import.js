async function uploadFileGPX(event) {
    const dicoNameSport = { // init dico pr les sports
        "running":"Course",
        "cycling":"Vélo"
    }

    const fileGPX = event.target.files[0]
    let button = document.getElementById("button-import-gpx")

    if (fileGPX) {
        button.disabled = true
        button.textContent = "Importation..."

        try {
            let textFile = await fileGPX.text() // on récup le contenu du fichier en texte

            const gpx = new gpxParser() // création de l'objet de la bibliotheque gpxParser
            gpx.parse(textFile)

            // recup de la date
            const objetDate = gpx.metadata.time // c'est un objet date JS
            const workoutDate = objetDate.toISOString().split("T")[0] // 2026-07-03

            // recup de la durée de l'entrainement (gpxparser donne lheure de début/fin de l'entrainement) donc
            const tracks=gpx.tracks[0]
            const heureDebut = new Date(tracks.points[0].time) // on prend le premier point
            const heureFin = new Date(tracks.points[tracks.points.length - 1].time) // puis le dernier, grace à la longueur du nb de point du fichier GPX

            // calcul de la différence en ms
            const differenceBetweenDebutFin = heureDebut-heureFin
            const workoutTime = differenceBetweenDebutFin/60000 // conversion des ms en min

            // recup des datas spé au sport
            const workoutDistance = gpx.tracks[0].distance.total // distance en metres
            const workoutDenivele = gpx.tracks[0].elevation.pos // denivelé positif
            const pointsGPS = gpx.tracks[0].points.map(point => [point.lat, point.lon]) // [latitude, longitude]

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

            // on essaye de recup la fc moy/max si les datas sont dans le fichier
            let workoutFcMoy = 0
            let workoutFcMax = 0
            let compteur = 0

            tracks.point.forEach(element => {
                let fcDuPoint = Number(element?.textContent??undefined)

                // controle de la qualité des datas
                if (fcDuPoint != undefined) {
                    if (fcDuPoint > workoutFcMax) { // pr trouver la fc max
                        workoutFcMax = fcDuPoint
                    }
                    // pr accumuler toutes les fc moy et diviser par la suite
                    workoutFcMoy += fcDuPoint
                    compteur += 1 // incré
                }
            });

            // calcul de la fc moy (somme de toutes les fc des tours/ nb tours)
            workoutFcMoy = Math.round(workoutFcMoy/compteur)

// !!! à revoir !!!
            // calcul du RPE
            // formule ci dessous à améliorer parce qu'elle n'est pas prouvé scientifiquement
            let rpeWorkout = 1
            if (workoutFcMoy != 0 && workoutFcMax != 0) {// si ya des datas on calcule sinon on laisse à 1
                rpeWorkout = Math.round((workoutFcMoy/workoutFcMax)*10) || 1 // formule pour calculer le RPE : (FC moy / FC max) * 10
                if (rpeWorkout < 1) { // si inférieur à 1 on le met sur la valeur minimum (=1)
                    rpeWorkout = 1
                } else if (rpeWorkout > 10) { // si supérieur à 10 on le met sur la valeur max (=10)
                    rpeWorkout = 10
                }
            }
            let chargeEntrainementWorkout = Math.floor(rpeWorkout*workoutTime)
// !!! fin de à revoir !!! 
            
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

            // si la durée ou la date de l'entrainement n'est pas définie ou égale à 0 on enregistre rien
            if (workoutTime == 0 || new Date(workoutDate) == "Invalid Date") {
                alert("Une erreur s'est produite lors de l'importation de la séance. Veuillez vérifier que votre fichier GPX contient des valeurs valides.")
                button.disabled = false
                button.textContent = "Importer fichier"
                return
            }

            // enregistrement des datas
            const dicoDatasWorkout = {
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
            const dicoDataClean = removeValueUndefined(dicoDataBase) // toutes les valeurs en undefined sont enlever du dico
            await db.entrainement.add(dicoDataClean)

            button.textContent = "Importé"
            await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))
            window.location.href = "../../../index.html?workoutimport" // redirection vers l'historique d'entrainement après l'importation 
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