// sport avec les id correspondant aux champs de datas spécifique des sports
const sportIdChamps = {
    "Libre": ["distance-entrainement-user"],

    "Course": ["distance-entrainement-user", "denivele-entrainement-user", "allure-moy-entrainement-user", "vitesse-max-entrainement-user", "cadence-moy-entrainement-user", "nb-pas-entrainement-user"],
    "Marche": ["distance-entrainement-user", "denivele-entrainement-user", "allure-moy-entrainement-user", "nb-pas-entrainement-user"],
    "Randonnée": ["distance-entrainement-user", "denivele-entrainement-user", "altitude-max-entrainement-user", "allure-moy-entrainement-user", "nb-pas-entrainement-user"],
    "Vélo": ["distance-entrainement-user", "denivele-entrainement-user", "vitesse-moy-entrainement-user", "vitesse-max-entrainement-user", "cadence-moy-entrainement-user"],

    "Badminton": ["nb-coups-entrainement-user", "nb-sets-entrainement-user", "vitesse-smash-entrainement-user", "nb-points-entrainement-user", "nb-pas-entrainement-user"],
    "Tennis": ["nb-coups-entrainement-user", "nb-sets-entrainement-user", "vitesse-smash-entrainement-user", "nb-points-entrainement-user", "nb-pas-entrainement-user"],
    "Tennis de table": ["nb-coups-entrainement-user", "nb-sets-entrainement-user", "vitesse-smash-entrainement-user", "nb-points-entrainement-user", "nb-pas-entrainement-user"],

    "Boxe": ["nb-coups-entrainement-user", "nb-combats-entrainement-user", "nb-victoires-entrainement-user", "nb-defaites-entrainement-user"],
    "Judo": ["nb-combats-entrainement-user", "nb-victoires-entrainement-user", "nb-chutes-entrainement-user"],

    "Basketball": ["distance-entrainement-user", "score-entrainement-user", "nb-pas-entrainement-user"],
    "Football": ["distance-entrainement-user", "score-entrainement-user", "nb-pas-entrainement-user"],
    "Handball": ["distance-entrainement-user", "score-entrainement-user", "nb-pas-entrainement-user"],
    "Rugby": ["distance-entrainement-user", "score-entrainement-user", "nb-pas-entrainement-user"],
    "Volley": ["nb-services-entrainement-user", "nb-smash-entrainement-user", "nb-sets-entrainement-user", "score-entrainement-user"],

    "CrossFit": ["muscles-travailles-entrainement-user", "nb-reps-entrainement-user", "nb-series-entrainement-user", "poids-total-entrainement-user"],
    "HIIT": ["muscles-travailles-entrainement-user", "nb-reps-entrainement-user", "nb-series-entrainement-user"],
    "Musculation": ["muscles-travailles-entrainement-user", "nb-reps-entrainement-user", "nb-series-entrainement-user", "poids-total-entrainement-user"],
    "Rameur d'intérieur": ["distance-entrainement-user", "coups-rame-entrainement-user", "allure-moy-entrainement-user", "cadence-moy-entrainement-user"],

    "Aviron": ["distance-entrainement-user", "allure-moy-entrainement-user", "cadence-moy-entrainement-user", "coups-rame-entrainement-user"],
    "Kayak": ["distance-entrainement-user", "allure-moy-entrainement-user", "cadence-moy-entrainement-user", "coups-pagaie-entrainement-user"],
    "Natation": ["distance-entrainement-user", "allure-moy-entrainement-user", "nb-longueurs-entrainement-user", "longueur-bassin-entrainement-user"],
    "Paddle": ["distance-entrainement-user", "allure-moy-entrainement-user", "cadence-moy-entrainement-user", "coups-pagaie-entrainement-user"],

    "Ski": ["distance-entrainement-user", "denivele-entrainement-user", "altitude-max-entrainement-user", "nb-descentes-entrainement-user", "vitesse-moy-entrainement-user", "vitesse-max-entrainement-user"],
    "Ski de fond": ["distance-entrainement-user", "denivele-entrainement-user", "altitude-max-entrainement-user", "vitesse-moy-entrainement-user", "vitesse-max-entrainement-user"],
    "Snowboard": ["distance-entrainement-user", "denivele-entrainement-user", "altitude-max-entrainement-user", "nb-descentes-entrainement-user", "vitesse-moy-entrainement-user", "vitesse-max-entrainement-user"],

    "Corde à sauter": ["nb-tours-entrainement-user", "cadence-moy-entrainement-user", "serie-max-entrainement-user"],
    "Escalade": ["voies-effectuees-entrainement-user", "difficulte-max-entrainement-user", "nb-chutes-entrainement-user"]
}

let IdEditWorkout = null // init variable globale

function manageRPE(valueRPE) {
    const dicoDescriptionRPE = {
        1:["Facile", "#1fff80"], 2:["Facile", "#1fff80"], 3:["Facile", "#1fff80"],
        4:["Modéré", "#e7e625"], 5:["Modéré", "#e7e625"], 6:["Modéré", "#e7e625"],
        7:["Difficile", "#ff4b4c"], 8:["Difficile", "#ff4b4c"],
        9:["Effort maximal", "#9386f1"], 10:["Effort maximal", "#9386f1"]
    }

    const sliderInput = document.querySelector(".slider input")
    if (sliderInput) {sliderInput.value = valueRPE}

    const sliderProgress = document.querySelector(".slider progress")
    if (sliderProgress) {sliderProgress.value = valueRPE}

    const spanRpe = document.querySelector(".slider-name span.RPE")
    if (spanRpe) {
        spanRpe.textContent = valueRPE
        spanRpe.style.background = dicoDescriptionRPE[valueRPE][1]
    }

    const descriptionRpe =document.getElementById("description-rpe")
    if (descriptionRpe) {
        descriptionRpe.textContent = dicoDescriptionRPE[valueRPE][0]
        descriptionRpe.style.color = dicoDescriptionRPE[valueRPE][1]
    }

}
function remplissageInput(workoutData) {
    const selectSport = document.getElementById("profil-sport")
    if (selectSport) {
        selectSport.value = workoutData.sport || "Libre"
    }

    const inputDuree = document.getElementById("duree-entrainement-user")
    if (inputDuree) {
        inputDuree.value = dureeFormatee(workoutData.duree, "hh:mm:ss") // on exige le format "hh:mm:ss"
    }

    manageRPE(workoutData.rpe || 1)

    if (workoutData.note != undefined && workoutData.note != "") {
        const textAreaNote = document.getElementById("note-entrainement")
        if (textAreaNote) {textAreaNote.value = workoutData.note}
    }

    // tableau des datas à ne pas rentrer dans un input
    const tableauDataNotInInput = ["sport", "duree", "rpe", "charge_entrainement", "id"]

    // .entries c'est pour récupérer la clé et valeur d'un dico/object
    Object.entries(workoutData).forEach(([cle, valeur]) => {
        if (tableauDataNotInInput.includes(cle)) {
            // pass
        } else {
            const idData = cle.replace("_", "-") + "-entrainement-user"

            let input = document.getElementById(idData)
            if (input && valeur != null && valeur != undefined) {
                if (workoutData.sport == "Natation" || workoutData.sport == "Rameur d'intérieur" || workoutData.sport == "Aviron"
                    || workoutData.sport == "Kayak" || workoutData.sport == "Paddle") {
                    if (cle == "distance") {
                        valeur = valeur*1000
                    }
                }
                input.value = valeur // on affiche la valeur de la bdd dans le input correspondant à l'id de la donnée
            }
        }
    });
}
function manageUnitOfInput(sportWorkout) {
    // distance : m, km
    let inputDistance = document.getElementById("distance-entrainement-user")
    if (inputDistance) {
        if (sportWorkout == "Natation" || sportWorkout == "Rameur d'intérieur" || sportWorkout == "Aviron" || sportWorkout == "Kayak" 
            || sportWorkout == "Paddle") {
            inputDistance.placeholder = "Distance (m)"
            inputDistance.nextElementSibling.textContent = "Distance (m)"
        }
    }

    // allure moyenne : /km, /500m, /100m
    let inputAllureMoy = document.getElementById("allure-moy-entrainement-user")
    if (inputAllureMoy) {
        if (sportWorkout == "Natation") {
            inputAllureMoy.placeholder = "Allure moy. (/100m)"
            inputAllureMoy.nextElementSibling.textContent = "Allure moy. (/100m)"
        } else if (sportWorkout == "Rameur d'intérieur" || sportWorkout == "Aviron" || sportWorkout == "Kayak" || 
            sportWorkout == "Paddle") {
            inputAllureMoy.placeholder = "Allure moy. (/500m)"
            inputAllureMoy.nextElementSibling.textContent = "Allure moy. (/500m)"
        }
    }
    
    // cadence : ppm, tpm, cpm
    let inputCadenceMoy = document.getElementById("cadence-moy-entrainement-user")
    if (inputCadenceMoy) {
        if (sportWorkout == "Vélo" || sportWorkout == "Corde à sauter") {
            inputCadenceMoy.placeholder = "Cadence moy. (tpm)"
            inputCadenceMoy.nextElementSibling.textContent = "Cadence moy (tpm)"
        } else if (sportWorkout == "Course") {
            inputCadenceMoy.placeholder = "Cadence moy. (ppm)"
            inputCadenceMoy.nextElementSibling.textContent = "Cadence moy (ppm)"
        }
    }
}
async function checkParamInUrl() {
    const parametreURL = window.location.search // on recherche si il y a un param dans l'URL (ex : ?edit=7)

    // si ya pas de parametre dans l'url alors on arrete la fonction
    if (parametreURL == "") {return}
    let tableauSeparation = parametreURL.split("=") // exemple ['?edit', '7']

    // si le tableau ne fait pas 2 c'est qu'il y a un probleme c'est pas ce qu'on veut donc on stop
    if (tableauSeparation.length != 2) {return} 
    
    const ID = parseInt(tableauSeparation[1]) // conversion de l'id en int
    if (ID) {
        IdEditWorkout = ID // on modifie la variable globale

        const dataWorkout = await db.entrainement.get(ID)
        if (dataWorkout == undefined) {return}

        // mise à jour des elt de la page pour passer de l'ajout d'un entrainement à la modification
        const titlePage = document.getElementById("title-page")
        const commandInToolbars = document.querySelector("div.toolbar div.container-command")
        if (titlePage && commandInToolbars) {
            titlePage.textContent = "Modification de l'entraînement"
            commandInToolbars.style.display = "none" // on cache l'icone file car on modifie l'entrainement on en ajoute pas
        }

        // on affiche tous les inputs des datas spécifique du sport
        dataSpecifique(dataWorkout.sport, false)

        // on remplit les inputs basiques
        remplissageInput(dataWorkout)
        manageUnitOfInput(dataWorkout.sport)
    }
}

function dataSpecifique(sportChoisi, firstChargement) {
    // recup du texte de la div : 'Plus de données'
    let textButtonDataSpe = document.querySelector(".form-different-button-text")
    let typeDisplay = "block"
    // variable qui changerai en fonction de si les champs spécifique sont dépliés ou non

    // recupération du tableau (tableau présent dans un dico) des id des input en fonction du sport
    const tableauIdChampsSpecifique = sportIdChamps[sportChoisi]
    
    if (textButtonDataSpe && firstChargement != true) {
        // si le text de la div est "plus de données" alors on met "moins de données" et inversement
        if (textButtonDataSpe.textContent == "Plus de données") {
            textButtonDataSpe.textContent = "Moins de données"
        } else { // ça veut dire que le user a cliqué sur moins de data
            textButtonDataSpe.textContent = "Plus de données"
            typeDisplay = "none" // on change le contenu de la variable pour pouvoir cacher les input
        }

        tableauIdChampsSpecifique.forEach(element => {
            let input = document.getElementById(element)
            if (input) {
                // on prend le parent de l'input cest a dire le conteneur de linput
                input.parentElement.style.display = typeDisplay // on le cache ou on l'affiche suivant laction du user
            }
        });

    } 
}

async function saveWorkout() {
    // Recup du bouton
    let BoutonSauvegarde = document.getElementById("button-sauvegarder")

    // Recup valeur des champs de base d'un entraînement
    let SportWorkoutUser = document.getElementById("profil-sport").value.trim()
    let DateWorkoutUser = document.getElementById("date-entrainement-user").value
    let NameWorkoutUser = document.getElementById("nom-entrainement-user").value.trim()
    let DureeWorkoutUser = document.getElementById("duree-entrainement-user").value.trim()
    let ValueRpeUser = parseInt(document.querySelector(".slider progress").value)
    let FcMoyUser = parseInt(document.getElementById("fc-moy-entrainement-user").value.trim())
    let FcMaxUser = parseInt(document.getElementById("fc-max-entrainement-user").value.trim())


    // Vérification des champs de base
    if (!DateWorkoutUser || !DureeWorkoutUser || !NameWorkoutUser) {
        alert("Les champs avec '*' sont obligatoire, vous devez les remplir.")
        return
    }

    // Prépa date pour les comparer ensuite
    const DateUserFormatee = new Date(DateWorkoutUser)
    const DateActuelle = new Date()
    if (DateUserFormatee > DateActuelle) { // Comparaison de 2 dates
        alert("La date ne peut pas être dans le future.")
        return
    }

    DureeWorkoutUser = conversionMinutes(DureeWorkoutUser)
    // la fonction conversionMinutes met des alertes et renvoies null et donc pour que la fonction s'arrete ici on met la condition ci dessous
    if (DureeWorkoutUser == null) {return}
    if (DureeWorkoutUser <= 0) {
        alert("Valeur non valide, la durée doit être un nombre supérieur à 0.")
        return
    }
    if (DureeWorkoutUser >= 1440) {
        alert("La durée de votre entraînement doit être inférieur à 24h00m.")
        return
    }

    // si pas de datas alors on met sur undefined
    if (isNaN(FcMoyUser)) {FcMoyUser = undefined} else {
        if (FcMoyUser >= 220) {
            alert("Votre fréquence cardiaque moyenne doit être inférieur à 220 bpm.")
            return
        } else if (FcMoyUser <= 50) {
            alert("Votre fréquence cardiaque moyenne doit être supérieur à 50 bpm.")
            return
        }
    }
    if (isNaN(FcMaxUser)) {FcMaxUser = undefined} else {
        if (FcMaxUser >= 220) {
            alert("Votre fréquence cardiaque maximum doit être inférieur à 220 bpm.")
            return
        } else if (FcMaxUser <= 50) {
            alert("Votre fréquence cardiaque maximum doit être supérieur à 50 bpm.")
            return
        }
    }

    // Calcul de la transpiration
    let profilDB = await db.profil.get(1)
    let TranspirationEstimee = undefined
    let HydratationEstimee = undefined

    if (profilDB != undefined) {
        let poidsUser = Number(profilDB.poids)
        let DureeHeure = DureeWorkoutUser/60 // Conversion de la durée en heure
        let CoefficientRpe = [0.4, 0.8, 1.2, 1.6]

        // Attribution de la valeur du RPE
        if (ValueRpeUser <= 3) {
            CoefficientRpe = CoefficientRpe[0]
        } else if (ValueRpeUser <= 6) {
            CoefficientRpe = CoefficientRpe[1]
        } else if (ValueRpeUser <= 8) {
            CoefficientRpe = CoefficientRpe[2]
        } else {
            CoefficientRpe = CoefficientRpe[3]
        }

        // Calcul
        TranspirationEstimee = Math.round((DureeHeure*CoefficientRpe*(poidsUser/70))*1000)
        HydratationEstimee = Math.round(TranspirationEstimee*1.2)
    }

    // init
    let chargeWorkout = 0
    let coefRpe = {1:0.2, 2:0.4, 3:0.7, 4:1.1, 5:1.6, 6:2.3, 7:3.2, 8:4.5, 9:6.2, 10:8.5}
    // Calcul Charge
    chargeWorkout = Math.floor(DureeWorkoutUser*coefRpe[ValueRpeUser])
    // si la charge est inférieur à 1 alors on la met a 1
    if (chargeWorkout < 1) {chargeWorkout = 1}
    
    // base du dico qu'on enregistrera
    let workoutData = {
        sport: SportWorkoutUser,
        date: DateWorkoutUser,
        nom: NameWorkoutUser,
        duree: DureeWorkoutUser,
        rpe: ValueRpeUser,
        fc_moy: FcMoyUser,
        fc_max: FcMaxUser,
        charge_entrainement: chargeWorkout
    }

    // on regarde qu'elle champs on doit sauvegarde en stockant dans un tableau
    const tableauIdChampsSpe = sportIdChamps[SportWorkoutUser]

    // si il y a un tableau
    if (tableauIdChampsSpe.length > 0) {
        for (const element of tableauIdChampsSpe) {
            const input = document.getElementById(element) // on recup l'input

            if (input) { // si il y en a un alors
                // on enleve -entrainement-user et on remplace '-' en "_" pour avoir le nom de la clé dans la BDD
                const cleData = element.replace("-entrainement-user", "").replace("-", "_")

                let data = input.value.trim() // on recup ce que le user a saisi
                if (data == "") {continue} // continue permet de passer directement au tour suivant de la boucle for
                if (input.type == "number") { // si c'est un input number on convertit en nombre floatant
                    data = parseFloat(data)
                    if (isNaN(data)) {continue} // continue permet de passer directement au tour suivant de la boucle for
                }

                // si le sport est natation, la distance est en metre donc on la convertit en km
                if (SportWorkoutUser == "Natation" || SportWorkoutUser == "Rameur d'intérieur" || SportWorkoutUser == "Aviron" || SportWorkoutUser == "Kayak" || SportWorkoutUser == "Paddle") {
                    if (cleData == "distance") {
                        if (!isNaN(Number(data))) { // on regarde si il y a du contenu dans le input, la data
                            data = data/1000 // on remet en kilomètres
                        }
                    }
                }

                // --- Vérification des champs spécifique ---   
                if (cleData == "distance") { // vérification pour le champs distance
                    if (data) { // si il y a des datas dans le input

                        // vérification
                        if (data <= 0) {
                            alert("Valeur non valide, la distance doit être un nombre supérieur à 0.")
                            return
                        }
                        if (data >= 1000) {
                            alert("La distance de votre entraînement ne doit pas dépasser 1000 kilomètres.")
                            return
                        }
                        data = Number(data.toFixed(2))
                    }
                } else if (cleData == "denivele") { // vérification pour le champs denivele
                    if (data) { // si il y a des datas dans le input
                        data = Math.floor(data)

                        // vérification
                        if (data <= 0) {
                            alert("Valeur non valide, le denivele doit être un nombre supérieur à 0.")
                            return
                        }
                        if (data >= 10000) {
                            alert("Le denivele de votre entraînement ne doit pas dépasser 10 000 m.")
                            return
                        }
                    }
                } else if (cleData == "vitesse_max" || cleData == "vitesse_smash") { // vérification pour le champs vitesse_max
                    if (data) { // si il y a des datas dans le input

                        // vérification
                        if (data <= 0) {
                            alert("Valeur non valide, la vitesse doit être un nombre supérieur à 0.")
                            return
                        }
                        if (data >= 200) {
                            alert("La vitesse de votre entraînement ne doit pas dépasser 200 km/h.")
                            return
                        }

                        data = parseFloat(data)
                    }
                } else if (cleData == "cadence_moy") { // vérification pour le champs cadence_moy
                    if (data) { // si il y a des datas dans le input

                        // vérification
                        if (data <= 0) {
                            alert("Valeur non valide, la cadence moyenne doit être un nombre supérieur à 0.")
                            return
                        }
                        if (data >= 600) {
                            alert("La cadence moyenne de votre entraînement doit être un nombre inférieur à 600.")
                            return
                        }

                        data = parseInt(data)
                    }
                } else if (cleData == "nb_pas") { // vérification pour le champs nb_pas
                    if (data) { // si il y a des datas dans le input

                        // vérification
                        if (data <= 0) {
                            alert("Valeur non valide, le nombre de pas doit être un nombre supérieur à 0.")
                            return
                        }
                        if (data >= 800000) {
                            alert("Le nombre de pas de votre entraînement doit être un nombre inférieur à 800000.")
                            return
                        }

                        data = parseInt(data)
                    }
                } else if (cleData == "altitude_max") { // vérification pour le champs altitude_max
                    if (data) { // si il y a des datas dans le input

                        // vérification
                        if (data <= 0) {
                            alert("Valeur non valide, l'altitude maximum doit être un nombre supérieur à 0.")
                            return
                        }
                        if (data >= 10000) {
                            alert("L'altitude maximum de votre entraînement doit être un nombre inférieur à 10000.")
                            return
                        }

                        data = parseInt(data)
                    }
                } else if (cleData == "vitesse_moy") { // vérification pour le champs vitesse_moy
                    if (data) { // si il y a des datas dans le input

                        // vérification
                        if (data <= 0) {
                            alert("Valeur non valide, la vitesse moyenne doit être un nombre supérieur à 0.")
                            return
                        }
                        if (data >= 200) {
                            alert("La vitesse moyenne de votre entraînement doit être un nombre inférieur à 200.")
                            return
                        }

                        data = parseFloat(data)
                    }
                } else if (cleData == "nb_coups" || cleData == "nb_sets" || cleData == "nb_defaites" || cleData == "nb_chutes" || cleData == "nb_victoires" || cleData == "nb_combats" || cleData == "nb_points" || cleData == "nb_services" || cleData == "nb_smash" || cleData == "nb_reps" || cleData == "nb_series" || cleData == "nb_longueurs" || cleData == "nb_descentes" || cleData == "serie_max" || cleData == "nb_tours" || cleData == "nb_positions") { 
                    if (data) { // si il y a des datas dans le input

                        // vérification
                        if (data <= 0) {
                            alert(`Valeur non valide, le champs nommé : '${cleData}' doit être un nombre supérieur à 0.`)
                            return
                        }
                        if (data >= 1000000) {
                            alert(`Le champs nommé : '${cleData}' doit être un nombre inférieur à 1000000.`)
                            return
                        }

                        data = parseInt(data)
                    }
                } else if (cleData == "coups_rame") { // vérification pour le champs coups_rame
                    if (data) { // si il y a des datas dans le input

                        // vérification
                        if (data <= 0) {
                            alert("Valeur non valide, les coups de rame doivent être un nombre supérieur à 0.")
                            return
                        }
                        if (data >= 10000) {
                            alert("Les coups de rame de votre entraînement doit être un nombre inférieur à 10000.")
                            return
                        }

                        data = parseInt(data)
                    }
                }

                // on ajoute au dico la nouvelle valeur si elle n'est pas vide
                workoutData[cleData] = data
            }
                
        }
    }

    // on récup la note de l'entraînement si il y en a une
    let noteWorkout = document.getElementById("note-entrainement").value.trim()
    if (!noteWorkout || noteWorkout == "") {
        workoutData["note"] = undefined
    } else {
        workoutData["note"] = noteWorkout
    }

    // desactivation du bouton
    BoutonSauvegarde.disabled = true 
    BoutonSauvegarde.textContent = "Sauvegarde..."

    // ajout des 2 stats moins importante mais présente
    workoutData["transpiration_estimee"] = TranspirationEstimee
    workoutData["hydratation_estimee"] = HydratationEstimee

    // enregistrement ou modification
    let idWorkout = undefined
    if (IdEditWorkout && IdEditWorkout != null) {
        const dataWorkoutEdit = await db.entrainement.get(IdEditWorkout)
        idWorkout = IdEditWorkout

        workoutData["id"] = IdEditWorkout

        if (dataWorkoutEdit) { // si ya des datas
            let pointGPS = dataWorkoutEdit["points_gps"]
            if (pointGPS != undefined) { // si ya des datas de points gps
                workoutData["points_gps"] = pointGPS // on l'ajoute au dico
            }
        }
        await db.entrainement.put(workoutData)
    } else {
        idWorkout = await db.entrainement.add(workoutData)
    }
    
    BoutonSauvegarde.textContent = "Sauvegardé"
    await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 500))
    
    BoutonSauvegarde.textContent = "Sauvegarder"
    BoutonSauvegarde.disabled = false

    if (idWorkout != undefined) {
        window.location.href = `entrainement.html?workout=${idWorkout}` // on met un param dans l'URL
    }
}

function cacherInput(value) { // pour cacher tout les champs de datas spécifique
    let inputAdvanced = document.querySelectorAll(".input-advanced") // on recup tout les input

    inputAdvanced.forEach(element => {
        let input = element.querySelector("input")

        if (input) {input.value = ""} // on les réinitialise donc on vide le champs input 

        element.style.display = 'none' // on les mets en display none
    });

    // partie pour gérer la distance entre m et km
    let inputDistance = document.getElementById("distance-entrainement-user")
    if (value == "Natation" || value == "Rameur d'intérieur" || value == "Aviron" || value == "Kayak" || value == "Paddle") { // value c'est le sport du combobox
        if (inputDistance) {
            inputDistance.placeholder = "Distance (m)"
            inputDistance.nextElementSibling.textContent = "Distance (m)"
        }

    } else { // si le sport n'est pas la natation ou le rameur alors, on affiche la distance en km
        if (inputDistance) {
            inputDistance.placeholder = "Distance (km)"
            inputDistance.nextElementSibling.textContent = "Distance (km)"
        }

    }

    // partie pour gérer l'allure entre /km, /500m, /100m
    let inputAllureMoy = document.getElementById("allure-moy-entrainement-user")
    if (value == "Natation") { // value c'est le sport du combobox
        if (inputAllureMoy) {
            inputAllureMoy.placeholder = "Allure moy. (/100m)"
            inputAllureMoy.nextElementSibling.textContent = "Allure moy. (/100m)"
        }

    } else if (value == "Rameur d'intérieur" || value == "Aviron" || value == "Kayak" || value == "Paddle") { // value c'est le sport du combobox
        if (inputAllureMoy) {
            inputAllureMoy.placeholder = "Allure moy. (/500m)"
            inputAllureMoy.nextElementSibling.textContent = "Allure moy. (/500m)"
        }

    } else { // si le sport n'est pas la natation ou le rameur alors, on affiche la distance en km
        if (inputAllureMoy) {
            inputAllureMoy.placeholder = "Allure moy. (/km)"
            inputAllureMoy.nextElementSibling.textContent = "Allure moy. (/km)"
        }

    }

    // partie pour gérer la cadence moy entre ppm, tpm, cpm
    let inputCadenceMoy = document.getElementById("cadence-moy-entrainement-user")
    if (value == "Vélo" || value == "Corde à sauter") { 
        if (inputCadenceMoy) {
            inputCadenceMoy.placeholder = "Cadence moy (tpm)"
            inputCadenceMoy.nextElementSibling.textContent = "Cadence moy (tpm)"
        }

    } else if (value == "Course") {
        if (inputCadenceMoy) {
            inputCadenceMoy.placeholder = "Cadence moy (ppm)"
            inputCadenceMoy.nextElementSibling.textContent = "Cadence moy (ppm)"
        }

    } else { // pr tout les autres sports
        if (inputCadenceMoy) {
            inputCadenceMoy.placeholder = "Cadence moy (cpm)"
            inputCadenceMoy.nextElementSibling.textContent = "Cadence moy (cpm)"
        }

    }
    
    let textButtonDataSpe = document.querySelector(".form-different-button-text")
    if (textButtonDataSpe) { 
        if (textButtonDataSpe.textContent != "Plus de données") {
            // on remet le text plus de données si ce nest pas deja le cas
            textButtonDataSpe.textContent = "Plus de données"
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const selectHtml = document.getElementById("profil-sport")
    if (selectHtml) {selectHtml.addEventListener("change", (event) => {cacherInput(event.target.value)})}

    const buttonPlusDatas = document.getElementById("plus-de-donnees")
    if (buttonPlusDatas) {buttonPlusDatas.addEventListener("click", () => {dataSpecifique(document.getElementById('profil-sport').value)})}

    const buttonSaveWorkout = document.getElementById("button-sauvegarder")
    if (buttonSaveWorkout) {buttonSaveWorkout.addEventListener("click", saveWorkout)}

    cacherInput("") // pour cacher tout les champs de datas spécifique
    checkParamInUrl()
})