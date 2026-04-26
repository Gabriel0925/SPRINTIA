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

function CalculGeneral() {
    let PoidsUser = parseFloat(document.getElementById("poids-user").value.trim().replace(",", "."))

    // Vérification des champs
    if (isNaN(PoidsUser)) {
        alert("Erreur de saisie : tous les champs doivent être remplis.");
        return
    }
    if (PoidsUser <= 0) {
        alert("Valeur non valide, le poids doit être un nombre supérieur à 0.")
        return
    }
    if (PoidsUser >= 1000) {
        alert("Valeur non valide, le poids doit être un nombre inférieur à 1000.")
        return
    }

    // Mise en variable pour passez à l'affichage
    let HydratationToday = "Hydratation du jour : " + "<strong>" + Math.round(CalculHydratationTotale(PoidsUser)) + " mL" + "</strong>"
    let Interpretation = "<strong>Petit conseil :</strong> ne buvez pas tout d'un coup, essayer de boire un verre toutes les 1 à 2 heures."

    // Affichage du result
    document.querySelector(".zone-result-name-result").innerHTML = HydratationToday
    // Maj de l'interpretation
    document.querySelector(".zone-result-interpretation").innerHTML = Interpretation
    return
}