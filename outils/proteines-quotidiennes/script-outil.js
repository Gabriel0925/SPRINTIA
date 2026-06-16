function calculProteines(poidsUser, objectifUser) {
    // Initialisation pour le coef en fonction de l'objectif du user
    const dicoCoef = {"meilleure":1, "maintien":1.7, "minimum":0.8, "perte-poids":2, "prise":2}
    return Math.floor(poidsUser*dicoCoef[objectifUser]) // calcul
}

function estimationProteines() {
    // Recupération des datas des champs
    let objectifUser = document.getElementById("objectif-user").value
    let poidsUser = parseFloat(document.getElementById("poids-user").value)

    // Gestion des erreurs
    if (poidsUser <= 0) {
        errorInput("Poids positif requis !")
        // remise à zéro
        document.querySelector(".large-zone-result-result").textContent = "-- g/jour"
        return
    } else if (poidsUser >= 1000) {
        errorInput("Poids inférieur à 1000 requis !")
        // remise à zéro
        document.querySelector(".large-zone-result-result").textContent = "-- g/jour"
        return
    } else if (isNaN(poidsUser)) {
        // remise à zéro
        document.querySelector(".large-zone-result-result").textContent = "-- g/jour"
        return
    }
    else {
        document.getElementById("zone-error").classList.remove("visible")
    }

    // Calcul
    let proteinesBesoinUser = calculProteines(poidsUser, objectifUser)
    
    // affichage du résultat
    document.querySelector(".large-zone-result-result").textContent = proteinesBesoinUser + " g/jour"

    return
}