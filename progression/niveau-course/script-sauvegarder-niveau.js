let modificationData = false // variable pour savoir si on est en train de modifier une data ou pas
let idNiveauModif = undefined

async function saveNiveauCourse() {
    // Recup bouton, inputs et de la valeur du niveau
    let boutonLimite1Clic = document.getElementById("button-sauvegarde-niveau")
    let dateNiveauUser = document.getElementById("date-niveau-course").value
    let distanceUser = Number(document.getElementById("distance-user").value).toFixed(2)
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

    if (modificationData == true) {
        // Modification de la data
        if (idNiveauModif != undefined) {
            await db.niveau_course.put({
                id: idNiveauModif,
                niveau_course_user: niveauCourseUser,
                distance: distanceUser,
                date: dateNiveauUser
            })
        }

    } else {
        // Ajout datas
        await db.niveau_course.add({
            niveau_course_user: niveauCourseUser,
            distance: distanceUser,
            date: dateNiveauUser
        })
    }

    setTimeout(() => {
        boutonLimite1Clic.textContent = "Sauvegardé" // transimission de l'info au user
    }, 650);
    setTimeout(() => {
        // remise etat normal
        boutonLimite1Clic.textContent = "Sauvegarder"
        boutonLimite1Clic.disabled = false 
        window.location.href = "niveau-course-analyse.html?levelrunregister"
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
        document.querySelector(".large-zone-result-name").textContent = "Niveau"
        return
    }
    if (distanceUser <= 0) {
        errorInput("Distance positive requise !")
        // remise à zéro
        document.querySelector(".large-zone-result-result").textContent = "--"
        document.querySelector(".large-zone-result-name").textContent = "Niveau"
        return
    } else if (distanceUser >= 7) {
        errorInput("Distance inférieure à 7 requise !")
        // remise à zéro
        document.querySelector(".large-zone-result-result").textContent = "--"
        document.querySelector(".large-zone-result-name").textContent = "Niveau"
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

async function editNiveauCourse() {
    const parametreURL = window.location.search // on recherche si il y a un param dans l'URL (ex : ?edit=7)
    let tableauSeparation = parametreURL.split("=") // exemple ['?edit', '7']

    if (tableauSeparation.length == 2) { // vérification si il y a bien 2 partie
        // conversion de l'id en int
        const ID = parseInt(tableauSeparation[1])

        // Recup des datas du workout
        if (ID) {
            const dataNiveauCourse = await db.niveau_course.get(ID)

            if (dataNiveauCourse) {
                // remplissage du formulaire avec les datas
                document.getElementById("date-niveau-course").value = dataNiveauCourse.date

                if (dataNiveauCourse.distance) {
                    document.getElementById("distance-user").value = dataNiveauCourse.distance
                } else {
                    // si ya pas de datas de distance dans la bdd alors on va la générer en fonction du niveau de course du user
                    document.getElementById("distance-user").value = calculDistanceLevel(dataNiveauCourse.niveau_course_user)/1000 // on remet en km car c'est en metres
                }
                liveResultViaInput() // on lance le calcul du niveau de course pour l'afficher

            } else {
                window.location.href = `niveau-course-evolution.html` // si jamais il n'y a pas de data avec l'id dans l'URL on retourne à la page de liste des récupérations
            }

            // maj des textes de la page
            document.getElementById("title-page").textContent = "Modifier un niveau de course"

            // maj var
            modificationData = true
            idNiveauModif = dataNiveauCourse.id
        }
    }

}