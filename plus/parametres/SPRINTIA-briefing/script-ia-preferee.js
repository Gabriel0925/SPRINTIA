function favoriteIA(idElement) {
    let eltSelected = document.querySelectorAll(".choice-item.selected")
    let eltNow = document.getElementById(idElement)

    if (eltSelected.length > 0) { // si un élément est déjà séléctionné
        eltSelected[0].classList.remove("selected")
    }
    if (eltNow) {
        eltNow.classList.add("selected")
        localStorage.setItem("iaFavorite", idElement)
    }
    
}

function reinitialiserBriefing(btn) {
    if (confirm("Êtes-vous sur de vouloir restaurer les paramètres par défaut de SPRINTIA Briefing ?")) {
        btn.textContent = "Restauration..."
        btn.disabled = true
        
        // --- IA Favorite ---
        localStorage.removeItem("iaFavorite") // on supprimer de la bdd
        favoriteIA("vibe") // on appelle la fonction comme si il y avait eu un click sur l'elt vibe

        
        // --- Personnalisation des prompts ---


        // --- Niveaux d'analyse ---
        // restauration du select en modere
        document.getElementById("niveaux-analyse-user").value = "modere"
        localStorage.removeItem("niveauAnalyseIA") // maj dans le local storage
        
        setTimeout(() => {
            btn.textContent = "Restauré"
        }, 650);
        
        setTimeout(() => {
            btn.textContent = "Restaurer l'IA par défaut"
            btn.disabled = false
        }, 1300);
    }
}

function restaureSettings() {
    // --- IA Favorite ---
    let iaFavoriteUser = localStorage.getItem("iaFavorite")

    if (iaFavoriteUser != null) { // si il y a des datas
        document.getElementById(iaFavoriteUser).classList.add("selected")
    } else {
        document.getElementById("vibe").classList.add("selected")
    }

    // --- Personnalisation des prompts ---


    // --- Niveaux d'analyse ---
    let niveauAnalyseUser = localStorage.getItem("niveauAnalyseIA")
    if (niveauAnalyseUser == null) {niveauAnalyseUser = "modere"} // par défaut c'est le niveau modere
    // restauration du select
    document.getElementById("niveaux-analyse-user").value = niveauAnalyseUser
}

window.addEventListener("DOMContentLoaded", () => {
    restaureSettings()
})