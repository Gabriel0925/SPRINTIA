function favoriteIA(idElement) {
    let eltSelected = document.querySelectorAll(".choice-item.selected")
    let eltNow = document.getElementById(idElement)

    if (eltSelected.length > 0) { // si un élément est déjà séléctionné
        eltSelected[0].classList.remove("selected")
    }
    if (eltNow) {
        eltNow.classList.add("selected")
        localStorage.setItem("ia-favorite", idElement)
    }
    
}

function reinitialiserFavoriteIA(btn) {
    btn.textContent = "Restauration..."
    btn.disabled = true
    
    setTimeout(() => {
        localStorage.removeItem("ia-favorite") // on supprimer de la bdd
        favoriteIA("vibe") // on appelle la fonction comme si il y avait eu un click sur l'elt vibe
        btn.textContent = "Restauré"
    }, 650);
    
    setTimeout(() => {
        btn.textContent = "Restaurer l'IA par défaut"
        btn.disabled = false
    }, 1300);
}

function restaureFavoriteIA() {
    let iaFavoriteUser = localStorage.getItem("ia-favorite")

    if (iaFavoriteUser != null) { // si il y a des datas
        document.getElementById(iaFavoriteUser).classList.add("selected")
    } else {
        document.getElementById("vibe").classList.add("selected")
    }
}

window.addEventListener("DOMContentLoaded", () => {
    restaureFavoriteIA()
})