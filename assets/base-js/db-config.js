// Creation du store d'objet de l'indexed BDD
const db = new Dexie("SprintiaDB")

// Creation de la structure
db.version(11).stores({ // ++ pour autoincrement
    entrainement: "++id, sport, date, nom, duree, rpe, fc_moy, fc_max, distance, denivele, allure_moy, vitesse_moy, vitesse_max, cadence_moy, nb_pas, altitude_max, nb_coups, nb_sets, vitesse_smash, nb_points, nb_combats, nb_victoires, nb_defaites, nb_chutes, score, nb_services, nb_smash, nb_reps, nb_series, poids_total, coups_rame, nb_longueurs, longueur_bassin, nb_tours, serie_max, nb_descentes, voies_effectuees, difficulte_max, muscles_travailles, charge_entrainement, note, transpiration_estimee, hydratation_estimee, nb_positions, points_gps",
    niveau_course: "++id, niveau_course_user, distance, date",
    JRM_Coach: "id, nom, style, avatar",
    profil: "id, sexe, age, taille, poids, fc_repos",
    recuperation: "++id, date, fc_repos"
})

async function majLocalStorage(versionDbStockee) {
    // migration de v5.2 à 26.09
    if (versionDbStockee == "5.2") {
        let coefRpe = {1:0.2, 2:0.4, 3:0.7, 4:1.1, 5:1.6, 6:2.3, 7:3.2, 8:4.5, 9:6.2, 10:8.5}
        
        // parcours de tous les entraînements et calcul de la nouvelle charge d'entrainement car on passe de la méthode rpe*charge à la méthode sRPE grâce à des coefs
        const workoutUser = await db.entrainement.toArray()
        for (const workout of workoutUser) {
            let chargeEntrainementWorkout = Math.floor(workout.duree*coefRpe[workout.rpe])
            await db.entrainement.update(workout.id, {charge_entrainement: chargeEntrainementWorkout})
        }

        localStorage.setItem("versionDB", "26.09") // maj de la version
    }
}

const versioDbActuelle = "26.09"
let versionDbStockee = localStorage.getItem("versionDB") || "5.2"
if (versionDbStockee != versioDbActuelle) {
    majLocalStorage(versionDbStockee)
}

// Gérer erreur d'ouverture de bdd
db.open().catch(function() {
    alert("Une erreur de base de données s'est produite !")
})