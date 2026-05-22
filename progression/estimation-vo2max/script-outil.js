function interpretationVO2max(ResultVO2max, GenreUser, AgeUser){
    let Interpretation = [
        "<strong>Zone supérieure :</strong><br>Votre VO₂max est supérieur à la moyenne pour votre tranche d'âge, ce qui indique une excellente capacité cardiovasculaire.",
        "<strong>Zone excellente :</strong><br>Vous avez une VO₂max excellente pour votre âge, signe d'un très bon niveau de forme physique.",
        "<strong>Zone bonne :</strong><br>Votre VO₂max est bonne pour votre âge, témoignant d'une condition physique solide.",
        "<strong>Zone moyenne :</strong><br>Votre VO₂max se situe dans la moyenne pour votre tranche d'âge. Il y a de la marge pour progresser.",
        "<strong>Zone faible :</strong><br>Votre VO₂max est faible pour votre âge. Essayez d'être moins sédentaire au quotidien."
    ]
    const palierInterpretationHomme = [
        {"vo2maxMax":60}
    ]

    if (GenreUser == "Homme") {
        if (AgeUser <= 19){
            if (ResultVO2max > 60){
                Interpretation = Interpretation[0]
            } else if (ResultVO2max >= 56) {
                Interpretation = Interpretation[1]
            } else if (ResultVO2max >= 51) {
                Interpretation = Interpretation[2]
            } else if (ResultVO2max >= 46) {
                Interpretation = Interpretation[3]
            } else {
                Interpretation = Interpretation[4]
            }
        } else if (AgeUser <= 29) {
            if (ResultVO2max > 56){
                Interpretation = Interpretation[0]
            } else if (ResultVO2max >= 52) {
                Interpretation = Interpretation[1]
            } else if (ResultVO2max >= 47) {
                Interpretation = Interpretation[2]
            } else if (ResultVO2max >= 42) {
                Interpretation = Interpretation[3]
            } else {
                Interpretation = Interpretation[4]
            }
        } else if (AgeUser <= 39) {
            if (ResultVO2max > 54){
                Interpretation = Interpretation[0]
            } else if (ResultVO2max >= 49) {
                Interpretation = Interpretation[1]
            } else if (ResultVO2max >= 44) {
                Interpretation = Interpretation[2]
            } else if (ResultVO2max >= 39) {
                Interpretation = Interpretation[3]
            } else {
                Interpretation = Interpretation[4]
            }
        } else if (AgeUser <= 49) {
            if (ResultVO2max > 51){
                Interpretation = Interpretation[0]
            } else if (ResultVO2max >= 46) {
                Interpretation = Interpretation[1]
            } else if (ResultVO2max >= 41) {
                Interpretation = Interpretation[2]
            } else if (ResultVO2max >= 36) {
                Interpretation = Interpretation[3]
            } else {
                Interpretation = Interpretation[4]
            }
        } else {
            if (ResultVO2max > 48){
                Interpretation = Interpretation[0]
            } else if (ResultVO2max >= 43) {
                Interpretation = Interpretation[1]
            } else if (ResultVO2max >= 38) {
                Interpretation = Interpretation[2]
            } else if (ResultVO2max >= 33) {
                Interpretation = Interpretation[3]
            } else {
                Interpretation = Interpretation[4]
            }
        }
    } else {
        if (AgeUser <= 19){
            if (ResultVO2max > 55){
                Interpretation = Interpretation[0]
            } else if (ResultVO2max >= 50) {
                Interpretation = Interpretation[1]
            } else if (ResultVO2max >= 45) {
                Interpretation = Interpretation[2]
            } else if (ResultVO2max >= 40) {
                Interpretation = Interpretation[3]
            } else {
                Interpretation = Interpretation[4]
            }
        } else if (AgeUser <= 29) {
            if (ResultVO2max > 50){
                Interpretation = Interpretation[0]
            } else if (ResultVO2max >= 46) {
                Interpretation = Interpretation[1]
            } else if (ResultVO2max >= 42) {
                Interpretation = Interpretation[2]
            } else if (ResultVO2max >= 38) {
                Interpretation = Interpretation[3]
            } else {
                Interpretation = Interpretation[4]
            }
        } else if (AgeUser <= 39) {
            if (ResultVO2max > 48){
                Interpretation = Interpretation[0]
            } else if (ResultVO2max >= 44) {
                Interpretation = Interpretation[1]
            } else if (ResultVO2max >= 40) {
                Interpretation = Interpretation[2]
            } else if (ResultVO2max >= 35) {
                Interpretation = Interpretation[3]
            } else {
                Interpretation = Interpretation[4]
            }
        } else if (AgeUser <= 49) {
            if (ResultVO2max > 45){
                Interpretation = Interpretation[0]
            } else if (ResultVO2max >= 41) {
                Interpretation = Interpretation[1]
            } else if (ResultVO2max >= 37) {
                Interpretation = Interpretation[2]
            } else if (ResultVO2max >= 32) {
                Interpretation = Interpretation[3]
            } else {
                Interpretation = Interpretation[4]
            }
        } else {
            if (ResultVO2max > 42){
                Interpretation = Interpretation[0]
            } else if (ResultVO2max >= 38) {
                Interpretation = Interpretation[1]
            } else if (ResultVO2max >= 34) {
                Interpretation = Interpretation[2]
            } else if (ResultVO2max >= 30) {
                Interpretation = Interpretation[3]
            } else {
                Interpretation = Interpretation[4]
            }
        }
    }

    return Interpretation
}
function calculVO2max() {
    // recup la valeur des champs
    let sexeUser = document.getElementById("sexe-user").value;
    let ageUser = parseInt(document.getElementById("age-user").value)
    let vmaUser = parseFloat(document.getElementById("vma-user").value)

    // Vérification des champs
    if (isNaN(ageUser) || isNaN(vmaUser)) {
        alert("Erreur de saisie : tous les champs doivent être remplis.")
        return
    }
    if (ageUser < 13 || ageUser > 120) {
        alert("Valeur non valide, la valeur de l'âge doit être compris entre 13 et 120 ans.")
        return
    }
    if (vmaUser <= 0) {
        alert("Valeur non valide, la vma doit être supérieur à 0.")
        return
    }
    if (vmaUser >= 50) {
        alert("Valeur non valide, la vma doit être inférieur à 50.")
        return
    }

    // Calcul
    let resultVO2max = vmaUser*3.5
    let vo2maxEstimee = "VO₂max estimé : " + "<strong>" + resultVO2max.toFixed(1).replace(".", ",") + "</strong>"

    // Affichage
    document.querySelector(".zone-result-name-result").innerHTML = vo2maxEstimee

    let zoneInterpretationVO2max = interpretationVO2max(resultVO2max, sexeUser, ageUser)
    document.querySelector(".zone-result-interpretation").innerHTML = zoneInterpretationVO2max
    return
}

function comboBox() {
    let ageUser = parseInt(document.getElementById("age-user").value)
    let vmaUser = parseFloat(document.getElementById("vma-user").value)

    if (!isNaN(ageUser) || !isNaN(vmaUser)) {calculVO2max()}
}