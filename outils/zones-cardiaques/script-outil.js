function calculZone(methodeCalcul, baliseTranche, ageUser, fcMaxUser, fcMax, fcReposUser) {
    let fcReserve = 0 // init
    if (fcReposUser != undefined) {
        fcReserve = fcMax - fcReposUser // Calcul de la reserve de fc
    }

    // init des variables pr la boucle
    const tableauCoef = [0.6, 0.7, 0.8, 0.9, 0.9 ] // coef pr la boucle (même coef pour les 2 derniers elt car par ex : zone 5 = 190-200bpm/zone 7 = > 200bpm)
    let memoireLastLap = 0 // pour garder en mémoire le resultat du tour d'avant de la boucle for
    let compteur = 0 // pour chercher dans le tableau de balise tranche et mettre le resultat au bon endroit

    for (const elt of tableauCoef) { // parcour du tableau
        if (compteur == tableauCoef.length-1) { // pr le dernier on affiche diféremment en fonction de si le user a rentré sa fc max.

            if (!isNaN(fcMaxUser)) { // si le user a saisit une fc max on affiche pas de la meme maniere
                const resultClean = memoireLastLap + " - " + fcMax
                baliseTranche[compteur].textContent = resultClean // affichage

            } else { // dans tout les autres cas c'est le result par défaut
                const resultClean = "> " + memoireLastLap // mise en forme différente
                baliseTranche[compteur].textContent = resultClean // affichage
            }

            break // on arrete la boucle car c'était le dernier coef
        }

        let resultFinZone = 0
        if (methodeCalcul == "Max") {
            resultFinZone = Math.round(fcMax*elt) // calcul de la fin de la zone concernée grâce au tableau
        } else { // si c'est la réserve de fc
            resultFinZone = Math.round(fcReposUser+(fcReserve*elt)) // calcul de la fin de la zone concernée grâce au tableau
        }
        const resultClean = (memoireLastLap+1) + " - " + resultFinZone // préparation d'un résultat clean pour l'afficher par la suite
        baliseTranche[compteur].textContent = resultClean // affichage 

        memoireLastLap = resultFinZone // mise en mémoire de ce tour pour le tour suivant
        compteur+=1 // incrémentation
    }

}


function verificationInputBase() {
    // Récupérer la valeur des champs
    let methodeCalcul = document.getElementById("methode-user").value
    let ageUser = parseInt(document.getElementById("age-user").value)
    let fcMaxUser = parseInt(document.getElementById("fc-max-user").value)
    let fcReposUser = parseInt(document.getElementById("fc-repos-user").value) || undefined

    // Vérification des champs
    if (isNaN(ageUser)) {
        alert("Erreur de saisie : le champ 'âge' doit être rempli.");
        return
    }
    if (ageUser <= 0) {
        alert("Valeur non valide, l'âge doit être supérieur à 0.")
        return
    }
    if (ageUser >= 120) {
        alert("Valeur non valide, l'âge ne doit pas dépasser 120 ans.")
        return
    }
    if (!isNaN(fcReposUser) && fcReposUser <= 15) {
        alert("Valeur non valide, la FC repos doit être supérieur à 15 bpm.")
        return
    }
    if (!isNaN(fcReposUser) && fcReposUser >= 150) {
        alert("Valeur non valide, la FC repos doit être inférieur à 150 bpm.")
        return
    }
    
    // détermination de la FC max en la calculant de différente manière suivant ce que le user à remplit dans le form
    let fcMax = 0
    if (isNaN(fcMaxUser)) {
        // Formule de Tanaka
        fcMax = Math.round(208-0.7*ageUser)
    } else {
        if (fcMaxUser <= 50 || fcMaxUser >= 250) {
            alert("Valeur non valide, la FC max doit être comprise entre 50 et 250 bpm.")
            return
        }
        if (!isNaN(fcReposUser) && fcReposUser >= fcMaxUser) {
            alert("Valeur non valide, la FC repos ne peut pas être supérieur à la FC max.")
            return
        }
        fcMax = fcMaxUser
    }

    // recupération de toutes les box de résultats
    const baliseTranche = document.querySelectorAll(".small-zone-result-result")

    // envoie à la fonction
    calculZone(methodeCalcul, baliseTranche, ageUser, fcMaxUser, fcMax, fcReposUser)
}
function comboBox(methodeCalcul) { // pour gérer les inputs certains doivent disparaître d'autre doivent apparaitre
    const dico = { // toutes les valeurs genre display block,none sont dans ce dico
        "Max":{"inputFcMax":"block", "inputFcRepos":"none"},
        "Reserve":{"inputFcMax":"block", "inputFcRepos":"block"}
    }

    // on va chercher par la suite dans le dico et on affiche ou on cache les inputs en fonction de la méthode de calcul choisi
    document.getElementById("fc-max-user").style.display = dico[methodeCalcul]["inputFcMax"]
    document.getElementById("fc-repos-user").style.display = dico[methodeCalcul]["inputFcRepos"]
    document.getElementById("label-fc-user").style.display = dico[methodeCalcul]["inputFcRepos"]
}
