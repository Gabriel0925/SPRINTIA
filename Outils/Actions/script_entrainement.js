const BddNomData = { // sport avec les id correspondant aux champs de datas spécifique aux sports
    "id": "id",
    "sport": "Sport",
    "date": "Date",
    "nom": "Nom",
    "duree": "Durée",
    "rpe": "RPE",
    "fc_moy": "FC moyenne",
    "fc_max": "FC maximum",
    "distance": "Distance",
    "denivele": "Dénivelé",
    "allure_moy": "Allure moyenne",
    "vitesse_moy": "Vitesse moyenne",
    "vitesse_max": "Vitesse maximum",
    "cadence_moy": "Cadence moyenne",
    "nb_pas": "Pas",
    "altitude_max": "Altitude maximum",
    "nb_coups": "Nombre de coups",
    "nb_sets": "Nombre de sets",
    "vitesse_smash": "Vitesse de smash",
    "nb_points": "Nombre de points",
    "nb_combats": "Nombre de combats",
    "nb_victoires": "Nombre de victoires",
    "nb_defaites": "Nombre de défaites",
    "nb_chutes": "Nombre de chutes",
    "score": "Score",
    "nb_services": "Nombre de services",
    "nb_smash": "Nombre de smash",
    "nb_reps": "Nombre de reps",
    "nb_series": "Nombre de séries",
    "poids_total": "Poids total",
    "coups_de_rame": "Coups de rame",
    "nb_longueurs": "Nombre de longueurs",
    "longueur_bassin": "Longueur du bassin",
    "style_danse": "Style danse",
    "nb_tours": "Nombre de tours",
    "serie_max": "Séries maximum",
    "nb_descentes": "Nombre de descentes",
    "voies_effectuees": "Voies effectuées",
    "difficulte_max": "Difficulté maximum",
    "muscles_travailles": "Muscles travaillés",
    "charge_entrainement": "Charge d'entraînement",
}

function afficherData(dataWorkout) {
    // Structure de base 
    let structureHTML = `
        <h1>${dataWorkout.nom}</h1>

        <div class="conteneur-option">
            <p class="data-essentiel"><strong>${dataWorkout.sport}</strong> · ${formatEuropeenDate(dataWorkout.date)}</p>
            <i class="fs-icon_plus" id="button-more"></i>
        </div>

        <div class="menu-button-more">
            <li id="button-modifier">Modifier</li>
            <li id="button-supprimer">Supprimer</li>
        </div>

        <div class="conteneur-cube"> 

            <div class="cube-data">
                <p class="entete">Durée</p>
                <p class="data">${dureeFormatee(dataWorkout.duree)}</p>
            </div>
    `
    
    const tableauDataNotDisplay = ["Nom", "Sport", "Date", "Durée", "id"]
    const tableauDataSeule = ["Muscles travaillés", "Style de danse", "Score", "Voies effectuées"]


    Object.entries(dataWorkout).forEach(([cle, valeur]) => {
        const nomData = BddNomData[cle]

        if (valeur != null || valeur != undefined) { // si il y a une datas en undefined ou null alors on n'affiche pas cette datas
            if (tableauDataNotDisplay.includes(nomData)) {
                // pass
            } else {
                if (tableauDataSeule.includes(nomData)) {
                    // on referme d'abord la div
                    structureHTML += `
                        </div>

                        <div class="conteneur-cube">
                            <div class="cube-data">
                                <p class="entete">${nomData}</p>
                                <p class="data">${valeur}</p>
                            </div>
                        </div>

                        <div class="conteneur-cube">
                    `

                } else {
                    structureHTML += `
                        <div class="cube-data">
                            <p class="entete">${nomData}</p>
                            <p class="data">${valeur}</p>
                        </div>
                    `
                }
            }

        }
    });

    structureHTML += `
        </div>
    `

    document.querySelector(".page-entrainement").innerHTML = structureHTML

    return
}

async function initialisation() {
    // ?workout=id
    const settingURL = window.location.search // recup des parametres de l'URL de la page 

    if (settingURL) { // on vérifie qu'il y a un setting avant de faire un split
        const tableauSeparation = settingURL.split("=") // ["?workout", "id"]
        
        if (tableauSeparation.length == 2) { // vérification pour éviter d'essayer de prendre l'index 1 alors qu'il y a que l'index 0 ou alors qu'il 5 index
            const idWorkout = parseInt(tableauSeparation[1]) // on recup l'id

            // recup des datas de l'entraînement
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
            buttonSupprimer.style.color = recupVar.getPropertyValue("--COULEUR_ACCENT")

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
else { // si il y a pas de parametres dans l'URL on renvoie vers l'historique pour éviter d'afficher une page vide
        location.href = "historique_entrainement.html"
    }
    return
}

window.addEventListener("DOMContentLoaded", () => {
    initialisation()
}) 