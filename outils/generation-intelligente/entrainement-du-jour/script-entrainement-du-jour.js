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


function createUiEchauffement(instruction_echauffement, containerWorkoutGenerate) {
    // création des elt
    let sectionEchauffement = document.createElement("section")
    sectionEchauffement.classList.add("echauffement-workout-day")
    let textEchauffement = document.createElement("p")
    textEchauffement.classList.add("text-echauffement")
    let timeEchauffement = document.createElement("p")
    timeEchauffement.classList.add("time-echauffement")

    // remplissage des elt
    textEchauffement.innerHTML = "Échauffement"
    timeEchauffement.innerHTML = instruction_echauffement["duree"][0] + " " + instruction_echauffement["duree"][1]

    // ajout sur la page
    containerWorkoutGenerate.appendChild(sectionEchauffement)
    sectionEchauffement.appendChild(textEchauffement)
    sectionEchauffement.appendChild(timeEchauffement)
}
function createUiRetourAuCalme(instruction_retour_au_calme, containerWorkoutGenerate) {
    // création des elt
    let sectionRetourAuCalme = document.createElement("section")
    sectionRetourAuCalme.classList.add("echauffement-workout-day")
    sectionRetourAuCalme.classList.add("without-border")
    let textRetourAuCalme = document.createElement("p")
    textRetourAuCalme.classList.add("text-echauffement")
    let timeRetourAuCalme = document.createElement("p")
    timeRetourAuCalme.classList.add("time-echauffement")

    // remplissage des elt
    textRetourAuCalme.innerHTML = "Retour au calme"
    timeRetourAuCalme.innerHTML = instruction_retour_au_calme["duree"][0] + " " + instruction_retour_au_calme["duree"][1]

    // ajout sur la page
    containerWorkoutGenerate.appendChild(sectionRetourAuCalme)
    sectionRetourAuCalme.appendChild(textRetourAuCalme)
    sectionRetourAuCalme.appendChild(timeRetourAuCalme)
}
function createUiFractionne(instruction_fractionne, containerWorkoutGenerate) {
    if (instruction_fractionne["plusieurs_blocs"] == true) {
        let structure_blocs = instruction_fractionne["structure_blocs"]

        structure_blocs.forEach(element => {
            // création des elt
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

            // remplissage des elt
            paragrapheRepetition.innerHTML = "Répéter " + element["nombre_repetitions"] + " fois"
            paragrapheDureeRep.innerHTML = element["duree_repetition"][0] + " " + element["duree_repetition"][1]
            paragrapheDureeRecup.innerHTML = element["duree_recuperation"][0] + " " + element["duree_recuperation"][1]

            // ajout sur la page
            containerWorkoutGenerate.appendChild(sectionFractionne)
            sectionFractionne.appendChild(paragrapheRepetition)
            sectionFractionne.appendChild(divRepetition)
            divRepetition.appendChild(paragrapheDureeRep)
            divRepetition.appendChild(paragrapheDureeRecup)
        });

    } else if (instruction_fractionne["plusieurs_blocs"] == false) {
        // création des elt
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

        // remplissage des elt
        paragrapheRepetition.innerHTML = "Répéter " + instruction_fractionne["nombre_repetitions"] + " fois"
        paragrapheDureeRep.innerHTML = instruction_fractionne["duree_repetition"][0] + " " + instruction_fractionne["duree_repetition"][1]
        paragrapheDureeRecup.innerHTML = instruction_fractionne["duree_recuperation"][0] + " " + instruction_fractionne["duree_recuperation"][1]

        // ajout sur la page
        containerWorkoutGenerate.appendChild(sectionFractionne)
        sectionFractionne.appendChild(paragrapheRepetition)
        sectionFractionne.appendChild(divRepetition)
        divRepetition.appendChild(paragrapheDureeRep)
        divRepetition.appendChild(paragrapheDureeRecup)
    }
}
// function createUiRepetition(instruction_repetition, containerWorkoutGenerate) {
//     // création des elt
    
//     // remplissage des elt

//     // ajout sur la page

// }
// function createUiRecuperation(instruction_recuperation, containerWorkoutGenerate) {
//     // création des elt
    
//     // remplissage des elt

//     // ajout sur la page

// }

function interfaceWorkout(selectedWorkout, containerAllWorkout) {
    // la base du html
    let containerWorkoutGenerate = document.createElement("section")
    containerWorkoutGenerate.classList.add("container-workout-generate")
    containerAllWorkout.appendChild(containerWorkoutGenerate) // ajout du la page

    let titleWorkout = document.createElement("h2") // titre de la séance
    titleWorkout.innerHTML = selectedWorkout["title"]
    containerWorkoutGenerate.appendChild(titleWorkout) //ajout du titre dans l'interface

    let structureWorkout = selectedWorkout["structure"]
    const dicoFunctionUI = { // chaque fonction a pour but de créer l'interface
        "echauffement": createUiEchauffement,
        "fractionne": createUiFractionne,
        "retour_au_calme": createUiRetourAuCalme,
    }
    for (const eltWorkout in structureWorkout) { // eltWorkout c'est la clé du dico
        const dataForThisKey = structureWorkout[eltWorkout] // on cherche les bonnes datas dans le dico
        //console.log(eltWorkout, " / ", dataForThisKey)

        // on appelle la bonne fonction et on créer l'interface
        dicoFunctionUI[eltWorkout](dataForThisKey, containerWorkoutGenerate) // on lance la fonction avec les bons param
    }

    let buttonCOROS = document.createElement("button") // bouton Open in COROS
    buttonCOROS.innerHTML = "Ouvrir dans COROS"
    buttonCOROS.addEventListener("click", () => {
        window.open(selectedWorkout["lien"], '_blank')  
    })
    containerWorkoutGenerate.appendChild(buttonCOROS) // le bouton COROS
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

        // création d'un container qui contiendra les 3 options
        let containerAllWorkout = document.createElement("section")
        containerAllWorkout.classList.add("container-all-workout")
        document.body.appendChild(containerAllWorkout)

        for (let i=0; i<1; i++) {
            // on trouve un entrainement aléatoirement
            const nbAleatoire = generateNbAleatoire(0, tableauWorkout.length - 1)
            const selectedWorkout =  tableauWorkout[nbAleatoire] // recup de l'entrainement tiré au sort avec la structure de l'entrainement et le lien vers COROS

            if (selectedWorkout) {
                // appelle à la fonction qui va générer l'interface
                interfaceWorkout(selectedWorkout, containerAllWorkout)
            }
        }
        
        // on enleve tout le contenu de la page
        document.querySelector(".container-item-workout-day").style.display = "none"
        document.querySelector(".container-center-marge").style.display = "none"
        document.querySelector("h1").innerHTML = "Entraînements suggérés"

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