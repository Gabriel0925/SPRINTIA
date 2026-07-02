// Creation du store d'objet de l'indexed BDD
const db = new Dexie("SprintiaDB")

// Creation de la structure
db.version(10).stores({ // ++ pour autoincrement
    entrainement: "++id, sport, date, nom, duree, rpe, fc_moy, fc_max, distance, denivele, allure_moy, vitesse_moy, vitesse_max, cadence_moy, nb_pas, altitude_max, nb_coups, nb_sets, vitesse_smash, nb_points, nb_combats, nb_victoires, nb_defaites, nb_chutes, score, nb_services, nb_smash, nb_reps, nb_series, poids_total, coups_rame, nb_longueurs, longueur_bassin, nb_tours, serie_max, nb_descentes, voies_effectuees, difficulte_max, muscles_travailles, charge_entrainement, note, transpiration_estimee, hydratation_estimee, nb_positions",
    niveau_course: "++id, niveau_course_user, distance, date",
    JRM_Coach: "id, nom, style, avatar",
    profil: "id, sexe, age, taille, poids, fc_repos",
    recuperation: "++id, date, fc_repos"
})

// Gérer erreur d'ouverture de bdd
db.open().catch(function() {
    alert("Une erreur de base de données s'est produite !")
})