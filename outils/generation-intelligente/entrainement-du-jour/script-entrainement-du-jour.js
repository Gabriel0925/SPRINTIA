function selectItem(elt, nameComponent) {
    let lastSelected = document.querySelector(nameComponent+".selected")
    
    if (lastSelected) {
        lastSelected.classList.remove("selected")
        if (elt) {
            elt.classList.add("selected")
        }
    }   
}

const bddSeances = {
    "course": {
        "facile": bddSeancesCourseFacile, 
        "modere": bddSeancesCourseModere, 
        "difficile": bddSeancesCourseDifficile, 
    },
    "velo": {
        "facile": bddSeancesVeloFacile, 
        "modere": bddSeancesVeloModere, 
        "difficile": bddSeancesVeloDifficile, 
    },
    "natation": {
        "facile": bddSeancesNatationFacile, 
        "modere": bddSeancesNatationModere, 
        "difficile": bddSeancesNatationDifficile, 
    }
}
async function generationWorkout() {
    let button = document.getElementById("button-generation-entrainements")
    button.disabled = true
    button.textContent = "Génération..."

    try {
        const sportChoice = document.querySelector(".sport-item.selected").id
        const dureeChoice = document.querySelector(".round-input-item.duree.selected").id
        const intensityChoice = document.querySelector(".round-input-item.intensity.selected").id

        const bddWorkout = bddSeances[sportChoice][intensityChoice] // on récupère le dico des séances qui se trouve dans le fichier 'bdd-entrainement.js'


        button.textContent = "Généré"
        await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 500))
        //window.location.href = ``
    } catch(error) {
        console.log(error)
        button.textContent = "Une erreur s'est produite"
        await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))
    } finally {
        button.textContent = "Générer des entraînements"
        button.disabled = false
    }
}