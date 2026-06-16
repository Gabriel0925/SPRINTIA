// --- Navigation pour la tab-bar ---
const dicoUrl = {
    "racine": {
        "Entraînement":  "index.html",
        "Progression":   "progression/progression.html",
        "Outils":        "outils/outils.html",
        "Plus":          "plus/plus.html"
    },
    "profondeur1": {
        "Entraînement":  "../index.html",
        "Progression":   "../progression/progression.html",
        "Outils":        "../outils/outils.html",
        "Plus":          "../plus/plus.html"
    },
    "profondeur2": {
        "Entraînement":  "../../index.html",
        "Progression":   "../../progression/progression.html",
        "Outils":        "../../outils/outils.html",
        "Plus":          "../../plus/plus.html"
    },
    "profondeur3": {
        "Entraînement":  "../../../index.html",
        "Progression":   "../../../progression/progression.html",
        "Outils":        "../../../outils/outils.html",
        "Plus":          "../../../plus/plus.html"
    },
}
function navigationLinks(elt, component, profondeur, onglet) {
    let classComponent = undefined
    if (component == "tab-bar") {classComponent = ".tab-bars-items.selected"} else {classComponent = ".header-items.selected"}

    // on change la tab bar/header sélectionné en enlevant la class "selected" à l'ancien et en l'ajoutant à celui sur lequel on a cliqué
    const eltSelected = document.querySelector(classComponent)
    eltSelected.classList.remove("selected")
    elt.classList.add("selected")

    // on renvoie vers la nouvelle url pour changer de page de tab bar
    window.location.href = dicoUrl[profondeur][onglet]
}
function selectedBFCache(ongletName) {
    const tabbarItems = document.querySelectorAll(".tab-bars-items")
    for (const elt of tabbarItems) {
        // elt.textContent renvoie "
        //        
        //        Entraînement
        //    "
        if (elt.textContent.includes(ongletName)) {elt.classList.add("selected")}
    }

    // idem mais pour le header
    const headerItems = document.querySelectorAll(".header-items")
    for (const elt of headerItems) {
        if (headerItems.textContent.includes(ongletName)) {elt.classList.add("selected")}
    }
}



// --- Pr gérer le BFCache ---
window.addEventListener("pageshow", (event) => {
    // Pour contrer le BFCache parce qu'il mettait en cache mes anciennes pages pour éviter de les recharger mais ça causait probleme pour les thèmes
    if (event.persisted) { // event.persisted = quand la page est dans le cache
        // forcer de lancer la fonction qui charge le thème quand on fait un retour donc quand la page viens du BFCache
        preferenceUser()

        // --- remettre le bon onglet selected dans la tab-bar ou le header ---
        const itemSelectedTabBar = document.querySelectorAll(".tab-bars-items")
        const itemSelectedHeader = document.querySelectorAll(".header-items")

        let compteur = 0
        for (const elt of itemSelectedTabBar) {
            // on enleve la class selected (tab-bar, header) pour la remettre sur le bon onglet par la suite
            elt.classList.remove("selected")
            itemSelectedHeader[compteur].classList.remove("selected")

            compteur+=1
        }
        const urlPage = window.location.pathname // ça renvoie par ex ça : /progression/progression.html

        if (urlPage.includes("index.html")) {selectedBFCache("Entraînement")}
        else if (urlPage.includes("progression.html")) {selectedBFCache("Progression")}
        else if (urlPage.includes("outils.html")) {selectedBFCache("Outils")}
        else {selectedBFCache("Plus")}
    }
});



// --- Menu plus ---
window.onclick = function (event) { // on track les clicks sur la page complète
    let TrackClickButtonMore = document.getElementById("button-group-button")
    let TrackClickButtonInMenuMore = document.querySelector(".menu-many-action") // pour tracker si le user click sur un li dans le menu du bouton plus
     
    // si dans la page il y a le bouton plus alors on regarde si c'est sur lui qu'on a cliqué
    if (TrackClickButtonMore && TrackClickButtonInMenuMore) {
        TrackClickButtonMore = TrackClickButtonMore.contains(event.target)
        TrackClickButtonInMenuMore = TrackClickButtonInMenuMore.contains(event.target)
    } else { // sinon on met la variable sur false pour pas que ça plante la fermeture du burger menu dans le if suivant
        TrackClickButtonMore = false
        TrackClickButtonInMenuMore = false
    }
    
    // si tu as cliqué autre part que ses 4 conditions alors on referme le menu burger et le menu plus 
    if (TrackClickButtonMore == false && TrackClickButtonInMenuMore == false) { 
        // pour le menu plus
        const menuButtonMore = document.querySelector(".menu-many-action")
        if (menuButtonMore) {
            // on referme le menu plus
            menuButtonMore.classList.remove("open")
            // pour remettre l'icone plus
            document.getElementById("button-group-button").classList.add("fs-icon_plus")
        }
    }
}
window.addEventListener("click", (event) => {
    if (event.target.id == "button-group-button") {
        const menuButtonMore = document.querySelector(".menu-many-action")
        menuButtonMore.classList.toggle("open") // Ajoute la classe si elle est absente, et la supprime si elle est déjà présente.

        const isOpenMenuMore = menuButtonMore.classList.contains('open')
        event.target.classList = isOpenMenuMore ? 'fs-icon_fermer' : 'fs-icon_plus'
    }
})
window.addEventListener("scroll", () => {
    const menuButtonMore = document.querySelector(".menu-many-action")
    if (menuButtonMore) {
        // on referme le menu plus
        menuButtonMore.classList.remove("open")
        // pour remettre l'icone plus
        document.getElementById("button-group-button").classList.add("fs-icon_plus")
    }
})
// --- Fin menu plus ---



// --- Pour le logo dynamique ---
let timer1 = 0
let timer2 = 0
function logoDynamique(message) {
    clearTimeout(timer1)
    clearTimeout(timer2)
    // // Recup du logo dynamique
    let elementLogoDynamique = document.querySelector(".logo-dynamique")

    // Initialisation (Remise à 0)
    elementLogoDynamique.classList.remove("return", "message")

    // Déclenchement de l'animation pour afficher le message au user
    elementLogoDynamique.classList.add("message")
    // Affichage message au user
    elementLogoDynamique.textContent = message;

    timer1 = setTimeout(() => { 
        elementLogoDynamique.classList.add("return") // a ré-ajoute la class pour que le logo dynamique retourne à sa position de base
    }, 2500);

    timer2 = setTimeout(() => {
        // On supprime les deux class qu'on a rajouté pour le remettre totalement à 0
        elementLogoDynamique.classList.remove("return")
        elementLogoDynamique.classList.remove("message")
    }, 3100)
}



// --- Pour le grapique ---
// Initialisation de la variable du graphique pour que le code ce rappelle de l'ancien graphique "stockée" dans le BFCache 
let barChart = null // Pr éviter de superposer un graphique
async function genererGraphiqueLine(listeX, listeY) {
    // Récup les variables css
    let RootCSS = document.documentElement
    let StyleCSS = getComputedStyle(RootCSS)
    // Recup variable css
    let CouleurAccent = StyleCSS.getPropertyValue("--COLOR_ACCENT")
    let CouleurAccentText = StyleCSS.getPropertyValue("--COLOR_ACCENT_TEXT")
    let CouleurTextPrincipal = StyleCSS.getPropertyValue("--COLOR_TEXT_PRIMARY")

    const barCanvas = document.getElementById("barCanvas")

    if (barChart) { // si il y a deja un graphique on le suppr
        barChart.destroy()
    }

    barChart = new Chart(barCanvas, {
        type:"line",
            data:{
                labels: listeX,
                datasets: [{
                    data: listeY,
                    borderColor : CouleurAccent, // Ligne des niveau couleur
                    backgroundColor: CouleurAccentText,
                    fill: true, // Pour remplir le graphique de la couleur background
                    pointRadius: 8, // Taille du point
                    pointHoverRadius: 10,
                    pointBackgroundColor: CouleurAccent,
                    pointBorderWidth: 0
                }]
                },
            options: {
                responsive: true, // Activation du responsive
                maintainAspectRatio: false, // Tres important pour responsive sur mobile
                    
                plugins: {
                    legend: {
                        display: false // Masque la legende qui sert a rien dans mon cas
                    }
                },
                    
                scales: {
                    y: { // COuleur + taille des txt sur axe des ordonnées
                        grid: {
                            display: false // pr enlever la grille sur l'axe y (et x voir plus bas)
                        },
                        ticks: {
                            color: CouleurTextPrincipal, 
                            font: {size: 13}
                        },
                        beginAtZero: true, // Pr commencer à 0
                    },
                    x: { // idem pour abscisse
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: CouleurTextPrincipal,
                            font: {size: 13}
                        }
                    }
                }
            }
    })
}
async function genererGraphiqueDoughnut(label, listePourcentage) {
    // Récup les variables css
    let RootCSS = document.documentElement
    let StyleCSS = getComputedStyle(RootCSS)
    // Recup variable css
    let colorGraph = [ // 30 couleurs car il y a 28 sports dans la version 4.2
        "#42a5f5", "#66bb6a", "#ffa726", "#ef5350", "#ab47bc",
        "#26a69a", "#ec407a", "#ffee58", "#8d6e63", "#78909c",
        "#5c6bc0", "#d4e157", "#ffca28", "#26c6da", "#9ccc65",
        "#ba68c8", "#ff7043", "#bdbdbd", "#90a4ae", "#f06292",
        "#4db6ac", "#81c784", "#a1887f", "#7986cb", "#ff8a65",
        "#4dd0e1", "#dce775", "#ffd54f", "#64b5f6", "#ffb74d"
    ]
    let CouleurTextPrincipal = StyleCSS.getPropertyValue("--COLOR_TEXT_PRIMARY")

    const barCanvas = document.getElementById("barCanvas")

    if (barChart) { // si il y a deja un graphique on le suppr
        barChart.destroy()
    }

    barChart = new Chart(barCanvas, {
        type:"doughnut",
            data:{
                labels: label,
                datasets: [{
                    data: listePourcentage,
                    borderColor: colorGraph,
                    backgroundColor: colorGraph,
                }]
                },
            options: {
                responsive: true, // Activation du responsive
                maintainAspectRatio: false, // Tres important pour responsive sur mobile
                    
                plugins: {
                    legend: {
                        display: false,
                        labels: {
                            color: CouleurTextPrincipal
                        }
                    }
                }

            }
    })
}



// --- Mise à jour local storage ---
function majLocalStorage(versionStockee) {
    // migration de 4.0.0 à 4.0.1
    if (versionStockee == "4.0.0") {
        localStorage.removeItem("ThemeActuel") // car le choix de thème clair ou sombre a été nerf
        localStorage.removeItem("DisplayConseil") // car les astuces sur la page d'accueil ont été supprimé

        let tableauOutilPin = localStorage.getItem("OutilsPin")

        if (tableauOutilPin != null) { // si il y a rien dans le local storage (=null) on ne fait rien
            tableauOutilPin = JSON.parse(tableauOutilPin) // transformation en objet js

            tableauOutilPin.forEach(element => {
                if (element == "Estimation de la transpiration") { // si dans le local storge des outil pin il y a estimation de la transpi alors on le remplace par le nouveau nom de l'outil
                    let indexElement = tableauOutilPin.indexOf(element)
                    tableauOutilPin[indexElement] = "Hydratation post-séance" // nouveau nom de l'outil
                    localStorage.setItem("OutilsPin", JSON.stringify(tableauOutilPin))
                }
            });
        }

        localStorage.setItem("VersionLocalStorage", "4.0.1")
        versionStockee = "4.0.1" // maj de la variable pour enchaine avec les futures if de nouvelle version
    }
    
    // migration de 4.0.1 à 4.0.2
    if (versionStockee == "4.0.1") {
        localStorage.removeItem("DisplayBanniere")
        localStorage.removeItem("ToggleThemeComplet")

        let tableauOutilPin = localStorage.getItem("OutilsPin")

        if (tableauOutilPin != null) { // si il y a rien dans le local storage (=null) on ne fait rien
            tableauOutilPin = JSON.parse(tableauOutilPin) // transformation en objet js
                
            // suppresion de l'outil car pas prouvé scientifiquement
            tableauOutilPin = tableauOutilPin.filter(elementfilter => elementfilter != "Estimation puissance moy. en ski")
            // suppresion de l'outil car pas prouvé scientifiquement
            tableauOutilPin = tableauOutilPin.filter(elementfilter => elementfilter != "Estimation puissance max. en course")
            
            localStorage.setItem("OutilsPin", JSON.stringify(tableauOutilPin)) // maj dans le local storage
        }

        localStorage.setItem("VersionLocalStorage", "4.0.2")
        versionStockee = "4.0.2" // maj de la variable pour enchaine avec les futures if de nouvelle version
    }
    
    // migration de 4.0.2 à 4.2
    if (versionStockee == "4.0.2") {
        let tableauOutilPin = localStorage.getItem("OutilsPin")

        if (tableauOutilPin != null) { // si il y a rien dans le local storage (=null) on ne fait rien
            tableauOutilPin = JSON.parse(tableauOutilPin) // transformation en objet js

            tableauOutilPin.forEach(element => {
                if (element == "Hydratation post-séance") { // si dans le local storge des outil pin il y a l'hydratation post-séance alors on le remplace par le nouveau nom de l'outil
                    let indexElement = tableauOutilPin.indexOf(element)
                    tableauOutilPin[indexElement] = "Hydratation" // nouveau nom de l'outil
                    localStorage.setItem("OutilsPin", JSON.stringify(tableauOutilPin))
                }
            });
        }

        localStorage.setItem("VersionLocalStorage", "4.2")
        versionStockee = "4.2" // maj de la variable pour enchaine avec les futures if de nouvelle version
    }
    
    // migration de 4.2 à 4.3
    if (versionStockee == "4.2") {
        localStorage.removeItem("StatutAnalyse")
        localStorage.removeItem("OutilsPin")

        localStorage.setItem("VersionLocalStorage", "4.3")
        versionStockee = "4.3" // maj de la variable pour enchaine avec les futures if de nouvelle version

        // maj des thèmes avec les nouveaux nom,...
        const dicoNewName = {
            "theme_azur": "azur",
            "theme_carmin": "carmin",
            "theme_fuchsia": "fuchsia",
            "theme_lavande": "lavande",
            "theme_vegetation": "vegetation",
            "theme_menthe": "menthe",
            "theme_pierre_lune": "lune",
            "theme_framboise": "framboise",
            "Citron": "citron",
            "theme_peche": "peche",
            "theme_corail": "corail",

            "Hortensia": "azur",
            "theme_plage": "azur",
            "Aurore": "lavande",
            "theme_feu": "feu",
            "Muguet": "vegetation",
            "theme_foudre": "ocean",

            "theme_glacier": "glacier",

            "theme_amazonie": "sapin",
            "theme_quartz_rose": "peche",
            
            "theme_guimauve": "guimauve",
            
            "theme_cssf": "azur",
            "theme_baies": "azur",
        }

        let themeUser = localStorage.getItem("ColorActuelleUse") || undefined
        if (themeUser != undefined) {
            // passage des anciens noms des thèmes aux nouveaux
            localStorage.setItem("themeUser", dicoNewName[themeUser])
        }
        // on supprime l'ancienne clé
        localStorage.removeItem("ColorActuelleUse")

        // on lance la fonction pour éviter un décalage
        preferenceUser()
    }

    return
}

const versionActuelle = "4.3"
let versionStockee = localStorage.getItem("VersionLocalStorage") || "4.0.0"
if (versionStockee != versionActuelle) {
    majLocalStorage(versionStockee)
}
// --- Fin mise à jour local storage ---



// --- Pour pré-remplir les champs auto. ---
async function remplissageChamps(tableauId) {
    const idInputNameInDB = {
        "sexe-user": "sexe",
        "age-user": "age",
        "taille-user": "taille",
        "poids-user": "poids",
        "fc-repos-user": "fc_repos"
    }
    const profilData = await db.profil.get(1)

    if (profilData && profilData != undefined) { // si il y a des datas
        tableauId.forEach(element => { // on parcourt le tableau des id de la page
            let input = document.getElementById(element) // on recup l'input
            let data = idInputNameInDB[element] // on passe de l'id au nom qu'il y a dans la bdd ex: age-user -> age

            if (input) { // si il y a l'input alors affiche la data qu'il y a dans la BDD
                input.value = profilData[data]
            }
        });
    }
}



// --- Pour passer le format de la date en Européen de AAAA/MM/JJ à JJ/MM/AAAA ---
function formatEuropeenDate(dateWorkout) {
    let dateEuropeen = ""

    dateWorkout = dateWorkout.split("-")
    // Inversion de la date de "2026-01-12" à "12-01-2026"
    dateEuropeen = dateWorkout[2] + "-" + dateWorkout[1] + "-" + dateWorkout[0]
    return dateEuropeen
}
// --- Fin du passage au format de la date en Européen ---



// --- Pour passer la durée (min) au format 00h 00m 00s ou 00m 00s ---
function dureeFormatee(minutes, format) {
    let heure = Math.floor(minutes/60) // Arrondi à l'entier inférieur
    let minutesRestante = Math.floor(minutes-60*heure)
    let secondeRestante = Math.floor((minutes- (heure*60) -minutesRestante)*60+0.001) // pr obtenir le reste

    // Initialisation
    let result = ""
    // Si l'heure est inférieur à 1 on affiche mm:ss pas besoin d'afficher hh:mm:ss
    if (heure < 1 && format != "hh:mm:ss") {  // si le parametre 'format' indique hh:mm:ss alors on va dans le else
        result = minutesRestante.toString().padStart(2, "0") + ":" + secondeRestante.toString().padStart(2, "0")
    } else { // Sinon on affiche tous (hh:mm:ss)
        result = heure.toString().padStart(2, "0") + ":" + minutesRestante.toString().padStart(2, "0") + ":" + secondeRestante.toString().padStart(2, "0")
    }
            
    return result
}
// --- Fin du passage de la durée (min) au format 00h 00m 00s ou 00m 00s ---



// --- Pour passer la durée (hh:mm:ss ou mm:ss) au format min ---
function conversionMinutes(DureeWorkoutUser) {
    if (DureeWorkoutUser.includes(":")) {
        let FormatDuree = DureeWorkoutUser.split(":")
        if (FormatDuree.length == 3) {
            if (FormatDuree[0].length <= 2 && FormatDuree[1].length <= 2 && FormatDuree[2].length <= 2) {
                // Extraction des heures minutes et secondes
                let heures = parseInt(FormatDuree[0])
                let minutes = parseInt(FormatDuree[1])
                let secondes = parseInt(FormatDuree[2])

                // vérification pour voir si le user n'a pas saisi une lettre
                if (isNaN(heures) || isNaN(minutes) || isNaN(secondes)) {
                    alert("Valeur non valide, vous avez saisi une lettre dans le champ durée.")
                    DureeWorkoutUser = null // on met sur null pour pouvoir savoir qu'il y a eu une erreur et qu'il faut arreter la fonction saveWorkout
                    return DureeWorkoutUser
                }

                // Vérification que le user a bien saisis les infos
                if (heures > 59 || minutes > 59 || secondes > 59) {
                    alert("Le format de la durée doit être hh:mm:ss avec hh, mm et ss inférieur à 60.")
                    DureeWorkoutUser = null // on met sur null pour pouvoir savoir qu'il y a eu une erreur et qu'il faut arreter la fonction saveWorkout
                    return DureeWorkoutUser
                }

                // Conversion de la durée en minutes
                DureeWorkoutUser = (heures*60) + minutes + (secondes/60)
                // La vérification de la durée maximum/minimum se fait dans la fonction saveWorkout
                return DureeWorkoutUser
                
            } else {
                alert("Le format de la durée doit être hh:mm:ss avec hh, mm et ss avec 2 chiffres maximum.")
                DureeWorkoutUser = null // on met sur null pour pouvoir savoir qu'il y a eu une erreur et qu'il faut arreter la fonction saveWorkout
                return DureeWorkoutUser
            }
        } else if (FormatDuree.length == 2) {

            if (FormatDuree[0].length <= 2 && FormatDuree[1].length <= 2) {
                // Extraction des minutes et secondes
                let minutes = parseInt(FormatDuree[0])
                let secondes = parseInt(FormatDuree[1])

                // vérification pour voir si le user n'a pas saisi une lettre
                if (isNaN(minutes) || isNaN(secondes)) {
                    alert("Valeur non valide, vous avez saisi une lettre dans le champ durée.")
                    DureeWorkoutUser = null // on met sur null pour pouvoir savoir qu'il y a eu une erreur et qu'il faut arreter la fonction saveWorkout
                    return DureeWorkoutUser
                }

                // Vérification que le user a bien saisis les infos
                if (minutes > 59 || secondes > 59) {
                    alert("Le format de la durée doit être mm:ss avec mm et ss inférieur à 60.")
                    DureeWorkoutUser = null // on met sur null pour pouvoir savoir qu'il y a eu une erreur et qu'il faut arreter la fonction saveWorkout
                    return DureeWorkoutUser
                }

                // Conversion de la durée en minutes
                DureeWorkoutUser = minutes + (secondes/60)
                // La vérification de la durée maximum/minimum se fait dans la fonction saveWorkout
                return DureeWorkoutUser
                
            } else {
                alert("Le format de la durée doit être mm:ss avec mm et ss avec 2 chiffres maximum.")
                DureeWorkoutUser = null // on met sur null pour pouvoir savoir qu'il y a eu une erreur et qu'il faut arreter la fonction saveWorkout
                return DureeWorkoutUser
            }
        }
        else {
            alert("Veuillez respecter le format hh:mm:ss ou mm:ss pour le champ durée.")
            DureeWorkoutUser = null // on met sur null pour pouvoir savoir qu'il y a eu une erreur et qu'il faut arreter la fonction saveWorkout
            return DureeWorkoutUser
        }
    } else {
        alert("Veuillez respecter le format hh:mm:ss ou mm:ss pour le champ durée.")
        DureeWorkoutUser = null // on met sur null pour pouvoir savoir qu'il y a eu une erreur et qu'il faut arreter la fonction saveWorkout
        return DureeWorkoutUser
    }

}
// --- Fin du passage de la durée (hh:mm:ss ou mm:ss) au format min ---


// --- Création d'un objet Date avec par exemple dateMoins7J ---
function createObjetDate(nbJourEnMoins) {
    const dateDay = new Date()

    let ObjDate = new Date()
    // pour le calcul des dates il faut les mettre en timestamp enleve le nb de j ici, ça renvoie ex: 1769014250809
    ObjDate = ObjDate.setDate(dateDay.getDate() - nbJourEnMoins)
    ObjDate = new Date(ObjDate).toISOString() // permet de recup "2026-01-21T17:13:53.151Z"
    // On prend que ce qui nous interesse donc la premiere partie
    ObjDate = ObjDate.split("T")[0] // on obtient "2026-01-21"

    return ObjDate
}
// --- Fin création d'un objet Date avec par exemple dateMoins7J ---



// --- Pour déclencher une animation pour une erreur ---
function errorInput(messageError) {
    let zoneError = document.getElementById("zone-error")
    
    zoneError.classList.add("visible")
    zoneError.innerHTML = messageError 
}
// --- fin de pou déclencher une animation pour une erreur ---


// --- Déclenchement du logo dynamique quand ya qqch de caché dans l'URL ---
function verificationURL() {
    const parametreInURL = window.location.search
    const separation = parametreInURL.split("?")
    const dicoParamUrlMessage = {
        "workoutregister":"Bien joué 🔥",
        "workoutimport":"Bien reçu 😋",
        "levelrunregister": "Impressionnant ⚡"
    }
    
    if (separation.length > 1) {
        logoDynamique(dicoParamUrlMessage[separation[1]])
    }
}
// --- Fin du déclenchement du logo dynamique quand ya qqch de caché dans l'URL ---
