// Initialisation de la configuration de chaque thème
const configurationThemes = {
    // --- Thèmes Froids ---
    "ocean": {
        "COLOR_ACCENT": "#227eff",
        "COLOR_ACCENT_HOVER": "#4696ff",
        "COLOR_ACCENT_TEXT": "#A3C8FF"
    },
    "lune": {
        "COLOR_ACCENT": "#72a8ca",
        "COLOR_ACCENT_HOVER": "#8eb9d6",
        "COLOR_ACCENT_TEXT": "#d4eeff"
    },
    "polaire": {
        "COLOR_ACCENT": "#baf0ff",
        "COLOR_ACCENT_HOVER": "#d4f5ff",
        "COLOR_ACCENT_TEXT": "#e4f9ff"
    },
    "glacier": {
        "COLOR_ACCENT": "#1fc9eb",
        "COLOR_ACCENT_HOVER": "#45d5f0",
        "COLOR_ACCENT_TEXT": "#b6f3ff"
    }, 
    "pomme": {
        "COLOR_ACCENT": "#A4DE02",
        "COLOR_ACCENT_HOVER": "#b8e630",
        "COLOR_ACCENT_TEXT": "#e7ff9d"
    },
    "vegetation": {
        "COLOR_ACCENT": "#0acd62",
        "COLOR_ACCENT_HOVER": "#2fe17f",
        "COLOR_ACCENT_TEXT": "#acffd1"
    },
    "sapin": {
        "COLOR_ACCENT": "#78b67d",
        "COLOR_ACCENT_HOVER": "#92c797",
        "COLOR_ACCENT_TEXT": "#CAE2CB"
    },
    "menthe": {
        "COLOR_ACCENT": "#07d3b5",
        "COLOR_ACCENT_HOVER": "#2fe1ca",
        "COLOR_ACCENT_TEXT": "#adf9ee"
    },
    "indigo": {
        "COLOR_ACCENT": "#837dfc",
        "COLOR_ACCENT_HOVER": "#8e88ff",
        "COLOR_ACCENT_TEXT": "#bab8e5"
    },
    "lavande": {
        "COLOR_ACCENT": "#B266F9",
        "COLOR_ACCENT_HOVER": "#c283fa",
        "COLOR_ACCENT_TEXT": "#DAB8F9"
    },
    "lilas": {
        "COLOR_ACCENT": "#B19CD9",
        "COLOR_ACCENT_HOVER": "#c3b2e3",
        "COLOR_ACCENT_TEXT": "#e4d6ff"
    },

    // --- Thèmes Chauds ---
    "ambre": {
        "COLOR_ACCENT": "#ff7b00",
        "COLOR_ACCENT_HOVER": "#ff8e25",
        "COLOR_ACCENT_TEXT": "#ffbd7f"
    },
    "feu": {
        "COLOR_ACCENT": "#ffa51e",
        "COLOR_ACCENT_HOVER": "#ffb847",
        "COLOR_ACCENT_TEXT": "#ffd493"
    },
    "corail": {
        "COLOR_ACCENT": "#FF8559",
        "COLOR_ACCENT_HOVER": "#ff9d79",
        "COLOR_ACCENT_TEXT": "#ffc4af"
    },
    "carmin": {
        "COLOR_ACCENT": "#FF5257",
        "COLOR_ACCENT_HOVER": "#ff7074",
        "COLOR_ACCENT_TEXT": "#FFB3B5"
    },
    "peche": {
        "COLOR_ACCENT": "#FF9A9E",
        "COLOR_ACCENT_HOVER": "#ffb0b3",
        "COLOR_ACCENT_TEXT": "#ffd4d6"
    },
    "citron": {
        "COLOR_ACCENT": "#faf43a",
        "COLOR_ACCENT_HOVER": "#fbf65f",
        "COLOR_ACCENT_TEXT": "#fffdc4"
    },
    "framboise": {
        "COLOR_ACCENT": "#f26997",
        "COLOR_ACCENT_HOVER": "#f585aa",
        "COLOR_ACCENT_TEXT": "#ffb2cc"
    },
    "fuchsia": {
        "COLOR_ACCENT": "#FA6BFA",
        "COLOR_ACCENT_HOVER": "#fb87fb",
        "COLOR_ACCENT_TEXT": "#fec4fe"
    },
    "guimauve": {
        "COLOR_ACCENT": "#e4abe4",
        "COLOR_ACCENT_HOVER": "#ecbdec",
        "COLOR_ACCENT_TEXT": "#ffe0ff"
    },

    // --- Thèmes Neutres ---
    "nuage": {
        "COLOR_ACCENT": "#ffffd3",
        "COLOR_ACCENT_HOVER": "#ffffee",
        "COLOR_ACCENT_TEXT": "#fffff6"
    }
}
// init variable
let theme = "azur"

function selectedElement(idElement) {
    if (idElement) { 
        document.querySelector(".option-color.selected").classList.remove("selected")
        document.getElementById(idElement).classList.add("selected")
    }
}

function colorTheme(theme, idElement) {
    if (theme == "azur") { // si c'est le thème de base alors on réinitialise les variables
        document.documentElement.style.removeProperty("--COLOR_ACCENT")
        document.documentElement.style.removeProperty("--COLOR_ACCENT_HOVER")
        document.documentElement.style.removeProperty("--COLOR_ACCENT_TEXT")
    } else {
        // on met à jour les variables
        document.documentElement.style.setProperty("--COLOR_ACCENT", configurationThemes[theme]["COLOR_ACCENT"])
        document.documentElement.style.setProperty("--COLOR_ACCENT_HOVER", configurationThemes[theme]["COLOR_ACCENT_HOVER"])
        document.documentElement.style.setProperty("--COLOR_ACCENT_TEXT", configurationThemes[theme]["COLOR_ACCENT_TEXT"])
    }
    // maj dans la "BDD"
    localStorage.setItem("themeUser", theme) 

    // maj de l'élément séléctionné
    if (idElement && idElement != null) {
        selectedElement(idElement)
    }

    return
}

// !!! Si chamgement de nom de fonction préférence ne pas oublier de modifier le nom de fonction dans script_save_restoration et autre par, utilise la recherche global
function preferenceUser() {
    // Chercher les valeur dans la bdd
    const themeUserChoose = localStorage.getItem("themeUser") || undefined
    if (themeUserChoose != undefined) {
        colorTheme(themeUserChoose, null) // on met l'id du li du thème en null pour pas que la fonction selectedElement mettent à jour le li du thème en buggant
    } else {
        colorTheme("azur", null)
    }
}

// ne pas mettre en addevenlister sinon on perd en perf
preferenceUser() // on change les couleurs de la page web ou le user navigue