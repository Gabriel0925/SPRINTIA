// Initialisation de la configuration de chaque thème
const ThemeConfig = {
    "theme_carmin": ["#FF5257", "#FF8A8E"],
    "theme_fuchsia": ["#FA6BFA", "#FFA8FF"],
    "theme_lavande": ["#B266F9", "#D7A8FF"],
    "theme_vegetation": ["#0CBB5BFF", "#76E082"],
    "theme_menthe": ["#0ac3a7", "#76e8d6"],
    "theme_pierre_lune": ["#6aabd3", "#acdefd"], 
    "theme_framboise": ["#f14d84", "#ff80ab"],
    "Citron": ["#FFF700", "#fffb93"],
    "theme_peche": ["#FF9A9E", "#FAD0C4"],

    "Hortensia": ["#3a91ff", "#f782f0"], 
    "theme_plage": ["#1498e4", "#fcaf6b"],
    "Aurore": ["#a477fe", "#4ce58c"],
    "theme_feu": ["#ffb82b", "#ff782f"],
    "Muguet": ["#2e9c0f", "#d2cccc"],
    "theme_foudre": ["#4683D8", "#00D2FF"],
    "theme_glacier": ["#00d4ff", "#E0FFFF"],
    "theme_amazonie": ["#269cbc", "#7ac18b"],
    "theme_quartz_rose": ["#FEADA6", "#F5EFEF"],
    "theme_guimauve": ["#ffd1ff", "#FDFBFB"]
}
// init variable
let theme = "theme_azur"

function SelectedElement(idElement) {
    if (idElement) {
        document.querySelector(".selected").classList.remove("selected")
        document.getElementById(idElement).classList.add("selected")
    }
}

function colorTheme(theme, idElement) {
    if (theme == "theme_azur") { // si c'est le thème de base alors on réinitialise les variables
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
        localStorage.setItem("ColorActuelleUse", "theme_azur");
        localStorage.setItem("ToggleThemeComplet", "False")

        // Légère pause
        await new Promise(r => setTimeout(r, 650))

        // confirmation sauvegarde
        Button.textContent = "Réinitialisé"

        document.getElementById("toggle-theme-complet").checked = true // on désactive le toggle harmonie (valeur par défaut)

        colorTheme("theme_azur", "elem1") // lancement de la fonction pour remttre les couleurs de base et également le li correspondant en position selected (li : Azur)

        // Pause
        await new Promise(r => setTimeout(r, 650))
        
        // Desactivation du button
        Button.disabled = false
        Button.textContent = "Réinitialiser le thème"
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
        colorTheme("theme_azur", null)
    }
}

// ne pas mettre en addevenlister sinon on perd en perf
Preference() // on change les couleurs de la page web ou le user navigue