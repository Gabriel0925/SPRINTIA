const seuilRecord = {
    "Course": [
        {"distance": 42.195, "type": "Marathon", "typeRecord": "42-kilometres-course"},
        {"distance": 21.0975, "type": "Semi-marathon", "typeRecord": "21-kilometres-course"},
        {"distance": 10, "type": "10km", "typeRecord": "10-kilometres-course"},
        {"distance": 5, "type": "5km", "typeRecord": "5-kilometres-course"},
        {"distance": 1, "type": "1km", "typeRecord": "1-kilometres-course"}
    ],
    "Vélo": [
        {"distance": 150, "type": "150km", "typeRecord": "150-kilometres-velo"},
        {"distance": 100, "type": "100km", "typeRecord": "100-kilometres-velo"},
        {"distance": 50, "type": "50km", "typeRecord": "50-kilometres-velo"},
        {"distance": 20, "type": "20km", "typeRecord": "20-kilometres-velo"},
        {"distance": 10, "type": "10km", "typeRecord": "10-kilometres-velo"}
    ],
    "Natation": [
        // la distance de l'entraînement est en km donc on met en km au lieu de metres
        {"distance": 0.100, "type": "100m", "typeRecord": "100-metres-natation"},
        {"distance": 0.400, "type": "400m", "typeRecord": "400-metres-natation"},
        {"distance": 1.000, "type": "1000m", "typeRecord": "1000-metres-natation"},
        {"distance": 1.500, "type": "1500m", "typeRecord": "1500-metres-natation"},
        {"distance": 3.800, "type": "3800m", "typeRecord": "3800-metres-natation"}
    ]
}

async function saveRecordDistPlusLongue(workout, idRecord) {
    // quand idRecord == undefined ça veut dire que on fait un add, on n'écrase pas une autre ligne
    // en revanche si il y a un idRecord on modifie la ligne existante au lieu dans créer une autre
    if (idRecord == undefined) {
        await db.records.add({
            "id_entrainement": workout.id,
            "sport": workout.sport,
            "type_record": "distance-plus-longue"
        })

    } else {
        await db.records.put({
            "id": idRecord,
            "id_entrainement": workout.id,
            "sport": workout.sport,
            "type_record": "distance-plus-longue"
        })
    }
    
}
async function recordDistancePluslongue(workout, idWorkout) {
    const tableauSportCompatible = ["Course", "Vélo", "Natation"]
    const sportWorkout = tableauSportCompatible.includes(workout.sport) ||undefined
    if (sportWorkout == undefined) {return}

    try {
        const dataRecordDistance = await db.records
                                        .where("sport").equals(workout.sport)
                                        .filter(elt => elt.type_record == "distance-plus-longue")
                                        .first()

        // si ya pas de données de record alors c'est un record
        if (dataRecordDistance == undefined) {
            await saveRecordDistPlusLongue(workout, undefined)
            return
        }

        // on vérifie si l'entraînement existe belle et bien
        const dataEntrainement = await db.entrainement.get(idWorkout) || undefined
        if (dataEntrainement == undefined) {
            alert("Une erreur s'est produite : l'entraînement n'existe pas !")
            return
        }
                
        const dataWorkout = await db.entrainement.get(dataRecordDistance.id_entrainement)
        if (dataWorkout== undefined) {return false}

        // on recup les datas des records et si il y a déjà une valeur save pour ce type de record alors on l'écrase au lieu d'ajouter une ligne
        const entrainementDansRecord = await db.records.filter(elt => elt.sport == workout.sport && elt.type_record == "distance-plus-longue")
                                                .first() ||undefined

        if (entrainementDansRecord != undefined) {
            if (Number(workout.distance) > Number(dataWorkout.distance)) {
                await saveRecordDistPlusLongue(workout, entrainementDansRecord.id)
            }

        } else {
            // sinon on enregistre le record normalement
            if (Number(workout.distance) > Number(dataWorkout.distance)) {
                await saveRecordDistPlusLongue(workout, undefined)
            }
        }

    } catch(error) {
        console.log(error)
        alert("Une erreur s'est produite lors de l'enregistrement de votre record !")
        return
    }
}

async function compareWithRecord(dureeWorkout, sport, typeRecord) {
    if (typeRecord == undefined) {
        alert("Une erreur s'est produite !")
        return
    }

    // on recup le record actuelle du user en fonction du sport (ex-> course) et du type de record (ex-> 10km)
    const dataRecord = await db.records
                        .where("sport").equals(sport)
                        .filter(elt => elt.type_record == typeRecord)
                        .last()

    // si ya pas de données de record alors on return true car c'est un nouveau record
    if (dataRecord == undefined) {return true}

    // on recup l'entrainement
    const dataWorkout = await db.entrainement.get(dataRecord.id_entrainement)
    if (dataWorkout== undefined) {return false}

    // si il n'y a pas de durée dans l'entrainement on return false
    const dureeRecord = dataWorkout.duree ||undefined
    if (dureeRecord== undefined) {return false}

    // si c'est un nouveau record, si la durée est plus petite que l'ancien record alors on return true
    if (dureeWorkout < dureeRecord) {return true} else {return false}
}

async function saveRecord(workout, idWorkout, typeRecord) {
    if (typeRecord == undefined) {
        alert("Une erreur s'est produite lors de l'enregistrement de votre record !")
        return
    }

    try {
        // on vérifie si l'entraînement existe belle et bien
        const dataEntrainement = await db.entrainement.get(idWorkout) || undefined
        if (dataEntrainement == undefined) {
            alert("Une erreur s'est produite : l'entraînement n'existe pas !")
            return
        }

        // on recup les datas des records et si il y a déjà une valeur save pour ce type de record alors on l'écrase au lieu d'ajouter une ligne
        const entrainementDansRecord = await db.records
                                                .filter(elt => elt.sport == workout.sport && elt.type_record == typeRecord)
                                                .first() ||undefined

        if (entrainementDansRecord != undefined) {
            await db.records.put({
                "id": entrainementDansRecord.id,
                "id_entrainement": idWorkout,
                "sport": workout.sport,
                "type_record": typeRecord
            })

        } else {
            // sinon on enregistre le record normalement
            await db.records.add({
                "id_entrainement": idWorkout,
                "sport": workout.sport,
                "type_record": typeRecord
            })
        }

    } catch(error) {
        console.log(error)
        alert("Une erreur s'est produite lors de l'enregistrement de votre record !")
        return 
    }
}

async function checkRecord(workout, idWorkout) {
    // vérification
    if (workout == undefined) {return undefined}

    const dureeWorkout = Number(workout.duree) ||undefined
    const distanceWorkout = Number(workout.distance)||undefined

    // vérification
    if (!dureeWorkout ||!distanceWorkout) {return undefined}
    if (dureeWorkout<=0 || isNaN(dureeWorkout) ||dureeWorkout == undefined) {return undefined}
    if (distanceWorkout<=0 || isNaN(distanceWorkout) ||distanceWorkout == undefined) {return undefined}

    const dicoSeuilRecord = seuilRecord[workout.sport] ||undefined

    if (dicoSeuilRecord == undefined) {return undefined}
    // on parcourt chaque elt du dico seuilRecord en fonction du sport
    for (const elt of dicoSeuilRecord) {
        // si la distance de l'entrainement du user est plus grande que elt.distance 
        if (distanceWorkout >= elt.distance) {
            // on check si c'est un nouveau record
            let isRecord = await compareWithRecord(workout.duree, workout.sport, elt.typeRecord)

            if (isRecord==true) { // si c'est un nouveau record alors on save
                await saveRecord(workout, idWorkout, elt.typeRecord)
            }
        }
    }

    await recordDistancePluslongue(workout ,idWorkout)
}

async function refreshRecord() {
    try{
        const dataAllWorkout = await db.entrainement.toArray()

        // on clear la bdd record pr repartir sur de bonnes bases
        await db.records.clear()

        for (const [sport, dicoSeuilRecord] of Object.entries(seuilRecord)) {
            // on créer un tableau uniquement avec le sport compatible, donc le sport qu'on parcourt dans le dico "seuilRecord"
            const workoutCompatible = dataAllWorkout.filter(workout => workout.sport == sport 
                && workout.duree != undefined && Number(workout.duree) > 0
                && workout.distance != undefined && Number(workout.distance) > 0)

            // si ya pas de sport compatible alors on passe au prochain elt de seuilRecord
            if (workoutCompatible.length <=0) {continue}

            // Recherche du record de la distance la plus longue
            // on met dans une var le tout premier entrainement compatible avec le seuilrecord actuelle
            let dataWorkoutWithDistPlusLongue = workoutCompatible[0]
            for (const workout of workoutCompatible) {
                if (Number(workout.distance)> Number(dataWorkoutWithDistPlusLongue.distance)) {
                    dataWorkoutWithDistPlusLongue = workout
                }
            }
            await saveRecord(dataWorkoutWithDistPlusLongue, dataWorkoutWithDistPlusLongue.id, "distance-plus-longue")

            // recherche des records de temps par seuil : 5k, 10k,...
            for (const seuil of dicoSeuilRecord) {
                let dataWorkoutWithBestTime = undefined

                // on recherche par palier, donc là seuil en fonction du sport qui est entrain d'être parcouru dans la grande boucle for
                // par exemple notre seuil peut être : "{"distance": 42.195, "type": "Marathon", "typeRecord": "42-kilometres-course"}"
                // au prochain tour ça sera : {"distance": 21.0975, "type": "Semi-marathon", "typeRecord": "21-kilometres-course"}
                // et une fois le tour complet fait, la grande boucle qui parcoure "seuilRecord" passera de course à vélo,...
                for (const workout2 of workoutCompatible) {
                    if (Number(workout2.distance) >= Number(seuil.distance)) {
                        if (dataWorkoutWithBestTime==undefined || Number(workout2.duree) < Number(dataWorkoutWithBestTime.duree)) {
                            dataWorkoutWithBestTime=workout2
                        }
                    }
                }
                // si on a trouvé un record alors on le save dans record
                if (dataWorkoutWithBestTime!=undefined) {
                    await saveRecord(dataWorkoutWithBestTime, dataWorkoutWithBestTime.id, seuil.typeRecord)
                }

            }
        } 
    } catch(error) {
        console.log(error)
        alert("Une erreur s'est produite lors d'une opération sur vos records !")
        return "error"
    }
}