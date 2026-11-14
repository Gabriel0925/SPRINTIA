async function compareWithRecord(timeForADistance, sport, typeRecord) {
    // on recup le record actuelle du user en fonction du sport (ex-> course) et du type de record (ex-> 10km)
    const dataRecord = await db.records
                        .where("sport").equals(sport)
                        .filter(elt => elt.type_record == typeRecord)
                        .first()

    // si ya pas de données de record alors on return true car c'est un nouveau record
    if (dataRecord == undefined) {return true}

    // si c'est un nouveau record, si la durée est plus petite que l'ancien record alors on return true
    if (timeForADistance < dataRecord.duree) {return true} else {return false}
}

function calculTempsForADistance(allureDecimalMoy, distanceCible) {
    return allureDecimalMoy*distanceCible
}
function allureMoyenneDecimal(duree, distance) {
    return duree/distance // attention c'est l'allure décimal, exemple -> 5,62 min/km
}

function checkRecordCourse(workout) {
    const dureeWorkout = Number(workout.duree)
    const distanceWorkout = Number(workout.distance)

    let newRecord = false

    // vérification
    if (!dureeWorkout ||!distanceWorkout) {return newRecord}
    if (dureeWorkout<=0 ||dureeWorkout == undefined) {return newRecord}
    if (distanceWorkout<=0 ||distanceWorkout == undefined) {return newRecord}

    const allureMoyDecimaleWorkout = allureMoyenneDecimal(dureeWorkout, distanceWorkout)

    if (distanceWorkout >= 42.195) {
        let timeForADistance = calculTempsForADistance(allureMoyDecimaleWorkout, 42.195)
        newRecord = compareWithRecord(timeForADistance, workout.sport, "Marathon")

    } else if (distanceWorkout >= 21.0975) {
        let timeForADistance = calculTempsForADistance(allureMoyDecimaleWorkout, 21.0975)
        newRecord = compareWithRecord(timeForADistance, workout.sport, "Semi-marathon")

    } else if (distanceWorkout >= 10) {
        let timeForADistance = calculTempsForADistance(allureMoyDecimaleWorkout, 10)
        newRecord = compareWithRecord(timeForADistance, workout.sport, "10km")

    } else if (distanceWorkout >= 5) {
        let timeForADistance = calculTempsForADistance(allureMoyDecimaleWorkout, 5)
        newRecord = compareWithRecord(timeForADistance, workout.sport, "5km")

    } else if (distanceWorkout >= 1) {
        let timeForADistance = calculTempsForADistance(allureMoyDecimaleWorkout, 1)
        newRecord = compareWithRecord(timeForADistance, workout.sport, "1km")

    }

    return newRecord
}

function checkRecord(workout) {
    // init
    const dicoFunctionSport = {
        "Course": checkRecordCourse,
        "Vélo": checkRecordCourse,
        "Natation": checkRecordCourse
    }

    // vérification
    if (workout == undefined) {return undefined}
    if (!dicoFunctionSport[workout.sport]) {return undefined}
    
    // lancement de la fonction
    return dicoFunctionSport[workout.sport](workout)
}