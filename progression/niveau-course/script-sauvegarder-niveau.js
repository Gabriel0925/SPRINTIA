async function saveNiveauCourse() {
    // Recup bouton, inputs et de la valeur du niveau
    let boutonLimite1Clic = document.getElementById("button-sauvegarde-niveau")
    let dateNiveauUser = document.getElementById("date-niveau-course").value
    let distanceUser = document.getElementById("distance-user").value
    let niveauCourseUser = parseFloat(document.querySelector(".large-zone-result-result").innerHTML.trim().replace(",", "."))

    // Recup de la date
    let dateActuelle = createObjetDate(0)

    // verification des inputs
    if (niveauCourseUser == "--") {
        alert("Avant de vouloir sauvegarder votre niveau de course veuillez remplir le champ distance.")
        return
    }
    if (dateNiveauUser > dateActuelle) {
        alert("La date ne peut pas être dans le futur !")
        return
    }
    if (distanceUser <= 0) {
        alert("Valeur non valide, la distance doit être supérieure à 0.")
        return
    }
    if (distanceUser >= 7) {
        alert("Valeur non valide, la distance doit être inférieure à 7.")
        return
    }
 
    boutonLimite1Clic.disabled = true // Pour empeche que le user clique 2 fois
    // signe d'enregistrement pr le user
    boutonLimite1Clic.textContent = "Sauvegarde..." 

    // Ajout datas
    await db.niveau_course.add({
        niveau_course_user: niveauCourseUser,
        distance: distanceUser,
        date: dateNiveauUser
    })

    setTimeout(() => {
        boutonLimite1Clic.textContent = "Sauvegardé" // transimission de l'info au user
    }, 650);
    setTimeout(() => {
        // remise etat normal
        boutonLimite1Clic.textContent = "Sauvegarder"
        boutonLimite1Clic.disabled = false // Réactivation du bouton
        window.location.href = "niveau-course-evolution.html?levelrunregister"
    }, 1300);
}

function liveResultViaInput() {
    // Recup datas
    let distanceUser = parseFloat(document.getElementById("distance-user").value.trim().replace(",", "."))
    let champsErreur = document.querySelector(".indication")

    // Vérification
    if (isNaN(distanceUser)) {
        // remise à zéro
        document.querySelector(".large-zone-result-result").textContent = "--"
        document.querySelector(".large-zone-result-name").textContent = "Niveau :"
        return
    }
    if (distanceUser <= 0) {
        errorInput("Distance positive requise !")
        // remise à zéro
        document.querySelector(".large-zone-result-result").textContent = "--"
        document.querySelector(".large-zone-result-name").textContent = "Niveau :"
        return
    } else if (distanceUser >= 7) {
        errorInput("Distance inférieure à 7 requise !")
        // remise à zéro
        document.querySelector(".large-zone-result-result").textContent = "--"
        document.querySelector(".large-zone-result-name").textContent = "Niveau :"
        return
    } else {
        champsErreur.classList.remove("visible")
    }

    // Calcul
    let levelRunUser = calculLevelRun(distanceUser)
    let zoneLevelRunUser = zoneLevel(levelRunUser)

    // Affichage
    document.querySelector(".large-zone-result-result").textContent = levelRunUser.toString().replace(".", ",")
    document.querySelector(".large-zone-result-name").textContent = "Niveau : " + zoneLevelRunUser
    return
}