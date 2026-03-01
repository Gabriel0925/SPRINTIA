function logoDynamique() {
    // timeout remis a 0 (suppresion plutot)
    clearTimeout(Timer1)
    clearTimeout(Timer2)
    document.getElementById("a-logo").classList.remove("return", "pin-message")
                
    // petite récompense pour le user
    document.getElementById("a-logo").classList.add("pin-message")

    document.getElementById("a-logo").textContent = "Bien reçu 😋"

    Timer1 = setTimeout(() => { 
        document.getElementById("a-logo").classList.add("return") // a ré-ajoute une class pour qu'il y est une animation de retour
        document.getElementById("a-logo").textContent = "Sprintia"; // on raffiche Sprintia
    }, 2500); // on laisse le message pendant 2,5s pour que le user est le temps de le lire

    Timer2 = setTimeout(() => {
        // remise à l'état initial, on supprime les 2 class qu'on a mis dès la fin du setTimeout au dessus
        document.getElementById("a-logo").classList.remove("return")
        document.getElementById("a-logo").classList.remove("pin-message")
    }, 3100) // durée choisis à la main
    return
}

function extractionDate(dateWorkout) {
    if (dateWorkout == undefined) {return "jj:mm:aaaa"} // si pas de datas

    // ex: dateWorkout = "2026-02-25 15:41:45"
    let separationDate = dateWorkout.split(" ") // ex: ["2026-02-25", "15:41:45"]

    return separationDate[0]
}

function conversionMinutes(DureeWorkoutUser) {
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

function conversionMinutesTP(DureeWorkoutUser) {
    // training peaks renvoie 1.5 heure donc on le repasse en minutes -> 90 minutes
    DureeWorkoutUser = DureeWorkoutUser*60
    return DureeWorkoutUser
}

// init pour le logo dynamique
let Timer1 = 0
let Timer2 = 0

async function uploadGarmin(event) {
    const fileCSV = event.target.files[0]
    let button = document.querySelector(".import-garmin")
    let langueEnglish = false

    if (fileCSV) {
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

        // on regarde si le csv est en anglais
        if (indexSportWorkout == -1 && indexDureeWorkout == -1 && indexNomWorkout == -1) {
            langueEnglish = true // on préviens que le CSV est en anglais pour la suite du code

            indexSportWorkout = enteteFile.indexOf("Activity Type")
            indexDateWorkout = enteteFile.indexOf("Date")
            indexNomWorkout = enteteFile.indexOf("Title")
            indexDureeWorkout = enteteFile.indexOf("Time")
            indexTrainingEffectWorkout = enteteFile.indexOf("Aerobic TE")
            indexDistanceWorkout = enteteFile.indexOf("Distance")
        }

        for (const elt of dataHistoriqueEntrainement) {
            // recup des datas
            let sportWorkout = elt[indexSportWorkout]
            let dateWorkout = elt[indexDateWorkout]
            let nomWorkout = elt[indexNomWorkout]
            let dureeWorkout = elt[indexDureeWorkout]
            let trainingEffectWorkout = elt[indexTrainingEffectWorkout]
            let distanceWorkout = elt[indexDistanceWorkout]

            if (elt.length <= 1) { // car la derniere ligne du CSV Garmin renvoie ça [''] et length == 1
                //pass
            } else {
                // ajout de datas pour les datas que je ne peux pas récupérer dans le CSV Garmin
                let deniveleWorkout = 0
                let musclesTravailleWorkout = "Pas de muscles travaillés"

                // extraction uniquement de la date et passage du format hh:mm:ss en minutes pour la durée
                dateWorkout = extractionDate(dateWorkout)
                dureeWorkout = conversionMinutes(dureeWorkout)

                // vérification
                if (trainingEffectWorkout == "--") {
                    trainingEffectWorkout = "0.5" // car quand on va multiplier par 2 ça fera 1
                }

                // on remet les bon nom de sport pour que Sprintia mettre les bonnes cartes dans l'historique d'entraînement
                if (langueEnglish == false) { // le csv est en anglais
                    if (sportWorkout == "Course à pied") {
                        sportWorkout="Course"
                    } else if (sportWorkout == "Cyclisme") {
                        sportWorkout="Vélo"
                    } else if (sportWorkout == "Marche à pied") {
                        sportWorkout="Marche"
                    } else if (sportWorkout == "Randonnée") {
                        sportWorkout="Marche"
                    } else if (sportWorkout == "Musculation") { // ça peut paraitre debile mais ne pas enlever sinon le sport muscu va se transformer en Libre
                        sportWorkout="Musculation"
                    } else {
                        sportWorkout = "Libre"
                    }
                } else { // le csv est en anglais donc on change les if pour mettre en anglais
                    if (sportWorkout == "Running") {
                        sportWorkout="Course"
                    } else if (sportWorkout == "Cycling") {
                        sportWorkout="Vélo"
                    } else if (sportWorkout == "Walking") {
                        sportWorkout="Marche"
                    } else if (sportWorkout == "Hiking") {
                        sportWorkout="Marche"
                    } else if (sportWorkout == "Strength Training") {
                        sportWorkout="Musculation"
                    } else {
                        sportWorkout = "Libre"
                    }
                }

                // conversion de type
                distanceWorkout = parseFloat(distanceWorkout)
                trainingEffectWorkout = parseInt(trainingEffectWorkout)

                // calcul du RPE et de la charge d'entrainement
                let rpeWorkout = trainingEffectWorkout*2
                if (rpeWorkout < 1) { // si inférieur à 1 on le met sur la valeur minimum (=1)
                    rpeWorkout = 1
                }
                if (rpeWorkout > 10) { // si supérieur à 10 on le met sur la valeur max (=10)
                    rpeWorkout = 10
                }
                let chargeEntrainementWorkout = Math.floor(rpeWorkout*dureeWorkout)

                await db.entrainement.add({
                    sport: sportWorkout,
                    date: dateWorkout,
                    nom: nomWorkout,
                    duree: dureeWorkout,
                    rpe: rpeWorkout,
                    distance: distanceWorkout,
                    denivele: deniveleWorkout,
                    muscles_travailles: musclesTravailleWorkout,
                    charge_entrainement: chargeEntrainementWorkout
                })

            }
        }

        setTimeout(() => {
            logoDynamique()
        }, 650)

        // petite attente pour que le user voit le message dans le bouton
        setTimeout(() => {              
            button.disabled = false
            button.textContent = "Importer fichier"
        }, 650)    

    }


    return
}

async function uploadTrainingPeaks(event) {
    const fileCSV = event.target.files[0]
    let button = document.querySelector(".import-trainingpeaks")

    if (fileCSV) {
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

        for (const elt of dataHistoriqueEntrainement) {
            // recup des datas
            let sportWorkout = elt[indexSportWorkout]
            let dateWorkout = elt[indexDateWorkout]
            let nomWorkout = elt[indexNomWorkout]
            let dureeWorkout = elt[indexDureeWorkout]
            let rpeWorkout = elt[indexRpe]
            let distanceWorkout = elt[indexDistanceWorkout]

            if (elt.length <= 1) { // car la derniere ligne du CSV renvoie ça [''] et length == 1
                //pass
            } else {
                // ajout de datas pour les datas que je ne peux pas récupérer dans le CSV
                let deniveleWorkout = 0
                let musclesTravailleWorkout = "Pas de muscles travaillés"

                // passage du format hh:mm:ss en minutes pour la durée
                dureeWorkout = conversionMinutesTP(dureeWorkout)

                // arrondi de la distance car TP ne le fait pas
                distanceWorkout = distanceWorkout/1000 // on convertit des metres au kilometre

                // vérification
                if (rpeWorkout == "") {
                    rpeWorkout = "1"
                }
                if (dureeWorkout == "") {
                    // pas de datas donc on enregistre pas
                } else {
                    // on remet les bon nom de sport pour que Sprintia mettre les bonnes cartes dans l'historique d'entraînement
                    if (sportWorkout == "Run") {
                        sportWorkout="Course"
                    } else if (sportWorkout == "Bike") {
                        sportWorkout="Vélo"
                    } else if (sportWorkout == "Walk") {
                        sportWorkout="Marche"
                    } else if (sportWorkout == "Hike") {
                        sportWorkout="Marche"
                    } else if (sportWorkout == "Strength") {
                        sportWorkout="Musculation"
                    } else {
                        sportWorkout = "Libre"
                    }

                    // conversion de type
                    distanceWorkout = parseFloat(distanceWorkout)
                    rpeWorkout = parseInt(rpeWorkout)

                    // calcul du RPE et de la charge d'entrainement (petite sécurité mais normalement c'est bon)
                    if (rpeWorkout < 1) { // si inférieur à 1 on le met sur la valeur minimum (=1)
                        rpeWorkout = 1
                    }
                    if (rpeWorkout > 10) { // si supérieur à 10 on le met sur la valeur max (=10)
                        rpeWorkout = 10
                    }
                    let chargeEntrainementWorkout = Math.floor(rpeWorkout*dureeWorkout)

                    await db.entrainement.add({
                        sport: sportWorkout,
                        date: dateWorkout,
                        nom: nomWorkout,
                        duree: dureeWorkout,
                        rpe: rpeWorkout,
                        distance: distanceWorkout,
                        denivele: deniveleWorkout,
                        muscles_travailles: musclesTravailleWorkout,
                        charge_entrainement: chargeEntrainementWorkout
                    }) 
                } 
            }
        }

        setTimeout(() => {
            logoDynamique()
        }, 650)

        // petite attente pour que le user voit le message dans le bouton
        setTimeout(() => {              
            button.disabled = false
            button.textContent = "Importer fichier"
        }, 650)  

    }


    return
}

function verificationInputAge() {
    let AgeUser = parseInt(document.getElementById("age-user").value.trim());

    // Vérification du champ
    if (isNaN(AgeUser)) {
        alert("Erreur de saisie : le champ 'âge' doit être rempli.");
        return
    }
    if (AgeUser <= 0) {
        alert("Valeur non valide, l'âge doit être supérieur à 0.")
        return
    }
    if (AgeUser >= 150) {
        alert("Valeur non valide, l'âge doit être inférieur à 150.")
        return
    }

    document.getElementById('file-input-runkeeper').click()
}

async function uploadRunkeeper(event) {
    const fileCSV = event.target.files[0]
    let button = document.querySelector(".import-runkeeper")

    if (fileCSV) {
        // Récupérer la valeur du champs, on l'utilise pour estimer sa FC max plus tard
        let AgeUser = parseInt(document.getElementById("age-user").value
            .trim());
        // estimation fc max pour déterminer le RPE par la suite
        // Formule de Tanaka
        let fcMax = Math.round(208-0.7*AgeUser)

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
        let indexSportWorkout = enteteFile.indexOf("Type")
        let indexDateWorkout = enteteFile.indexOf("Date")
        let indexDureeWorkout = enteteFile.indexOf("Duration")
        let indexFcMoyWorkout = enteteFile.indexOf("Average Heart Rate (bpm)")
        let indexDistanceWorkout = enteteFile.indexOf("Distance (km)")
        let indexDeniveleWorkout = enteteFile.indexOf("Climb (m)")

        for (const elt of dataHistoriqueEntrainement) {
            // recup des datas
            let sportWorkout = elt[indexSportWorkout]
            let dateWorkout = elt[indexDateWorkout]
            let dureeWorkout = elt[indexDureeWorkout]
            let fcMoyWorkout = elt[indexFcMoyWorkout]
            // calcul du RPE
            let rpeWorkout = "1"
            if (fcMoyWorkout != "") { // si il y a de la datas de fc moy alors on calcule le RPE
                rpeWorkout = (fcMoyWorkout/fcMax)*10
            }
            let distanceWorkout = elt[indexDistanceWorkout]
            let deniveleWorkout = elt[indexDeniveleWorkout]

            if (elt.length <= 1) { // car la derniere ligne du CSV renvoie ça [''] et length == 1
                //pass
            } else {
                // ajout de datas pour les datas que je ne peux pas récupérer dans le CSV
                let musclesTravailleWorkout = "Pas de muscles travaillés"

                // extraction uniquement de la date et passage du format hh:mm:ss en minutes pour la durée
                dureeWorkout = conversionMinutes(dureeWorkout)
                dateWorkout = extractionDate(dateWorkout)

                // arrondi de la distance car TP ne le fait pas
                distanceWorkout = distanceWorkout // on convertit des metres au kilometre

                // vérification
                if (dureeWorkout == "") {
                    // pas de datas donc on enregistre pas
                } else {
                    // on remet les bon nom de sport pour que Sprintia mettre les bonnes cartes dans l'historique d'entraînement
                    if (sportWorkout == "Running") {
                        sportWorkout="Course"
                    } else if (sportWorkout == "Cycling") {
                        sportWorkout="Vélo"
                    } else if (sportWorkout == "Walking") {
                        sportWorkout="Marche"
                    } else if (sportWorkout == "Hiking") {
                        sportWorkout="Marche"
                    } else if (sportWorkout == "Strength Training" || sportWorkout == "Strength") { // je sais pas lequel utilise runkeeper mais ça doit être un des 2
                        sportWorkout="Musculation"
                    } else {
                        sportWorkout = "Libre"
                    }
                    
                    // pr le titre de l'entraînement
                    let nomWorkout = ""
                    if (sportWorkout == "Libre") {
                        nomWorkout = "Séance " + sportWorkout.toLowerCase()  // pour mettre en minuscule
                    } else {
                        nomWorkout = "Séance de " + sportWorkout.toLowerCase() // pour mettre en minuscule
                    }

                    // conversion de type
                    distanceWorkout = parseFloat(distanceWorkout)
                    rpeWorkout = parseInt(rpeWorkout)

                    // calcul du RPE et de la charge d'entrainement (petite sécurité mais normalement c'est bon)
                    if (rpeWorkout < 1) { // si inférieur à 1 on le met sur la valeur minimum (=1)
                        rpeWorkout = 1
                    }
                    if (rpeWorkout > 10) { // si supérieur à 10 on le met sur la valeur max (=10)
                        rpeWorkout = 10
                    }
                    let chargeEntrainementWorkout = Math.floor(rpeWorkout*dureeWorkout)

                    await db.entrainement.add({
                        sport: sportWorkout,
                        date: dateWorkout,
                        nom: nomWorkout,
                        duree: dureeWorkout,
                        rpe: rpeWorkout,
                        distance: distanceWorkout,
                        denivele: deniveleWorkout,
                        muscles_travailles: musclesTravailleWorkout,
                        charge_entrainement: chargeEntrainementWorkout
                    }) 
                } 
            }
        }

        setTimeout(() => {
            logoDynamique()
        }, 650)

        // petite attente pour que le user voit le message dans le bouton
        setTimeout(() => {              
            button.disabled = false
            button.textContent = "Importer fichier"
        }, 650)  

    }


    return
}
