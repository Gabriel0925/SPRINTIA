function CalculHydratationTotale(PoidsUser) {
    // Fourchette pour un adulte sédentaire
    let ReferenceMin = 30 // 30 mL d'eau par kilo de poids de corps
    let ReferenceMax = 35

    // Application formule
    let HydratationMin = (PoidsUser*ReferenceMin)*0.8 // fois 0.8 car "Environ 20 % d'eau provient de vos repas"
    let HydratationMax = (PoidsUser*ReferenceMax)*0.8
    let HydratationRecommandee = (HydratationMin+HydratationMax)/2 // moyenne de la fourchette minimum, maximum
    return HydratationRecommandee
}

function affichageResult(poidsUser) {
    // Affichage du result
    document.getElementById("hydratation-day").textContent = Math.round(CalculHydratationTotale(poidsUser)) + " mL"
    // Maj de l'interpretation
    document.querySelector(".zone-result-interpretation").textContent = "Petit conseil : ne buvez pas tout d'un coup, essayer de boire un verre toutes les 1 à 2 heures."
}

function majEnDirect(poidsUser) {
    let itsOkkay = true
    if (poidsUser == undefined) {itsOkkay = false}

    if (poidsUser <= 0) {
        errorInput("Poids positif requis !")
        itsOkkay = false
    } else if (poidsUser >= 1000) {
        errorInput("Poids inférieur à 1000 requis !")
        itsOkkay = false
    } else {
        document.querySelector(".indication").classList.remove("visible")
    }
    
    if (itsOkkay == true) {
        affichageResult(poidsUser)
    } else {
        document.getElementById("hydratation-day").textContent = "-- mL"
        document.querySelector(".zone-result-interpretation").textContent = "Veuillez rentrer votre poids pour avoir une interprétation."
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const inputPoids = document.getElementById("poids-user")
    if (inputPoids) {inputPoids.addEventListener("input", () => {majEnDirect(parseInt(inputPoids.value.trim().replace(",", ".")) ||undefined)})}

    await remplissageChamps(["poids-user"])

    if (document.getElementById("poids-user").value && !isNaN(document.getElementById("poids-user").value)) {
        document.getElementById("button-estimer").click()
    }

    // pour détecter si lorsqu'on est dans le formulaire il y a un appuie sur la touche entrée
    let formKeyEntry = document.querySelector(".form")
    formKeyEntry.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            majEnDirect()
        }
    })
})