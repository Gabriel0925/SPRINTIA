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
        {"distance": 100, "type": "100m", "typeRecord": "100-metres-natation"},
        {"distance": 400, "type": "400m", "typeRecord": "400-metres-natation"},
        {"distance": 1000, "type": "1000m", "typeRecord": "1000-metres-natation"},
        {"distance": 1500, "type": "1500m", "typeRecord": "1500-metres-natation"},
        {"distance": 3800, "type": "3800m", "typeRecord": "3800-metres-natation"}
    ]
}

async function recordDistancePluslongue(workout, idWorkout) {
    const tableauSportCompatible = ["Course", "Vélo", "Natation"]
    const sportWorkout = tableauSportCompatible.includes(workout.sport) ||undefined
    if (sportWorkout == undefined) {return}

    const dataRecordDistance = await db.records
                                    .where("sport").equals(workout.sport)
                                    .filter(elt => elt.type_record == "distance-plus-longue")
                                    .first()

    try {
        // on vérifie si l'entraînement existe belle et bien
        const dataEntrainement = await db.entrainement.get(idWorkout) || undefined
        if (dataEntrainement == undefined) {
            alert("Une erreur s'est produite : l'entraînement n'existe pas !")
            return
        }

        if (dataRecordDistance != undefined && Number(workout.distance) > Number(dataRecordDistance.distance)) {
            await db.records.add({
                "id_entrainement": idWorkout,
                "sport": workout.sport,
                "type_record": "distance-plus-longue",
                "distance": workout.distance
            })
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
                        .first()

    // si ya pas de données de record alors on return true car c'est un nouveau record
    if (dataRecord == undefined) {return true}

    const dureeRecord = dataRecord.duree ||undefined
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

        await db.records.add({
            "id_entrainement": idWorkout,
            "sport": workout.sport,
            "type_record": typeRecord,
            "duree": workout.duree
        })

    } catch(error) {
        console.log(error)
        alert("Une erreur s'est produite lors de l'enregistrement de votre record !")
        return 
    }

}

async function checkRecord(workout, idWorkout) {
    // vérification
    if (workout == undefined) {return undefined}
    
    const dureeWorkout = Number(workout.duree)
    const distanceWorkout = Number(workout.distance)

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
            let isRecord = await compareWithRecord(workout.duree, workout.sport, elt.typeRecord || undefined)

            if (isRecord==true) { // si c'est un nouveau record alors on save
                await saveRecord(workout, idWorkout, elt.typeRecord || undefined)
            }
        }
    }

    await recordDistancePluslongue(workout ,idWorkout)
}