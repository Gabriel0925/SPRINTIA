function selectItem(elt, nameComponent) {
    let lastSelected = document.querySelector(nameComponent+".selected")
    
    if (lastSelected) {
        lastSelected.classList.remove("selected")
        if (elt) {
            elt.classList.add("selected")
        }
    }   
}


function generateNbAleatoire(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min // formule via Gemini
}
function interfaceWorkout(selectedWorkout) {
    // --- creation des éléments ---

    // -- TITRE --
    let titleWorkout = document.createElement("h2")

    // -- ECHAUFFEMENT --
    let sectionEchauffement = document.createElement("section")
    sectionEchauffement.classList.add("echauffement-workout-day")
    let textEchauffement = document.createElement("p")
    textEchauffement.classList.add("text-echauffement")
    let timeEchauffement = document.createElement("p")
    timeEchauffement.classList.add("time-echauffement")

    // -- FRACTIONNE --
    let sectionFractionne = document.createElement("section")
    sectionFractionne.classList.add("fractionne-workout-day")
    let paragrapheRepetition = document.createElement("p")
    paragrapheRepetition.classList.add("nb-repetitions")
    let divRepetition = document.createElement("div")
    divRepetition.classList.add("container-structure")
    let paragrapheDureeRep = document.createElement("p")
    paragrapheDureeRep.classList.add("duree-repetition")
    let paragrapheDureeRecup = document.createElement("p")
    paragrapheDureeRecup.classList.add("duree-recuperation")

    // -- RETOUR AU CALME --
    let sectionRetourAuCalme = document.createElement("section")
    sectionRetourAuCalme.classList.add("echauffement-workout-day")
    sectionRetourAuCalme.classList.add("without-border")
    let textRetourAuCalme = document.createElement("p")
    textRetourAuCalme.classList.add("text-echauffement")
    let timeRetourAuCalme = document.createElement("p")
    timeRetourAuCalme.classList.add("time-echauffement")

    // -- BUTTON COROS --
    let divCenterMarge = document.createElement("div")
    divCenterMarge.classList.add("container-center-marge")
    let buttonCOROS = document.createElement("button")


    // --- remplissage des elt ---
    titleWorkout.innerHTML = selectedWorkout["title"] // titre de la séance

    // échauffement
    textEchauffement.innerHTML = "Échauffement"
    timeEchauffement.innerHTML = selectedWorkout["structure"]["echauffement"]["duree"][0] + " " + selectedWorkout["structure"]["echauffement"]["duree"][1]

    // repetition
    paragrapheRepetition.innerHTML = "Répéter " + selectedWorkout["structure"]["fractionne"]["nombre_repetitions"] + " fois"
    paragrapheDureeRep.innerHTML = selectedWorkout["structure"]["fractionne"]["duree_repetition"][0] + " " + selectedWorkout["structure"]["fractionne"]["duree_repetition"][1]
    paragrapheDureeRecup.innerHTML = selectedWorkout["structure"]["fractionne"]["duree_recuperation"][0] + " " + selectedWorkout["structure"]["fractionne"]["duree_recuperation"][1]

    // retour au calme
    textRetourAuCalme.innerHTML = "Retour au calme"
    timeRetourAuCalme.innerHTML = selectedWorkout["structure"]["retour_au_calme"]["duree"][0] + " " + selectedWorkout["structure"]["echauffement"]["duree"][1]

    // bouton COROS
    buttonCOROS.innerHTML = "Ouvrir dans COROS"
    buttonCOROS.addEventListener("click", () => {
        window.open(selectedWorkout["lien"], '_blank')  
    })

    // --- ajout sur la page ---

    // titre
    document.body.appendChild(titleWorkout)

    // echauffement
    document.body.appendChild(sectionEchauffement)
    sectionEchauffement.appendChild(textEchauffement)
    sectionEchauffement.appendChild(timeEchauffement)

    // repetition
    document.body.appendChild(sectionFractionne)
    sectionFractionne.appendChild(paragrapheRepetition)
    sectionFractionne.appendChild(divRepetition)
    divRepetition.appendChild(paragrapheDureeRep)
    divRepetition.appendChild(paragrapheDureeRecup)

    // recuperation
    document.body.appendChild(sectionRetourAuCalme)
    sectionRetourAuCalme.appendChild(textRetourAuCalme)
    sectionRetourAuCalme.appendChild(timeRetourAuCalme)

    // button COROS
    document.body.appendChild(divCenterMarge)
    divCenterMarge.appendChild(buttonCOROS)

    console.log(selectedWorkout)
}


const dicoSeances = {
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

        // on récupère le dico des séances en fonction du sport et de l'intensité (qui se trouve dans le fichier 'bdd-entrainement.js')
        const bddWorkout = dicoSeances[sportChoice][intensityChoice]
        // on recup le tableau des séances en fonction de la séances
        const tableauWorkout = bddWorkout[dureeChoice] // on trouve l'étendu des entraînements

        // on trouve un entrainement aléatoirement
        const nbAleatoire = generateNbAleatoire(0, tableauWorkout.length - 1)
        const selectedWorkout =  tableauWorkout[nbAleatoire] // recup de l'entrainement tiré au sort avec la structure de l'entrainement et le lien vers COROS

        // on enleve tout le contenu de la page
        document.querySelector(".container-item-workout-day").style.display = "none"
        document.querySelector(".container-center-marge").style.display = "none"

        // appelle à la fonction qui va générer l'interface
        interfaceWorkout(selectedWorkout)

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