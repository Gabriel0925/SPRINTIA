function zonePuissance() {
    //recup value champs
    let rFTPwUser = parseFloat(document.getElementById("rFTPw-user").value)

    // Vérification
    if (isNaN(rFTPwUser)) {
        alert("Veuillez remplir le champ rFTPw.")
        return
    }
    if (rFTPwUser <= 0) {
        alert("Votre rFTPw doit être supérieur un nombre positif supérieur à 0.")
        return
    }

    // recupération de toutes les box de résultats
    const baliseTranche = document.querySelectorAll(".small-zone-result-result")

    // init des variables pr la boucle
    const tableauCoef = [0.8, 0.88, 0.95, 1.05, 1.15, 1.28, 1.28] // coef pr la boucle (même coef pour les 2 derniers elt car par ex : zone 6 = 346-384W/zone 7 = > 348W)
    let memoireLastLap = 0 // pour garder en mémoire le resultat du tour d'avant de la boucle for
    let compteur = 0 // pour chercher dans le tableau de balise tranche et mettre le resultat au bon endroit

    for (const elt of tableauCoef) { // parcour du tableau
        if (compteur == tableauCoef.length-1) { // pr le dernier on affiche diféremment
            const resultClean = "> " + memoireLastLap // mise en forme différente
            baliseTranche[compteur].textContent = resultClean // affichage
            break // on arrete la boucle car c'était le dernier coef
        }

        const resultFinZone = Math.round(rFTPwUser*elt) // calcul de la fin de la zone concernée grâce au tableau
        const resultClean = (memoireLastLap+1) + " - " + resultFinZone // préparation d'un résultat clean pour l'afficher par la suite
        baliseTranche[compteur].textContent = resultClean // affichage 

        memoireLastLap = resultFinZone // mise en mémoire de ce tour pour le tour suivant
        compteur+=1 // incrémentation
    }

    return
}