function estimationVMA() {
    // Recup datas des champs
    let testUsers = document.getElementById("test-user").value
    let distanceUser = parseFloat(document.getElementById("distance-user").value.replace(",", ".").trim())
    let dureeUser = document.getElementById("duree-user").value.trim()

    dureeUser = conversionMinutes(dureeUser) // la fonction renvoie null si problème
    if (dureeUser == null) {return} // donc si la fonction renvoie null alors on arrete la fonction

    // Vérifications des champs
    if (isNaN(distanceUser) || isNaN(dureeUser)) {
        alert("Erreur de saisie : tous les champs doivent être remplis.")
        return
    }
    if (distanceUser <= 0 || dureeUser <= 0) {
        alert("Valeur non valide, la distance et la durée doivent être supérieur à 0.")
        return
    }
    if (distanceUser >= 20) {
        alert("L'estimation VMA ne peut pas prédire une VMA avec une distance supérieur à 20 km.'")
        return
    }

    // Initialisation
    let distanceM = 0
    let vmaEstimee = 0
    let vitesseMoyenne = 0

    const palierCoefLibre = [
        {"distanceMax":3.5, "coefficient":0.95},
        {"distanceMax":6, "coefficient":0.92},
        {"distanceMax":12, "coefficient":0.89},
        {"distanceMax":20, "coefficient":0.82}
    ]

    // Calcul en fonction du test choisis
    if (testUsers === "demi-cooper") {
        distanceM = distanceUser*1000
        vmaEstimee = distanceM/100
    } else if (testUsers === "cooper") {
        distanceM = distanceUser*1000
        vmaEstimee = distanceM/200
    } else if (testUsers === "luc-leger") {
        vmaEstimee = distanceUser/(dureeUser/60)
    } else {
        vitesseMoyenne = distanceUser/(dureeUser/60) // Vitesse moyenne en km/h

        for (const palier of palierCoefLibre) { // of pour chaque element de la liste
            if (distanceUser <= palier["distanceMax"]) { // si la distance entrée par le user est inférieure au palier on calcule la vmaEstimee
                vmaEstimee = vitesseMoyenne/palier["coefficient"]
                break
            }
        }
    }

    // Prépa des données + affichage
    vmaEstimee = vmaEstimee.toFixed(1).replace(".", ",") + " km/h"
    document.querySelector(".large-zone-result-result").textContent = vmaEstimee

    return
}

function remplirChamps(value) {
    // recup des inputs pour pouvoir changer leurs valeurs par la suite
    let inputDistance = document.getElementById("distance-user")
    let inputDuree = document.getElementById("duree-user")

    const dicoValueInput = { // dico contenant ce qu'il faut mettre dans les input en fonction du test choisi par l'utilisateur
        "demi-cooper": {
            // true pr bloquer l'écriture et false pour autoriser à écrire dans le input
            "inputDistance":{"valeur":"", "ecriture":false},
            "inputDuree":{"valeur":"0:6:0", "ecriture":true}
        },
        "cooper": {
            "inputDistance":{"valeur":"", "ecriture":false},
            "inputDuree":{"valeur":"0:12:0", "ecriture":true }
        },
        "luc-leger": {
            "inputDistance":{"valeur":"2", "ecriture":true},  
            "inputDuree":{"valeur":"", "ecriture":false}
        },
        "libre": {
            "inputDistance":{"valeur":"", "ecriture":false},
            "inputDuree":{"valeur":"", "ecriture":false}
        }
    }

    // maj du contenu des input en fonction du test choisi
    inputDistance.value = dicoValueInput[value]["inputDistance"]["valeur"]
    inputDistance.readOnly = dicoValueInput[value]["inputDistance"]["ecriture"]
    inputDuree.value = dicoValueInput[value]["inputDuree"]["valeur"]
    inputDuree.readOnly = dicoValueInput[value]["inputDuree"]["ecriture"]

    // pour remettre à 0 le résultat
    document.querySelector(".large-zone-result-result").textContent = "0 km/h"

    return
}

// Initialisation des inputs
window.addEventListener("DOMContentLoaded", () => {
    remplirChamps(document.getElementById("test-user").value) // recup de la valeur par défaut lors du chargement de la page et lancement de la fonction
})
