// Initialisation de la configuration de chaque thème
const configurationThemes = {
    // --- Thèmes Froids ---
    "ocean": {
        "COLOR_ACCENT": "#227eff",
        "COLOR_ACCENT_HOVER": "#FFFFFF",
        "COLOR_ACCENT_TEXT": "#A3C8FF"
    },
    "lune": {
        "COLOR_ACCENT": "#72a8ca",
        "COLOR_ACCENT_HOVER": "#FFFFFF",
        "COLOR_ACCENT_TEXT": "#c7ddeb"
    },
    "glacier": {
        "COLOR_ACCENT": "#1fc9eb",
        "COLOR_ACCENT_HOVER": "#FFFFFF",
        "COLOR_ACCENT_TEXT": "#b6f3ff"
    }, 
    "pomme": {
        "COLOR_ACCENT": "#A4DE02",
        "COLOR_ACCENT_HOVER": "#FFFFFF",
        "COLOR_ACCENT_TEXT": "#E9FEAF"
    },
    "vegetation": {
        "COLOR_ACCENT": "#0acd62",
        "COLOR_ACCENT_HOVER": "#FFFFFF",
        "COLOR_ACCENT_TEXT": "#acffd1"
    },
    "sapin": {
        "COLOR_ACCENT": "#78b67d",
        "COLOR_ACCENT_HOVER": "#FFFFFF",
        "COLOR_ACCENT_TEXT": "#CAE2CB"
    },
    "menthe": {
        "COLOR_ACCENT": "#07d3b5",
        "COLOR_ACCENT_HOVER": "#FFFFFF",
        "COLOR_ACCENT_TEXT": "#adf9ee"
    },
    "lavande": {
        "COLOR_ACCENT": "#B266F9",
        "COLOR_ACCENT_HOVER": "#FFFFFF",
        "COLOR_ACCENT_TEXT": "#DAB8F9"
    },
    "lilas": {
        "COLOR_ACCENT": "#B19CD9",
        "COLOR_ACCENT_HOVER": "#FFFFFF",
        "COLOR_ACCENT_TEXT": "#E8E3F3"
    },

    // --- Thèmes Chauds ---
    "feu": {
        "COLOR_ACCENT": "#ffa51e",
        "COLOR_ACCENT_HOVER": "#FFFFFF",
        "COLOR_ACCENT_TEXT": "#ffd493"
    },
    "corail": {
        "COLOR_ACCENT": "#FF8559",
        "COLOR_ACCENT_HOVER": "#FFFFFF",
        "COLOR_ACCENT_TEXT": "#ffc4af"
    },
    "carmin": {
        "COLOR_ACCENT": "#FF5257",
        "COLOR_ACCENT_HOVER": "#FFFFFF",
        "COLOR_ACCENT_TEXT": "#FFB3B5"
    },
    "peche": {
        "COLOR_ACCENT": "#FF9A9E",
        "COLOR_ACCENT_HOVER": "#FFFFFF",
        "COLOR_ACCENT_TEXT": "#FFD6D8"
    },
    "citron": {
        "COLOR_ACCENT": "#faf43a",
        "COLOR_ACCENT_HOVER": "#FFFFFF",
        "COLOR_ACCENT_TEXT": "#fffdc4"
    },
    "framboise": {
        "COLOR_ACCENT": "#f26997",
        "COLOR_ACCENT_HOVER": "#FFFFFF",
        "COLOR_ACCENT_TEXT": "#ffcdde"
    },
    "fuchsia": {
        "COLOR_ACCENT": "#FA6BFA",
        "COLOR_ACCENT_HOVER": "#FFFFFF",
        "COLOR_ACCENT_TEXT": "#fec4fe"
    },
    "guimauve": {
        "COLOR_ACCENT": "#e4abe4",
        "COLOR_ACCENT_HOVER": "#FFFFFF",
        "COLOR_ACCENT_TEXT": "#ffe6ff"
    },

    // --- Thèmes Neutres ---
    "nuage": {
        "COLOR_ACCENT": "#F5F5F5",
        "COLOR_ACCENT_HOVER": "#FFFFFF",
        "COLOR_ACCENT_TEXT": "#ffffff"
    }
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
        // on met à jour les variables
        document.documentElement.style.setProperty("--COLOR_ACCENT", configurationThemes[theme]["--COLOR_ACCENT"])
        document.documentElement.style.setProperty("--COLOR_ACCENT_HOVER", configurationThemes[theme]["--COLOR_ACCENT_HOVER"])
        document.documentElement.style.setProperty("--COLOR_ACCENT_TEXT", configurationThemes[theme]["--COLOR_ACCENT_TEXT"])
    }
    // maj dans la "BDD"
    localStorage.setItem("themeUser", theme) 

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
        localStorage.setItem("themeUser", "azur")

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
    const ColorUser = localStorage.getItem("themeUser") || undefined
    if (ColorUser != undefined) {
        colorTheme(ColorUser, null) // on met l'id du li du thème en null pour pas que la fonction SelectedElement mettent à jour le li du thème en buggant
    } else {
        colorTheme("azur", null)
    }
}

// ne pas mettre en addevenlister sinon on perd en perf
Preference() // on change les couleurs de la page web ou le user navigue