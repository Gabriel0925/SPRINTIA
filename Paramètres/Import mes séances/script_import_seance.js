function extractionDate(dateWorkout) {
    if (dateWorkout == undefined) {return ""} // si pas de datas

    // ex: dateWorkout = "2026-02-25 15:41:45"
    let separationDate = dateWorkout.split(" ") // ex: ["2026-02-25", "15:41:45"]

    return separationDate[0]
}

function conversionMinutes(DureeWorkoutUser) {
    if (DureeWorkoutUser == undefined) {return ""} // si pas de datas

    // ex : DureeWorkoutUser = "00:39:00"
    DureeWorkoutUser = DureeWorkoutUser.replace('"', "") // ex : DureeWorkoutUser = 00:39:00"
    DureeWorkoutUser = DureeWorkoutUser.replace('"', "") // ex : DureeWorkoutUser = 00:39:00

    if (DureeWorkoutUser.includes(":")) {
        let FormatDuree = DureeWorkoutUser.split(":")
        // Extraction des heures minutes et secondes
        let heures = parseInt(FormatDuree[0])
        let minutes = parseInt(FormatDuree[1])
        let secondes = parseInt(FormatDuree[2])

        // Conversion de la durée en minutes
        DureeWorkoutUser = (heures*60) + minutes + (secondes/60)
        // La vérification de la durée maximum/minimum se fait dans la fonction RegistrationWorkout
        return DureeWorkoutUser
    } else { // si il n'y a pas de ":" dans DureeWorkoutUser alors on renvoie rien
        return ""
    }

}

function enleverGuillemet(elt) {
    if (!elt) {return null}
    // ex : elt = "Rameur"
    if (elt.includes('"')) { // pr pas provoquer une erreur si il n'y a pas
        elt = elt.replace('"', "") // ex : elt = Rameur"
        elt = elt.replace('"', "") // ex : elt = Rameur
        return elt
    } 
}

async function uploadGarmin(event) {
    const file = event.target.files[0]

    if (file) {
        // on lit le fichier en format tx
        const readFile = await file.text()

        // pour trier par colonne
        const colonneFile = readFile.split("\n")

        const enteteFile = colonneFile[0] // pour récupérer les entetes (ex : ["Sport,Duree,RPE"])
        const elementEnteteFile = enteteFile.split(",") // pour récupérer chaque catégorie de l'entêtes (ex : ["Sport", "Duree", "RPE"])

        // recup des index
        let indexSportWorkout = elementEnteteFile.indexOf("Type d'activité")
        let indexDateWorkout = elementEnteteFile.indexOf("Date")
        let indexNomWorkout = elementEnteteFile.indexOf("Titre")
        let indexDureeWorkout = elementEnteteFile.indexOf("Durée")
        let indexTrainingEffectWorkout = elementEnteteFile.indexOf("TE aérobie")
        let indexDistanceWorkout = elementEnteteFile.indexOf("Distance")

        // init
        let compteur = 0
        let WorkoutFile = []
        let HistoryWorkoutUser = []
        
        colonneFile.forEach(element => {
            if (compteur == 0) {} // quand c'est égale à 0, c'est les entêtes qu'on a deja extrait plus haut dans le code
            else {
                // on fait un tableau des datas complete de l'activité (ex : ['Course à pied', '2026-02-25 15:41:45', 'false', `"Magny-sur-Tille - 6 x 600m (R=2'30")"`, '"6.57"', '"444"', '"00:39:24"']
                WorkoutFile = element.split(",")
                HistoryWorkoutUser.push(WorkoutFile) // on ajoute le tableau des datas de l'entrainement dans le tableau de l'historique d'entrainement du user
            }

            compteur += 1
        });

        for (const element of HistoryWorkoutUser) {
            // recup des datas
            let sportWorkout = element[indexSportWorkout]
            let dateWorkout = element[indexDateWorkout]
            let nomWorkout = element[indexNomWorkout]
            let dureeWorkout = element[indexDureeWorkout]
            let trainingEffectWorkout = element[indexTrainingEffectWorkout]
            let distanceWorkout = element[indexDistanceWorkout]

            if (!sportWorkout && !dateWorkout && !dureeWorkout) {
                //pass
            } else {
                // ajout de datas pour les datas que je ne peux pas récupérer dans le CSV Garmin
                let deniveleWorkout = 0
                let musclesTravailleWorkout = "Pas de muscles travaillés"

                // extraction uniquement de la date et passage du format hh:mm:ss en minutes pour la durée
                dateWorkout = extractionDate(dateWorkout)
                dureeWorkout = conversionMinutes(dureeWorkout)

                // on enleve les guillemets sur les datas car garmin enregistre test = "test" et quand je le met dans un tableau ça fait ""test""
                nomWorkout = enleverGuillemet(nomWorkout)
                distanceWorkout = enleverGuillemet(distanceWorkout)
                trainingEffectWorkout = enleverGuillemet(trainingEffectWorkout)

                // vérification
                if (trainingEffectWorkout == "--") {
                    trainingEffectWorkout = "0.5" // car quand on va multiplier par 2 ça fera 1
                }

                // on remet les bon nom de sport pour que Sprintia mettre les bonnes cartes dans l'historique d'entraînement
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
    }


    return
}