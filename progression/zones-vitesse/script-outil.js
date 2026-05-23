function conversionAllure(zone){    
    // extraction des minutes, secondes
    let minutes = Math.floor(zone)
    let secondes = Math.round((zone-minutes)*60)
    if (secondes === 60) {secondes = 0; minutes += 1}

    return [minutes, secondes]
}
function majComponentAndUnit(unit, textInButton, functionInButton) {
    // Maj de l'unité au cas ou le user aura fais conversion puis re-valider
    const unitTranche = document.querySelectorAll(".small-zone-result-unit")
    for (const elt of unitTranche) {
        elt.textContent = unit
    }
    
    // Changement de onclick et de contenu du bouton de conversion
    let buttonConversion = document.getElementById("conversion")
    buttonConversion.textContent = textInButton
    buttonConversion.onclick = functionInButton
}


function zoneVitesse() {
    // Récupérer la valeur des champs
    let vmaUser = parseFloat(document.getElementById("vma-user").value)
    let vitesseMaxUser = parseFloat(document.getElementById("vitesse-max-user").value)

    // Vérification des champs
    if (isNaN(vmaUser)) {
        alert("Erreur de saisie : le champ 'vma' doit être rempli.");
        return
    }
    if (vmaUser <= 0 || vmaUser >= 50) {
        alert("Valeur non valide, la VMA doit être compris entre 0 et 50.");
        return
    }

    // calcul de la vitesse max
    let vitesseMax = 0
    if (!isNaN(vitesseMaxUser) && vitesseMaxUser > 0) {vitesseMax = vitesseMaxUser}
    else {vitesseMax = Math.round(vmaUser*1.30)}

    // recupération de toutes les box de résultats
    const baliseTranche = document.querySelectorAll(".small-zone-result-result")

    // init des variables pr la boucle
    const tableauCoef = [0.65, 0.75, 0.85, 0.95, 0.95] // coef pr la boucle (même coef pour les 2 derniers elt car par ex : zone 6 = 346-384W/zone 7 = > 348W)
    let memoireLastLap = 0 // pour garder en mémoire le resultat du tour d'avant de la boucle for
    let compteur = 0 // pour chercher dans le tableau de balise tranche et mettre le resultat au bon endroit

    for (const elt of tableauCoef) { // parcour du tableau
        if (compteur == tableauCoef.length-1) { // pr le dernier on affiche diféremment

            if (!isNaN(vitesseMaxUser) && vitesseMaxUser > 0) {                
                const resultClean = memoireLastLap.toFixed(1).replace(".", ",")  + " - " + vitesseMax.toFixed(1).replace(".", ",")
                baliseTranche[compteur].textContent = resultClean // affichage

            } else {                
                const resultClean = "> " + memoireLastLap.toFixed(1).replace(".", ",") // mise en forme différente
                baliseTranche[compteur].textContent = resultClean // affichage
            }

            break // on arrete la boucle car c'était le dernier coef
        }

        const resultFinZone = vmaUser*elt // calcul de la fin de la zone concernée grâce au tableau
        const resultClean = (memoireLastLap+0.1).toFixed(1).replace(".", ",") + " - " + resultFinZone.toFixed(1).replace(".", ",") // préparation d'un résultat clean pour l'afficher par la suite
        baliseTranche[compteur].textContent = resultClean // affichage 

        memoireLastLap = resultFinZone // mise en mémoire de ce tour pour le tour suivant
        compteur+=1 // incrémentation
    }

    majComponentAndUnit("km/h", "Convertir en allure", zoneAllure)
}

function zoneAllure() {
    // Récupérer la valeur des champs
    let vmaUser = parseFloat(document.getElementById("vma-user").value)
    let vitesseMaxUser = parseFloat(document.getElementById("vitesse-max-user").value)

    // Vérification des champs
    if (isNaN(vmaUser)) {
        alert("Erreur de saisie : le champ 'vma' doit être rempli.");
        return
    }
    if (vmaUser <= 0 || vmaUser >= 50) {
        alert("Valeur non valide, la VMA doit être compris entre 0 et 50.");
        return
    }

    // calcul de la vitesse max
    let vitesseMax = 0
    if (!isNaN(vitesseMaxUser) && vitesseMaxUser > 0) {vitesseMax = vitesseMaxUser}
    else {vitesseMax = Math.round(vmaUser*1.30)}

    // recupération de toutes les box de résultats
    const baliseTranche = document.querySelectorAll(".small-zone-result-result")

    // init des variables pr la boucle
    const tableauCoef = [0.65, 0.75, 0.85, 0.95, 0.95] // coef pr la boucle (même coef pour les 2 derniers elt car par ex : zone 6 = 346-384W/zone 7 = > 348W)
    let memoireLastLap = 0 // pour garder en mémoire le resultat du tour d'avant de la boucle for
    let memoire2LastLap = 0
    let compteur = 0 // pour chercher dans le tableau de balise tranche et mettre le resultat au bon endroit

    for (const elt of tableauCoef) { // parcour du tableau
        if (compteur == tableauCoef.length-1) { // pr le dernier on affiche diféremment
            const resultFinZone = 60/(vmaUser*elt) // calcul de la fin de la zone concernée grâce au tableau
            let minutesSecondesZone = conversionAllure(resultFinZone)
            // Recup des datas qui sont dans une liste
            let minutesZone = minutesSecondesZone[0]
            let secondesZone = minutesSecondesZone[1]

            if (!isNaN(vitesseMaxUser) && vitesseMaxUser > 0) {                
                const resultClean = memoireLastLap + ":" + memoire2LastLap.toString().padStart(2, "0") + " - " + minutesZone + ":" + secondesZone.toString().padStart(2, "0")
                baliseTranche[compteur].textContent = resultClean // affichage

            } else {                
                const resultClean = "> " + memoireLastLap + ":" + memoire2LastLap.toString().padStart(2, "0") // mise en forme différente
                baliseTranche[compteur].textContent = resultClean // affichage
            }

            break // on arrete la boucle car c'était le dernier coef
        }

        const resultFinZone = 60/(vmaUser*elt) // calcul de la fin de la zone concernée grâce au tableau
        let minutesSecondesZone = conversionAllure(resultFinZone)
        // Recup des datas qui sont dans une liste
        let minutesZone = minutesSecondesZone[0]
        let secondesZone = minutesSecondesZone[1]

        // préparation d'un résultat clean pour l'afficher par la suite
        const resultClean = memoireLastLap + ":" + memoire2LastLap.toString().padStart(2, "0") + " - " + minutesZone + ":" + secondesZone.toString().padStart(2, "0")
        baliseTranche[compteur].textContent = resultClean // affichage 

        memoireLastLap = minutesZone // mise en mémoire de ce tour pour le tour suivant
        memoire2LastLap = secondesZone // mise en mémoire 2 de ce tour pour le tour suivant
        compteur+=1 // incrémentation
    }

    majComponentAndUnit("/km", "Convertir en vitesse", zoneVitesse)
}
