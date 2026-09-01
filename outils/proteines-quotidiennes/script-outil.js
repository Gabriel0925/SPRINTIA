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

document.addEventListener("DOMContentLoaded", async () => {
    const selectObjectif = document.getElementById("objectif-user")
    if (selectObjectif) {selectObjectif.addEventListener("change", estimationProteines)}
    
    const inputPoids = document.getElementById("poids-user")
    if (inputPoids) {inputPoids.addEventListener("input", estimationProteines)}

    await remplissageChamps(["poids-user"])

    if (document.getElementById("poids-user").value && !isNaN(document.getElementById("poids-user").value)) {
        estimationProteines()
    }

    // pour détecter si lorsqu'on est dans le formulaire il y a un appuie sur la touche entrée
    let formKeyEntry = document.querySelector(".form")
    formKeyEntry.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            estimationProteines()
        }
    })
})