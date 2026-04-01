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
    let TrackClickButtonMore = document.getElementById("button-group-button")
    let TrackClickButtonInMenuMore = document.querySelector(".menu-button-group-button") // pour tracker si le user click sur un li dans le menu du bouton plus (ex dans entrainement : modifier,supprimer)
     
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
        const menuButtonMore = document.querySelector(".menu-button-group-button")
        if (menuButtonMore) {
            // on referme le menu plus
            menuButtonMore.classList.remove("open")
            // pout remettre l'icone plus
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
const menuButtonMore = document.querySelector(".menu-button-group-button")
window.addEventListener("click", (event) => {
    if (event.target.id == "button-group-button") {
        const menuButtonMore = document.querySelector(".menu-button-group-button")
        menuButtonMore.classList.toggle("open") // Ajoute la classe si elle est absente, et la supprime si elle est déjà présente.

        const isOpenMenuMore = menuButtonMore.classList.contains('open')
        event.target.classList = isOpenMenuMore ? 'fs-icon_fermer' : 'fs-icon_plus'
    }
})
window.addEventListener("scroll", () => {
    const menuButtonMore = document.querySelector(".menu-button-group-button")
    if (menuButtonMore) {
        // on referme le menu plus
        menuButtonMore.classList.remove("open")
        // pout remettre l'icone plus
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
    // timeout remis a 0 (suppresion plutot)
    clearTimeout(Timer1)
    clearTimeout(Timer2)
    document.getElementById("logo-dynamique").classList.remove("return", "pin-message")

    // animation du dynamic logo pour message au user
    document.getElementById("logo-dynamique").classList.add("pin-message")

    document.getElementById("logo-dynamique").textContent = message;

    Timer1 = setTimeout(() => { 
        document.getElementById("logo-dynamique").classList.add("return") // a ré-ajoute une class pour qu'il y est une animation de retour
        document.getElementById("logo-dynamique").textContent = "Sprintia"; // on raffiche Sprintia
    }, 2500); // on laisse le message pendant 2,5s pour que le user est le temps de le lire

    Timer2 = setTimeout(() => {
        // remise à l'état initial, on supprime les 2 class qu'on a mis dès la fin du setTimeout au dessus
        document.getElementById("logo-dynamique").classList.remove("return")
        document.getElementById("logo-dynamique").classList.remove("pin-message")
    }, 3100) // durée choisis à la main
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
