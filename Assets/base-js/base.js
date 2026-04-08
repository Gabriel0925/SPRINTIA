// --- Burger menu ---
// Pour gérer l'ouverture/fermeture du menu hamburger
const burgerMenuButton = document.querySelector('.burger-menu-button')
const burgerMenuButtonIcon = document.querySelector('.burger-menu-button i')
const burgerMenu = document.querySelector('.burger-menu')

burgerMenuButton.onclick = function () {
    burgerMenu.classList.toggle('open')
    const isOpen = burgerMenu.classList.contains('open')
    burgerMenuButtonIcon.classList = isOpen ? 'fs-icon_fermer' : 'fs-icon_menu'
}

window.onclick = function (event) { // on track les clicks sur la page complète
    let TrackClickBurgerMenuButton = burgerMenuButton.contains(event.target) // pour tracker si il y a un click sur le bouton si oui = true sinon = false
    let TrackClickBurgerMenuOpen = burgerMenu.contains(event.target)
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
    if (TrackClickBurgerMenuButton == false && TrackClickBurgerMenuOpen == false && TrackClickButtonMore == false && TrackClickButtonInMenuMore == false) { 
        // on referme le burgermenu
        burgerMenu.classList.remove("open")
        burgerMenuButtonIcon.classList.add("fs-icon_menu")
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
window.addEventListener("scroll", () => {
    // on referme le burgermenu
    burgerMenu.classList.remove("open")
    burgerMenuButtonIcon.classList.add("fs-icon_menu")  
})
// --- Fin burger menu ---



// --- Menu plus ---
const menuButtonMore = document.querySelector(".menu-many-action")
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



// --- Pr gérer le BFCache ---
window.addEventListener("pageshow", (event) => {
    // Pour contrer le BFCache parce qu'il mettait en cache mes anciennes pages pour éviter de les recharger mais ça causait probleme pour les thèmes
    if (event.persisted) { // event.persisted = quand la page est dans le cache
        // forcer de lancer la fonction qui charge le thème quand on fait un retour donc quand la page viens du BFCache
        user_preference()
    }
});



// --- Pour le logo dynamique ---
let Timer1 = 0
let Timer2 = 0
function logoDynamique(message) {
    clearTimeout(Timer1)
    clearTimeout(Timer2)
    // Recup du logo dynamique
    let elementLogoDynamique = document.getElementById("logo-dynamique")

    // Initialisation (Remise à 0)
    elementLogoDynamique.classList.remove("return", "pin-message")

    // Déclenchement de l'animation pour afficher le message au user
    elementLogoDynamique.classList.add("pin-message")
    // Affichage message au user
    elementLogoDynamique.textContent = message;

    Timer1 = setTimeout(() => { 
        elementLogoDynamique.classList.add("return") // a ré-ajoute la class pour que le logo dynamique retourne à sa position de base
        elementLogoDynamique.textContent = "Sprintia"; // on ré-affiche 'Sprintia' dans le logo dynamique
    }, 2500);

    Timer2 = setTimeout(() => {
        // On supprime les deux class qu'on a rajouté pour le remettre totalement à 0
        elementLogoDynamique.classList.remove("return")
        elementLogoDynamique.classList.remove("pin-message")
    }, 3100)
}



// --- Pour le grapique ---
// Initialisation de la variable du graphique pour que le code ce rappelle de l'ancien graphique "stockée" dans le BFCache 
let barChart = null // Pr éviter de superposer un graphique
async function genererGraphique(listeX, listeY) {
    // Récup les variables css
    let RootCSS = document.documentElement
    let StyleCSS = getComputedStyle(RootCSS)
    // Recup variable css
    let CouleurAccent = StyleCSS.getPropertyValue("--COLOR_ACCENT")
    let CouleurAccent2 = StyleCSS.getPropertyValue("--COLOR_ACCENT2")
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
                    backgroundColor: CouleurAccent2,
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

    return
}

const versionActuelle = "4.2"
let versionStockee = localStorage.getItem("VersionLocalStorage") || "4.0.0"

if (versionStockee != versionActuelle) {
    majLocalStorage(versionStockee)
}
// --- Fin mise à jour local storage ---



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
