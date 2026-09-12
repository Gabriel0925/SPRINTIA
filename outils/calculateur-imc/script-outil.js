function calculIMC() {
    // Récupérer la valeur du champ
    let poidsUser = parseFloat(document.getElementById("poids-user").value)
    let tailleUser = parseFloat(document.getElementById("taille-user").value)

    // Vérification des champs
    if (isNaN(poidsUser)|| isNaN(tailleUser)) {
        alert("Erreur de saisie : tous les champs doivent être remplis.")
        return
    }
    if (poidsUser <= 0 || tailleUser <= 0) {
        alert("Valeur non valide, le poids et la taille doivent être un nombre supérieur à 0.")
        return
    }
    if (poidsUser >= 1000) {
        alert("Valeur non valide, le poids doit être un nombre inférieur à 1000.")
        return
    }
    if (tailleUser >= 350) {
        alert("Valeur non valide, la taille doit être un nombre inférieur à 350.")
        return
    }

    // Calcul en appliquant la formule
    let imcResult = poidsUser/((tailleUser/100)**2) // conversion des cm en m pour la taille

    // détermination de l'interpretation
    const palierInterpretation = [
        {"imcMax":18.5, "title":"Zone maigreur : ", "interpretation":"D'après l'IMC vous êtes super actif·ve mais si vous vous sentez mal le mieux serait de consulter un médecin !"},
        {"imcMax":25, "title":"Zone de corpulence normale : ", "interpretation":"Parfait, d'après l'IMC vous êtes équilibré·e, continuez comme ça !"},
        {"imcMax":30, "title":"Zone de surpoids : ", "interpretation":"D'après l'IMC vous êtes en surpoids mais je suis sûr que vous avez juste trop de muscles et ça l'IMC ne peut pas le savoir !"},
        {"imcMax":35, "title":"Zone obésité modérée : ", "interpretation":"Un petit changement d'habitude aujourd'hui fera une grande différence demain ! Si vous vous sentez mal le mieux serait de consulter un médecin !"},
        {"imcMax":40, "title":"Zone d'obésité sévère : ", "interpretation":"Si vous vous sentez bien c'est le plus important, ne vous comparez pas aux autres comparez-vous à la personne que vous étiez hier !"},
        {"imcMax":Infinity, "title":"Zone d'obésité morbide : ", "interpretation":"Vous vous améliorez de jour en jour mais si vous vous sentez mal le mieux serait de consulter un médecin !"}
    ]

    // parcours du tableau de dico 
    for (const palier of palierInterpretation) {
        if (imcResult <= palier["imcMax"]) { // si l'imc est inf aux palier alors on affiche les résultats (resultat imc + interpretation)
            document.getElementById("imc-result").textContent = imcResult.toFixed(1).replace(".", ",")

            const zoneInterpretation = document.querySelector(".zone-result-interpretation")

            // on enleve le text de base et on met les resultats
            zoneInterpretation.textContent = ""
            
            let titreStrong = document.createElement("strong")
            titreStrong.textContent = palier["title"]
            zoneInterpretation.appendChild(titreStrong)

            let intrepretationElement = document.createElement("p")
            intrepretationElement.textContent = palier["interpretation"]
            zoneInterpretation.appendChild(intrepretationElement)
            break
        }
    }

    return
}

document.addEventListener("DOMContentLoaded", async () => {
    await remplissageChamps(["taille-user", "poids-user"])
    
    const buttonCalcul = document.getElementById("button-calcul-imc")
    if (buttonCalcul) {buttonCalcul.addEventListener("click", calculIMC)}

    if (document.getElementById("taille-user").value && document.getElementById("poids-user").value && !isNaN(document.getElementById("taille-user").value) && !isNaN(document.getElementById("poids-user").value)) {
        document.getElementById("button-calcul-imc").click()
    }

    // pour détecter si lorsqu'on est dans le formulaire il y a un appuie sur la touche entrée
    let formKeyEntry = document.querySelector(".form")
    formKeyEntry.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            calculIMC()
        }
    })
})
