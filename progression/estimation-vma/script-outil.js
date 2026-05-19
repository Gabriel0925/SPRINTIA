function EstimationVMA() {
    // Recup datas des champs
    let TestUsers = document.getElementById("test-user").value
    let DistanceUser = parseFloat(document.getElementById("distance-user").value.replace(",", ".").trim())
    let DureeUser = document.getElementById("duree-user").value.trim()

    DureeUser = conversionMinutes(DureeUser)
    if (DureeUser == null) {
        return
    }

    // Vérifications des champs
    if (isNaN(DistanceUser) || isNaN(DureeUser)) {
        alert("Erreur de saisie : tous les champs doivent être remplis.")
        return
    }
    if (DistanceUser <= 0 || DureeUser <= 0) {
        alert("Valeur non valide, la distance et la durée doivent être supérieur à 0.")
        return
    }
    if (DistanceUser >= 30) {
        alert("L'estimation VMA ne peut pas prédire une VMA avec une distance supérieur à 30 km.'")
        return
    }

    // Initialisation
    let Coefficient = [0.95, 0.92, 0.89, 0.82, 0.77]
    let DistanceM = 0
    let VmaEstimee = 0
    let VitesseMoyenne = 0

    // Calcul en fonction du test choisis
    if (TestUsers === "demi-cooper") {
        DistanceM = DistanceUser*1000
        VmaEstimee = DistanceM/100
    } else if (TestUsers === "cooper") {
        DistanceM = DistanceUser*1000
        VmaEstimee = DistanceM/200
    } else if (TestUsers === "luc-leger") {
        VmaEstimee = DistanceUser/(DureeUser/60)
    } else {
        VitesseMoyenne = DistanceUser/(DureeUser/60) // Vitesse moyenne en km/h
        if (DistanceUser <= 3.5) {
            Coefficient = Coefficient[0]
        } else if (DistanceUser <= 6) {
            Coefficient = Coefficient[1]
        } else if (DistanceUser <= 12) {
            Coefficient = Coefficient[2]
        } else if (DistanceUser <= 22) {
            Coefficient = Coefficient[3]
        } else {
            Coefficient = Coefficient[4]
        }
        VmaEstimee = VitesseMoyenne/Coefficient
    }

    // Arrondi
    VmaEstimee = VmaEstimee.toFixed(1).replace(".", ",") + " km/h"

    document.querySelector(".large-zone-result-result").textContent = VmaEstimee
    return
}

function remplirChamps(value) {
    // recup des inputs pour pouvoir changer leurs valeurs par la suite
    let inputDistance = document.getElementById("distance-user")
    let inputDuree = document.getElementById("duree-user")

    // recup de la zone de résultat
    let zoneResult = document.querySelector(".large-zone-result-result")
    const dicoValueInput = { // dico contenant ce qu'il faut mettre dans les input en fonction du test choisi par l'utilisateur
        "demi-cooper": {
            "inputDistance":["", false], // false pour dire que le input ne peut pas que etre lu on peut écrire dans le input
            "inputDuree":["0:6:0", true], // true pour qu'on puisse uniquement lire le contenu du input et pas le modifier
        },
        "cooper": {
            "inputDistance":["", false],
            "inputDuree":["0:12:0", true],
        },
        "luc-leger": {
            "inputDistance":["2", true],
            "inputDuree":["", false],
        },
        "libre": {
            "inputDistance":["", false],
            "inputDuree":["", false],
        }
    }

    // maj du contenu des input en fonction du test choisi
    inputDistance.value = dicoValueInput[value]["inputDistance"][0]
    inputDistance.readOnly = dicoValueInput[value]["inputDistance"][1]
    inputDuree.value = dicoValueInput[value]["inputDuree"][0]
    inputDuree.readOnly = dicoValueInput[value]["inputDuree"][1]

    return
}

// Initialisation des inputs
window.addEventListener("DOMContentLoaded", () => {
    remplirChamps(document.getElementById("test-user").value) // recup de la valeur par défaut lors du chargement de la page et lancement de la fonction
})
