function estimationTempsRecuperation() {
    // Recup valeur des champs
    let dureeUser = document.getElementById("duree-entrainement-user").value.trim()
    let valueRpeUser = parseInt(document.querySelector(".slider progress").value)
    let profilUser = document.getElementById("methode-user").value

    // conversion de la durée en minutes
    dureeUser = conversionMinutes(dureeUser)
    if (dureeUser == null) {return}

    // Calcul intensité (utilisation de pow pr que les RPE haut soit plus amplifiées que les petits rpe)
    valueRpeUser = Math.pow(valueRpeUser, 1.5) // ex : RPE=3 alors 3**1.5

    // Vérification des champs 
    if (isNaN(dureeUser)) {
        alert("Erreur de saisie : le champ 'Durée de l'entraînement' doit être rempli.");
        return
    }
    if (dureeUser <= 0) {
        alert("Valeur non valide, la durée votre entraî. doivent être un nombre supérieur à 0.")
        return
    }

    // init d'un dico pour trouver le coef
    const dicoCoef = {"occasionnel":1.35, "regulier":0.95, "athlete":0.65}
    let coefProfil = dicoCoef[profilUser]

    // Calcul
    let charge = dureeUser*valueRpeUser
    let tempsRecup = (charge*coefProfil)/15

    // controle des valeurs pour avoir une estimation plus propre
    if (tempsRecup > 120) tempsRecup = 120

    document.querySelector(".large-zone-result-result").textContent = Math.round(tempsRecup) + " h"
}

function comboBox() {
    // Recup valeur des champs
    let dureeUser = parseInt(document.getElementById("duree-entrainement-user").value.trim())
    let valueRpeUser = parseInt(document.querySelector(".slider progress").value)

    if (!isNaN(dureeUser) || !isNaN(valueRpeUser)) {estimationTempsRecuperation()} // si les champs sont remplit on lance direct les analyses
}