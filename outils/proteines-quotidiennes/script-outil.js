function estimationProteines() {
    // Recupération des datas des champs
    let objectifUser = document.getElementById("objectif-user").value
    let poidsUser = parseFloat(document.getElementById("poids-user").value)

    // Vérification des champs
    if (isNaN(poidsUser)) {
        alert("Erreur de saisie : le champ nommé 'Poids' doit être rempli.")
        return
    }
    if (poidsUser <= 0 || poidsUser >= 1000) {
        alert("Valeur non valide, le poids doit être un nombre compris entre 1 et 999.")
        return
    }

    // Initialisation pour le coef en fonction de l'objectif du user
    const dicoCoef = {
        "meilleure":1,
        "maintien":1.7,
        "minimum":0.8,
        "perte-poids":2,
        "prise":2
    }

    // Calcul et affichage en même temps
    document.querySelector(".large-zone-result-result").textContent = Math.floor(poidsUser*dicoCoef[objectifUser]) + " g/jour"

    return
}

function comboBox() {
    let poidsUser = document.getElementById("poids-user").value

    if (!isNaN(poidsUser)) {estimationProteines()}
    return
}