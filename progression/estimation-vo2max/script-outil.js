function interpretationVO2max(vo2maxUser, sexeUser, ageUser){
    let interpretation = [
        "<strong>Zone supérieure :</strong><br>Votre VO₂max est supérieur à la moyenne pour votre tranche d'âge, ce qui indique une excellente capacité cardiovasculaire.",
        "<strong>Zone excellente :</strong><br>Vous avez une VO₂max excellente pour votre âge, signe d'un très bon niveau de forme physique.",
        "<strong>Zone bonne :</strong><br>Votre VO₂max est bonne pour votre âge, témoignant d'une condition physique solide.",
        "<strong>Zone moyenne :</strong><br>Votre VO₂max se situe dans la moyenne pour votre tranche d'âge. Il y a de la marge pour progresser.",
        "<strong>Zone faible :</strong><br>Votre VO₂max est faible pour votre âge. Essayez d'être moins sédentaire au quotidien."
    ]
    // liste contenu les paliers ainsi que l'age de l'utilisateur, on s'en sert dans la boucle for par la suite
    const palierInterpretationHomme = [
        {"ageMax":19, "palier":[60, 56, 51, 46]},
        {"ageMax":29, "palier":[56, 52, 47, 42]},
        {"ageMax":39, "palier":[54, 49, 44, 39]},
        {"ageMax":49, "palier":[51, 46, 41, 36]},
        {"ageMax":Infinity, "palier":[51, 46, 41, 36]} // Inifinity est un number, c'est l'infini "OO"
    ]
    const palierInterpretationFemme = [
        {"ageMax":19, "palier":[55, 50, 45, 40]},
        {"ageMax":29, "palier":[50, 46, 42, 38]},
        {"ageMax":39, "palier":[48, 44, 40, 35]},
        {"ageMax":49, "palier":[45, 41, 37, 32]},
        {"ageMax":Infinity, "palier":[42, 38, 34, 30]} // Inifinity est un number, c'est l'infini "OO"
    ]

    let tableauCorrespondantSexeUser = palierInterpretationHomme // init sur la liste pour les hommes
    if (sexeUser == "Femme") { // si le user est une femme on change la liste car pas les même paliers entre les filles et les garçons.
        tableauCorrespondantSexeUser = palierInterpretationFemme
    }

    let interpretationForVO2MAX = "" // init pour attribuer une interpretation par la suite
    for (const palier of tableauCorrespondantSexeUser) {
        if (ageUser <= palier["ageMax"]) { // si l'age de l'utilisateur est inférieur à l'âge max du tour alors on cherche par la suite l'interpretation
            // en fonction de la valeur du vo2max on attribue une interpretation
            if (vo2maxUser > palier["palier"][0]){
                interpretationForVO2MAX = interpretation[0]
            } else if (vo2maxUser >= palier["palier"][1]) {
                interpretationForVO2MAX = interpretation[1]
            } else if (vo2maxUser >= palier["palier"][2]) {
                interpretationForVO2MAX = interpretation[2]
            } else if (vo2maxUser >= palier["palier"][3]) {
                interpretationForVO2MAX = interpretation[3]
            } else {
                interpretationForVO2MAX = interpretation[4]
            }
            break // si on a trouvé alors on stop la boucle
        }
    }

    return interpretationForVO2MAX
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
    let vo2maxUser = vmaUser*3.5
    let vo2maxEstimee = "VO₂max estimé : " + "<strong>" + vo2maxUser.toFixed(1).replace(".", ",") + "</strong>"

    // Affichage
    document.querySelector(".zone-result-name-result").innerHTML = vo2maxEstimee

    // lancement de la fonction pour trouver l'interpretation + affichage de l'interpretation
    let zoneInterpretationVO2max = interpretationVO2max(vo2maxUser, sexeUser, ageUser)
    document.querySelector(".zone-result-interpretation").innerHTML = zoneInterpretationVO2max
    return
}

function comboBox() {
    let ageUser = parseInt(document.getElementById("age-user").value)
    let vmaUser = parseFloat(document.getElementById("vma-user").value)

    // si il y a du contenu dans les champs on lance la fonction sinon on fait rien
    if (!isNaN(ageUser) && !isNaN(vmaUser)) {calculVO2max()}
}