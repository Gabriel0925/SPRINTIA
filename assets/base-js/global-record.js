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

async function checkRecordCourse(workout) {
    const dureeWorkout = Number(workout.duree)
    const distanceWorkout = Number(workout.distance)

    let newRecord = false
    let typeRecord = undefined

    // vérification
    if (!dureeWorkout ||!distanceWorkout) {return newRecord}
    if (dureeWorkout<=0 || isNaN(dureeWorkout) ||dureeWorkout == undefined) {return newRecord}
    if (distanceWorkout<=0 || isNaN(distanceWorkout) ||distanceWorkout == undefined) {return newRecord}

    const allureMoyDecimaleWorkout = allureMoyenneDecimal(dureeWorkout, distanceWorkout)

    if (distanceWorkout >= 42.195) {
        let timeForADistance = calculTempsForADistance(allureMoyDecimaleWorkout, 42.195)
        newRecord = await compareWithRecord(timeForADistance, workout.sport, "Marathon")
        typeRecord = "42-kilometres-course"

    } else if (distanceWorkout >= 21.0975) {
        let timeForADistance = calculTempsForADistance(allureMoyDecimaleWorkout, 21.0975)
        newRecord = await compareWithRecord(timeForADistance, workout.sport, "Semi-marathon")
        typeRecord = "21-kilometres-course"

    } else if (distanceWorkout >= 10) {
        let timeForADistance = calculTempsForADistance(allureMoyDecimaleWorkout, 10)
        newRecord = await compareWithRecord(timeForADistance, workout.sport, "10km")
        typeRecord = "10-kilometres-course"

    } else if (distanceWorkout >= 5) {
        let timeForADistance = calculTempsForADistance(allureMoyDecimaleWorkout, 5)
        newRecord = await compareWithRecord(timeForADistance, workout.sport, "5km")
        typeRecord = "5-kilometres-course"

    } else if (distanceWorkout >= 1) {
        let timeForADistance = calculTempsForADistance(allureMoyDecimaleWorkout, 1)
        newRecord = await compareWithRecord(timeForADistance, workout.sport, "1km")
        typeRecord = "1-kilometres-course"

    }

    return [newRecord, typeRecord]
}

async function saveRecord(workout, idWorkout, typeRecord) {
    if (typeRecord == undefined) {alert("Une erreur s'est produite lors de l'enregistrement de votre record !")}

    console.log({
        "id_entrainement": idWorkout,
        "sport": workout.sport,
        "type_record": typeRecord,
        "duree": workout.duree
    })

    await db.records.add({
        "id_entrainement": idWorkout,
        "sport": workout.sport,
        "type_record": typeRecord,
        "duree": workout.duree
    })
}

async function checkRecord(workout, idWorkout) {
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
    let [isRecord, typeRecord] = await dicoFunctionSport[workout.sport](workout) // 
    if (isRecord == true) {
        await saveRecord(workout, idWorkout, typeRecord)
    }
}