const BddNomData = { // sport avec les id correspondant aux champs de datas spécifique aux sports
    "id": ["id", ""],
    "sport": ["Sport", ""],
    "date": ["Date", ""],
    "nom": ["Nom", ""],
    "duree": ["Durée", ""],
    "rpe": ["RPE", "/10"],
    "fc_moy": ["FC moyenne", "bpm"],
    "fc_max": ["FC maximum", "bpm"],
    "distance": ["Distance", ["km", "m"]],
    "denivele": ["Dénivelé", "m"],
    "allure_moy": ["Allure moyenne", ["/km", "/500m", "/100m"]],
    "vitesse_moy": ["Vitesse moyenne", "km/h"],
    "vitesse_max": ["Vitesse maximum", "km/h"],
    "cadence_moy": ["Cadence moyenne", ["ppm", "tpm", "cpm"]], 
    "nb_pas": ["Pas", ""],
    "altitude_max": ["Altitude maximum", "m"],
    "nb_coups": ["Nombre de coups", ""],
    "nb_sets": ["Nombre de sets", ""],
    "vitesse_smash": ["Vitesse de smash", "km/h"],
    "nb_points": ["Nombre de points", ""],
    "nb_combats": ["Nombre de combats", ""],
    "nb_victoires": ["Nombre de victoires", ""],
    "nb_defaites": ["Nombre de défaites", ""],
    "nb_chutes": ["Nombre de chutes", ""],
    "score": ["Score", ""],
    "nb_services": ["Nombre de services", ""],
    "nb_smash": ["Nombre de smash", ""],
    "nb_reps": ["Nombre de reps", ""],
    "nb_series": ["Nombre de séries", ""],
    "poids_total": ["Poids total", "kg"],
    "coups_rame": ["Coups de rame", ""],
    "nb_longueurs": ["Nombre de longueurs", ""],
    "longueur_bassin": ["Longueur du bassin", "m"],
    "nb_tours": ["Nombre de tours", ""],
    "serie_max": ["Séries maximum", ""],
    "nb_descentes": ["Nombre de descentes", ""],
    "voies_effectuees": ["Voies effectuées", ""],
    "difficulte_max": ["Difficulté maximum", ""],
    "muscles_travailles": ["Muscles travaillés", ""],
    "charge_entrainement": ["Charge d'entraînement", "CE"],
}
let idWorkout = undefined

function afficherData(dataWorkout) {
    // Structure de base de la page entrainement
    let structureHTML = `
        <h1>${dataWorkout.nom}</h1>

        <div class="toolbar">
            <p class="text-toolbar"><strong>${dataWorkout.sport}</strong><br>${formatEuropeenDate(dataWorkout.date)}</p>
            <i class="fs-icon_plus" id="button-group-button"></i>
        </div>

        <div class="menu-many-action">
            <li id="button-modifier">Modifier</li>
            <li id="button-supprimer">Supprimer</li>
        </div>

        <section class="container-block"> 

            <div class="container-block-data">
                <p class="container-block-data-header">Durée</p>
                <p class="container-block-data-data">${dureeFormatee(dataWorkout.duree)}</p>
            </div>
    `
    
    // initialisation de 2 tableaux
    const tableauDataNotDisplay = ["Nom", "Sport", "Date", "Durée", "id"]
    const tableauDataSeule = ["Charge d'entraînement", "Muscles travaillés", "Score", "Voies effectuées"]

    // on parcourt les datas de l'entraînement (c un dico donc on recup la cle et la valeur)
    Object.entries(dataWorkout).forEach(([cle, valeur]) => {
        if (cle=="note") {
            // si c'est la note on ne fais rien on le fera plus tard
        } else {
            const nomUniteData = BddNomData[cle] // on récupère le nom et l'unité de la data 
            const nomData = nomUniteData[0] // on récupère le nom de la data ex: muscles_travailles => Muscles travaillés

            let typeValeur = typeof(valeur) // on recup le type de la valeur
            if (typeValeur == "number") { // si c'est un number alors
                valeur = Number(valeur) // on convertit en nombre
                if (isNaN(valeur)) { // et si la valeur est NaN (=quand le user met rien dans le champs lors de l'enregistrement de datas)
                    valeur = null // on met sur null pour que la condition ci-dessous n'affiche pas cette data
                }
            }
            
            // initialisation
            let uniteData = ""
            if (cle == "cadence_moy") { // si la datas c'est cadence moy on prend ppm ou tpm ou cpm en fonction du sport
                if (dataWorkout.sport == "Course") {
                    uniteData = nomUniteData[1][0] // on récupère l'unité de la data  => ppm
                } else if (dataWorkout.sport == "Vélo" || dataWorkout.sport == "Corde à sauter") {
                    uniteData = nomUniteData[1][1] // on récupère l'unité de la data => tpm
                } else { // si c'est du rameur, aviron,...
                    uniteData = nomUniteData[1][2] // on récupère l'unité de la data => cpm
                }

            } else if (cle == "distance") {
                if (dataWorkout.sport == "Natation" || dataWorkout.sport == "Rameur d'intérieur" || dataWorkout.sport == "Aviron" || dataWorkout.sport == "Paddle") {
                    uniteData = nomUniteData[1][1] // on récupère l'unité de la data  => m
                    if (valeur != null) { // on passe des kilomètres en metres
                        valeur = valeur*1000
                        valeur= valeur.toFixed(1).toString().replace(".", ",")
                    }
                } else {
                    uniteData = nomUniteData[1][0] // on récupère l'unité de la data  => km
                    if (valeur != null) { // on passe des kilomètres en metres
                        valeur = valeur.toFixed(2).toString().replace(".", ",")
                    }
                }

            } else if (cle == "allure_moy") {
                if (dataWorkout.sport == "Natation") {
                    uniteData = nomUniteData[1][2] // on récupère l'unité de la data  => /100m 
                } else if (dataWorkout.sport == "Rameur d'intérieur" || dataWorkout.sport == "Aviron" || dataWorkout.sport == "Paddle") {
                    uniteData = nomUniteData[1][1] // on récupère l'unité de la data  => /500m 
                } else {
                    uniteData = nomUniteData[1][0] // on récupère l'unité de la data  => /km 
                }

            } else {
                uniteData = nomUniteData[1] // on récupère l'unité de la data ex: distance => km
            }

            if (valeur != null || valeur != undefined) { // si il y a une datas en undefined ou null alors on n'affiche pas cette datas
                // on regarde si le nom de la data n'est pas dans le tableau car le nom, la date, le sport est dans la structure de base de la page html
                if (tableauDataNotDisplay.includes(nomData)) { 
                    // pass
                } else {
                    if (tableauDataSeule.includes(nomData)) { // on check si c'est une data qu'on doit afficher seul ou pas 
                        // on referme d'abord la section container-block on la rouvre puis on la referme
                        structureHTML += `
                            </section>

                            <section class="container-block">
                                <div class="container-block-data">
                                    <p class="container-block-data-header">${nomData}</p>
                                    <p class="container-block-data-data">${valeur} <small>${uniteData}</small></p>
                                </div>
                            </section>

                            <section class="container-block">
                        `

                    } else {
                        // si c'est un data normal alors on met la div correspondante
                        structureHTML += `
                            <div class="container-block-data">
                                <p class="container-block-data-header">${nomData}</p>
                                <p class="container-block-data-data">${valeur} <small>${uniteData}</small></p>
                            </div>
                        `
                    }
                }

            }
        }

    });

    structureHTML += `
        </section>

        <!-- Pour la note -->
        <h2>Note</h2>
        <textarea id="note-entrainement" oninput="apparitionButton()" maxlength=250 placeholder="Note de l'entraînement"></textarea>
        <button id="button-sauvegarder-note-workout" style="display: none;" onclick="saveDescription()">Sauvegarder la note</button>
    `

    // on ajoute au conteneur
    document.querySelector(".page-entrainement").innerHTML = structureHTML

    // on remplit le champs note entrainement si il y a du contenu dans la BDD
    if (dataWorkout.note != undefined && dataWorkout.note) {
        if (document.getElementById("note-entrainement")) { // on check si il y a un champs note sur la page
            document.getElementById("note-entrainement").value = dataWorkout.note
        }
    }

    return
}

function apparitionButton() {
    // on recup et affiche le bouton sauvegarder
    let buttonSave = document.getElementById("button-sauvegarder-note-workout")
    buttonSave.style.display = "block"
}

async function saveDescription() {
    let noteWorkout = document.getElementById("note-entrainement").value.trim()
    let buttonSave = document.getElementById("button-sauvegarder-note-workout")

    // message au user
    buttonSave.disabled = true
    buttonSave.textContent = "Sauvegarde..."
    
    // ne pas faire put sinon ça remplace update va rajouter cette data
    await db.entrainement.update(idWorkout, {
        note:noteWorkout
    })

    setTimeout(() => {
        buttonSave.textContent = "Sauvegardé"
    }, 650);

    setTimeout(() => {
        // remise à l'état d'origine
        buttonSave.disabled = false
        buttonSave.textContent = "Sauvegarder la note"
        buttonSave.style.display = "none"
    }, 1300);

    return
}

async function initialisation() {
    // ?workout=id
    const settingURL = window.location.search // recup des parametres de l'URL de la page 

    if (settingURL) { // on vérifie qu'il y a un setting avant de faire un split
        const tableauSeparation = settingURL.split("=") // ["?workout", "id"]
        
        if (tableauSeparation.length == 2) { // vérification pour éviter d'essayer de prendre l'index 1 alors qu'il y a que l'index 0 ou alors qu'il 5 index
            idWorkout = parseInt(tableauSeparation[1]) // on recup l'id

            // recup des datas de l'entraînement
            if (idWorkout != undefined) {
                let dataWorkout = await db.entrainement.get(idWorkout) // ça renvoie un dico avec toutes les datas date, durée,...
            
                if (dataWorkout == null) { // si il n'y a pas d'entrainement avec l'id dans l'URL alors on renvoie à la page historique dentrainement pour éviter d'afficher une page vide
                    location.href = "historique_entrainement.html"
                    return
                }

                // ajout de la structure html
                afficherData(dataWorkout)

                // on donne un role au bouton
                let buttonModifier = document.getElementById("button-modifier")
                let buttonSupprimer = document.getElementById("button-supprimer") 

                let connectCSS = document.documentElement
                let recupVar = getComputedStyle(connectCSS)
                // on donne une couleur au bouton supprimer
                buttonSupprimer.style.color = recupVar.getPropertyValue("--COLOR_ACCENT")

                buttonSupprimer.addEventListener("click", async () => { // Ajout d'une "action" au bouton
                    // Demande de confirmation avant
                    if (confirm(`Supprimer l'entraînement "${dataWorkout.nom}" ?`)) {
                        await db.entrainement.delete(dataWorkout.id) // supprimer la data de la bdd
                        // retour à l'historique d'entraînement
                        window.location.href = `historique_entrainement.html`       
                    }
                })

                buttonModifier.addEventListener("click", async () => { // Ajout d'une "action" au bouton edit
                    window.location.href = `ajouter_entraînement.html?edit=${dataWorkout.id}` // mettre un parametre dans l'URL
                })
            }
            
        }
    }
    else { // si il y a pas de parametres dans l'URL on renvoie vers l'historique pour éviter d'afficher une page vide
        location.href = "historique_entrainement.html"
    }
    
    return
}

window.addEventListener("DOMContentLoaded", () => {
    initialisation()
}) 