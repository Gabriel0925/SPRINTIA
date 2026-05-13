// Initialisation de la configuration de chaque thème
const ThemeConfig = {
    "carmin": ["#FF5257", "#FFB3B5"],

    "fuchsia": ["#FA6BFA", "#fec4fe"],
    "lavande": ["#B266F9", "#DAB8F9"],

    "vegetation": ["#0acd62", "#acffd1"],
    "menthe": ["#07d3b5", "#adf9ee"],

    "lune": ["#72a8ca", "#c7ddeb"],
    "framboise": ["#f26997", "#ffcdde"],

    "citron": ["#faf43a", "#fffdc4"],
    "peche": ["#FF9A9E", "#FFD6D8"],

    "corail": ["#FF8559", "#ffc4af"],
    "ocean": ["#227eff", "#A3C8FF"],

    "guimauve": ["#e4abe4", "#ffe6ff"],
    "feu": ["#ffa51e", "#ffd493"],

    "sapin": ["#78b67d", "#CAE2CB"],
    "glacier": ["#1fc9eb", "#b6f3ff"],

    "pomme": ["#A4DE02", "#E9FEAF"],
    "lilas": ["#B19CD9", "#E8E3F3"],

    "nuage": ["#F5F5F5", "#ffffff"],
}
// init variable
let theme = "azur"

function SelectedElement(idElement) {
    if (idElement) {
        document.querySelector(".selected").classList.remove("selected")
        document.getElementById(idElement).classList.add("selected")
    }
}

function colorTheme(theme, idElement) {
    if (theme == "azur") { // si c'est le thème de base alors on réinitialise les variables
        document.documentElement.style.removeProperty("--COLOR_ACCENT")
        document.documentElement.style.removeProperty("--COLOR_ACCENT2")
    } else {
        let tableauTheme = ThemeConfig[theme] // on recherche le tableau du theme correspondant pour avoir accès au thème
        // on met à jour les variables
        document.documentElement.style.setProperty("--COLOR_ACCENT", tableauTheme[0])
        document.documentElement.style.setProperty("--COLOR_ACCENT2", tableauTheme[1])
    }
    // maj dans la "BDD"
    localStorage.setItem("ColorActuelleUse", theme) 

    // maj de l'élément séléctionné
    SelectedElement(idElement)
    return
}

async function reinitialiserTheme() { // remmettre le thème par défaut
    // Demande de confirmation avant
    if (confirm("Êtes-vous sur de vouloir réinitialiser le thème ?")) {
        let Button = document.getElementById("reinitialiser") // Recup du bouton
        // Desactivation du button
        Button.disabled = true
        Button.textContent = "Réinitialisation..."
        
        // maj des valeurs dans la base de données
        localStorage.setItem("ColorActuelleUse", "azur")

        // lancement de la fonction pour remttre les couleurs de base et également le li correspondant en position selected (li : Azur)
        colorTheme("azur", "monochromes-1")

        setTimeout(() => {
            // confirmation sauvegarde
            Button.textContent = "Réinitialisé"
        }, 650);

        setTimeout(() => {
            // Desactivation du button
            Button.disabled = false
            Button.textContent = "Réinitialiser le thème"
        }, 1300);

    }
    return
}

// !!! Si chamgement de nom de fonction préférence ne pas oublier de modifier le nom de fonction dans script_save_restoration et autre par, utilise la recherche global
function Preference() {
    // Chercher les valeur dans la bdd
    const ColorUser = localStorage.getItem("ColorActuelleUse")
    if (ColorUser) {
        colorTheme(ColorUser, null) // on met l'id du li du thème en null pour pas que la fonction SelectedElement mettent à jour le li du thème en buggant
    } else {
        colorTheme("azur", null)
    }
}

// ne pas mettre en addevenlister sinon on perd en perf
Preference() // on change les couleurs de la page web ou le user navigue