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

window.onclick = function (event) { // on track les click sur la page complete
    let TrackClickBurgerMenuButton = burgerMenuButton.contains(event.target) // pour tracker si il y a un click sur le bouton si oui = true sinon = false
    let TrackClickBurgerMenuOpen = burgerMenu.contains(event.target)
    let TrackClickButtonMore = document.getElementById("button-more")
    let TrackClickButtonInMenuMore = document.querySelector(".menu-button-more") // pour tracker si le user click sur un li dans le menu du bouton plus (ex dans entrainement : modifier,supprimer)
     
    // si dans la page il y a le bouton plus alors on regarde si cest sur lui qu'on a cliqué
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
        const menuButtonMore = document.querySelector(".menu-button-more")
        if (menuButtonMore) {
            // on referme le menu plus
            menuButtonMore.classList.remove("open")
            // pout remettre l'icone plus
            document.getElementById("button-more").classList.add("fs-icon_plus")
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
const menuButtonMore = document.querySelector(".menu-button-more")
window.addEventListener("click", (event) => {
    if (event.target.id == "button-more") {
        const menuButtonMore = document.querySelector(".menu-button-more")
        menuButtonMore.classList.toggle("open") // Ajoute la classe si elle est absente, et la supprime si elle est déjà présente.

        const isOpenMenuMore = menuButtonMore.classList.contains('open')
        event.target.classList = isOpenMenuMore ? 'fs-icon_fermer' : 'fs-icon_plus'
    }
})
window.addEventListener("scroll", () => {
    const menuButtonMore = document.querySelector(".menu-button-more")
    if (menuButtonMore) {
        // on referme le menu plus
        menuButtonMore.classList.remove("open")
        // pout remettre l'icone plus
        document.getElementById("button-more").classList.add("fs-icon_plus")
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

    return
}

const versionActuelle = "4.0.2"
let versionStockee = localStorage.getItem("VersionLocalStorage") || "4.0.0"

if (versionStockee != versionActuelle) {
    majLocalStorage(versionStockee)
}
// --- Fin mise à jour local storage ---



// --- Pour passer le format de la date en Européen ---
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
    if (heure < 1 && format != "hh:mm:ss") {  // si le parametre 'format' indique hh:mm:ss alors on va dans le else (pour la modification d'entraînement)
        result = minutesRestante.toString().padStart(2, "0") + ":" + secondeRestante.toString().padStart(2, "0")
    } else { // Sinon on affiche tous (hh:mm:ss)
        result = heure.toString().padStart(2, "0") + ":" + minutesRestante.toString().padStart(2, "0") + ":" + secondeRestante.toString().padStart(2, "0")
    }
            
    return result
}
// --- Fin du passage de la durée (min) au format 00h 00m 00s ou 00m 00s ---