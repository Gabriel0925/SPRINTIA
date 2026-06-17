// Creation du store d'objet de l'indexed BDD
const db = new Dexie("SprintiaDB")

// Creation de la structure
db.version(10).stores({ // ++ pour autoincrement
    // !!! si modification il faut adapté le code complet de la page sauvegarde et restauration
    entrainement: "++id, sport, date, nom, duree, rpe, fc_moy, fc_max, distance, denivele, allure_moy, vitesse_moy, vitesse_max, cadence_moy, nb_pas, altitude_max, nb_coups, nb_sets, vitesse_smash, nb_points, nb_combats, nb_victoires, nb_defaites, nb_chutes, score, nb_services, nb_smash, nb_reps, nb_series, poids_total, coups_rame, nb_longueurs, longueur_bassin, nb_tours, serie_max, nb_descentes, voies_effectuees, difficulte_max, muscles_travailles, charge_entrainement, note, transpiration_estimee, hydratation_estimee, nb_positions",
    niveau_course: "++id, niveau_course_user, distance, date",
    JRM_Coach: "id, nom, style",
    profil: "id, sexe, age, taille, poids, fc_repos",
    recuperation: "id++, date, fc_repos"
}).upgrade(async tx => {
    // ce code s'exécute uniquement si l'utilisateur a une version inf à 10
    await tx.table("JRM_Coach").toCollection().modify(coach => {
        delete coach.avatar; // supprime la colonne avatar dans la table jrm_coach
    });
})

// Gérer erreur d'ouverture de bdd
db.open().catch(function() {
    alert("Une erreur de base de données s'est produite.")
})