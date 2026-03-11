function afficherData(dataWorkout) {
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

        <div class="cube-data">
            <p class="entete">RPE</p>
            <p class="data">${dataWorkout.rpe}/10</p>
        </div>

        <div class="cube-data">
            <p class="entete">Charge</p>
            <p class="data">${dataWorkout.charge_entrainement}</p>
        </div>
    `

    if (dataWorkout.sport == "Course" || dataWorkout.sport == "Vélo" || dataWorkout.sport == "Marche") {
        structureHTML += `
            <div class="cube-data">
                <p class="entete">Distance</p>
                <p class="data">${dataWorkout.distance.toString().replace(".", ",")} km</p>
            </div>
            <div class="cube-data">
                <p class="entete">Dénivelé</p>
                <p class="data">${dataWorkout.denivele} m</p>
            </div>
        `
    } else if (dataWorkout.sport == "Musculation") {
        // ici il faut utiliser une astuce on referme le conteneur-cube et on le rouvre pour que les muscles travaillés est la place nécéssaire
        // étant donné que c'est limite une description
        structureHTML += `
            </div>
            <div class="conteneur-cube">
                <div class="cube-data">
                    <p class="entete">Muscles travailles</p>
                    <p class="data">${dataWorkout.muscles_travailles}</p>
                </div>
            </div>
        `
    }

    // on referme le conteneur-cube 
    structureHTML += `</div>`


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

            // ajout de la structure html
            afficherData(dataWorkout)

            // on donne un role au bouton
            let buttonModifier = document.getElementById("button-modifier")
            let buttonSupprimer = document.getElementById("button-supprimer") 

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
    return
}

window.addEventListener("DOMContentLoaded", () => {
    initialisation()
}) 