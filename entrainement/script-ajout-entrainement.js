const SportIdChamps = { // sport avec les id correspondant aux champs de datas spécifique aux sports
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
    "Natation": ["distance-entrainement-user", "allure-moy-entrainement-user", "nb-longueurs-entrainement-user", "longueur-bassin-entrainement-user"],
    "Paddle": ["distance-entrainement-user", "allure-moy-entrainement-user", "cadence-moy-entrainement-user", "coups-rame-entrainement-user"],

    "Ski": ["distance-entrainement-user", "denivele-entrainement-user", "altitude-max-entrainement-user", "nb-descentes-entrainement-user", "vitesse-moy-entrainement-user", "vitesse-max-entrainement-user"],
    "Ski de fond": ["distance-entrainement-user", "denivele-entrainement-user", "altitude-max-entrainement-user", "vitesse-moy-entrainement-user", "vitesse-max-entrainement-user"],
    "Snowboard": ["distance-entrainement-user", "denivele-entrainement-user", "altitude-max-entrainement-user", "nb-descentes-entrainement-user", "vitesse-moy-entrainement-user", "vitesse-max-entrainement-user"],

    "Corde à sauter": ["nb-tours-entrainement-user", "cadence-moy-entrainement-user", "serie-max-entrainement-user"],
    "Escalade": ["voies-effectuees-entrainement-user", "difficulte-max-entrainement-user", "nb-chutes-entrainement-user"],
    "Sport de chambre": ["nb-positions-entrainement-user", "cadence-moy-entrainement-user"],
}

let IdEditWorkout = null // init variable globale
let noteEntrainement = undefined

async function VerificationParam() {
    const ParametreURL = window.location.search // on recherche si il y a un param dans l'URL (ex : ?edit=7)
    let TableauSeparation = ParametreURL.split("=") // exemple ['?edit', '7']

    if (TableauSeparation.length == 2) { // vérification si il y a bien 2 partie
        // conversion de l'id en int
        const ID = parseInt(TableauSeparation[1])

        // Recup des datas du workout
        if (ID) { 
            // on change la variable globale
            IdEditWorkout = ID
            const WorkoutDB = await db.entrainement.get(ID) // la méthode .get permet de recup direct les datas de l'id coresspondant

            if (WorkoutDB) { // on vérifie si il y a des données au cas ou le user a supprimer son workout
                // on commence par changer le H1 de la page
                document.getElementById("title-page").textContent = "Modification de l'entraînement"

                document.querySelector(".tab-bars-shorcut").style.display = "none"

                // Remettre les champs adaptée au sport
                dataSpecifique(WorkoutDB.sport, false)  
                const dicoRPE = {
                    1:"Facile",
                    2:"Facile",
                    3:"Facile",

                    4:"Modéré",
                    5:"Modéré",
                    6:"Modéré",

                    7:"Difficile",
                    8:"Difficile",

                    9:"Effort maximal",
                    10:"Effort maximal"
                }

                // remplissage des champs qu'on ne peut pas remplir dans la boucle foreach
                document.getElementById("profil-sport").value = WorkoutDB.sport
                document.getElementById("duree-entrainement-user").value = dureeFormatee(WorkoutDB.duree, "hh:mm:ss") // on exige le format "hh:mm:ss"
                // remettre le RPE sur bonne position
                document.querySelector(".slider input").value = WorkoutDB.rpe
                document.querySelector(".slider progress").value = WorkoutDB.rpe
                document.querySelector(".slider-name").innerHTML = "RPE : <span class='RPE'>" + WorkoutDB.rpe + "</span>" + dicoRPE[WorkoutDB.rpe]

                // ajout d'une data a la variable globale
                if (WorkoutDB.note != undefined || WorkoutDB.note != "") {
                    noteEntrainement = WorkoutDB.note
                }

                // tableau des datas à ne pas rentrer dans un input
                const tableauDataNotInInput = ["sport", "duree", "rpe", "charge_entrainement", "id"]

                // .entries c'est pour récupérer la clé et valeur d'un dico/object
                Object.entries(WorkoutDB).forEach(([cle, valeur]) => {
                    if (tableauDataNotInInput.includes(cle)) {
                        // pass
                    } else {
                        const idData = cle.replace("_", "-") + "-entrainement-user"
                        
                        let input = document.getElementById(idData)
                        if (input && valeur != null && valeur != undefined) {
                            if (WorkoutDB.sport == "Natation" || WorkoutDB.sport == "Rameur d'intérieur" || WorkoutDB.sport == "Aviron" || WorkoutDB.sport == "Paddle") {
                                if (cle == "distance") {
                                    valeur = valeur*1000
                                }
                            }
                            input.value = valeur // on affiche la valeur de la bdd dans le input correspondant à l'id de la donnée
                        }
                    }
                });

                // --- Pour mettre à jour les champs en fonction de l'unité du sport
 
                // partie pour gérer la distance entre m et km
                let inputDistance = document.getElementById("distance-entrainement-user")
                if (WorkoutDB.sport == "Natation" || WorkoutDB.sport == "Rameur d'intérieur" || WorkoutDB.sport == "Aviron" || WorkoutDB.sport == "Paddle") { 
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
                if (WorkoutDB.sport == "Natation") { 
                    if (inputAllureMoy) {
                        inputAllureMoy.placeholder = "Allure moy. (/100m)"
                        inputAllureMoy.nextElementSibling.textContent = "Allure moy. (/100m)"
                    }

                } else if (WorkoutDB.sport == "Rameur d'intérieur" || WorkoutDB.sport == "Aviron" || WorkoutDB.sport == "Paddle") {
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
                if (WorkoutDB.sport == "Vélo" || WorkoutDB.sport == "Corde à sauter") { 
                    if (inputCadenceMoy) {
                        inputCadenceMoy.placeholder = "Cadence moy (tpm)"
                        inputCadenceMoy.nextElementSibling.textContent = "Cadence moy (tpm)"
                    }

                } else if (WorkoutDB.sport == "Course") {
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

            } else {  // si il y a rien dans la bdd par rapport à l'id correspond alors on demarre le mode normal 
                dataSpecifique("Libre", true) // pour éviter que la fonction mettent une alert comme quoi il n'y a pas plus de données à afficher
            }

        } else {
            dataSpecifique("Libre", true) // pour éviter que la fonction mettent une alert comme quoi il n'y a pas plus de données à afficher
        }
    } else {        
        dataSpecifique("Libre", true) // pour éviter que la fonction mettent une alert comme quoi il n'y a pas plus de données à afficher
    }

    return
}

function dataSpecifique(sportChoisi, firstChargement) {
    // recup du texte de la div : 'Plus de données'
    let textButtonDataSpe = document.querySelector(".form-different-button-text")
    let typeDisplay = "block"
    // variable qui changerai en fonction de si les champs spécifique sont dépliés ou non

    // recupération du tableau (tableau présent dans un dico) des id des input en fonction du sport
    const tableauIdChampsSpecifique = SportIdChamps[sportChoisi]
    
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
    if (DureeWorkoutUser == null) {
        return
    }
    if (DureeWorkoutUser <= 0) {
        alert("Valeur non valide, la durée doit être un nombre supérieur à 0.")
        return
    }
    if (DureeWorkoutUser >= 1440) {
        alert("La durée de votre entraînement doit être inférieur à 24h00m.")
        return
    }

    // si pas de datas alors on met sur undefined
    if (!FcMoyUser) {FcMoyUser = undefined} else {
        if (FcMoyUser >= 220) {
            alert("Votre fréquence cardiaque moyenne doit être inférieur à 220 bpm.")
            return
        } else if (FcMoyUser <= 50) {
            alert("Votre fréquence cardiaque moyenne doit être supérieur à 50 bpm.")
            return
        }
    }
    if (!FcMaxUser) {FcMaxUser = undefined} else {
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
    let TranspirationEstimee = 0
    let HydratationEstimee = 0

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
    } else {
        TranspirationEstimee = undefined
        HydratationEstimee = undefined
    }

    // init
    let chargeWorkout = 0
    // Calcul Charge
    chargeWorkout = Math.floor(DureeWorkoutUser*ValueRpeUser)
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
    const tableauIdChampsSpe = SportIdChamps[SportWorkoutUser]

    // si il y a un tableau
    if (tableauIdChampsSpe.length > 0) {
        for (const element of tableauIdChampsSpe) {
            const input = document.getElementById(element) // on recup l'input

            if (input) { // si il y en a un alors
                // on enleve -entrainement-user et on remplace '-' en "_" pour avoir le nom de la clé dans la BDD
                const cleData = element.replace("-entrainement-user", "").replace("-", "_")

                let data = input.value.trim() // on recup ce que le user a saisi
                if (input.type == "number") { // si c'est un input number on convertit en nombre floatant
                    data = parseFloat(data)
                }

                if (data != "") {
                    // si le sport est natation, la distance est en metre donc on la convertit en km
                    if (SportWorkoutUser == "Natation" || SportWorkoutUser == "Rameur d'intérieur" || SportWorkoutUser == "Aviron" || SportWorkoutUser == "Paddle") {
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
                        }
                    } else if (cleData == "denivele") { // vérification pour le champs denivele
                        if (data) { // si il y a des datas dans le input

                            // vérification
                            if (data <= 0) {
                                alert("Valeur non valide, le denivele doit être un nombre supérieur à 0.")
                                return
                            }
                            if (data >= 10000) {
                                alert("Le denivele de votre entraînement ne doit pas dépasser 10 000 m.")
                                return
                            }

                            data = parseInt(data)
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

                            data = Number(data).toFixed(2)
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

                            data = Number(data).toFixed(2)
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
    }
    // desactivation du bouton
    BoutonSauvegarde.disabled = true 
    BoutonSauvegarde.textContent = "Sauvegarde..."
    
    // variable pour gérer vers ou renvoyer
    let modificationEntrainement = false

    // ajout des 2 stats moins importante mais présente
    workoutData["transpiration_estimee"] = TranspirationEstimee
    workoutData["hydratation_estimee"] = HydratationEstimee

    // enregistrement ou modification
    if (IdEditWorkout && IdEditWorkout != null) {
        workoutData["id"] = IdEditWorkout
        workoutData["note"] = noteEntrainement

        await db.entrainement.put(workoutData)
        // mise sur true pour renvoyer vers lentrainement directement
        modificationEntrainement = true
    } else {
        await db.entrainement.add(workoutData)
    }

    // Pause
    setTimeout(() => {
        // Remise bouton etat normal
        BoutonSauvegarde.textContent = "Sauvegarder"
        BoutonSauvegarde.disabled = false

        if (modificationEntrainement == true) {
            // Renvoi vers la page entraînement
            window.location.href = `entrainement.html?workout=${IdEditWorkout}` // on met un param dans l'URL
        } else {
            // Renvoi vers la page entraînement
            window.location.href = "../index.html?workoutregister" // on met un param dans l'URL
        }
    }, 800)

    return
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
    if (value == "Natation" || value == "Rameur d'intérieur" || value == "Aviron" || value == "Paddle") { // value c'est le sport du combobox
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

    } else if (value == "Rameur d'intérieur" || value == "Aviron" || value == "Paddle") { // value c'est le sport du combobox
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

window.addEventListener("DOMContentLoaded", () => {
    cacherInput("") // pour cacher tout les champs de datas spécifique
    VerificationParam()
})