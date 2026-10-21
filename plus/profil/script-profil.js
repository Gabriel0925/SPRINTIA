function reinitialiseUI() {
    document.getElementById("sexe-place").textContent = "--"
    document.getElementById("age-place").textContent = "--"
    document.getElementById("taille-place").textContent = "--"
    document.getElementById("poids-place").textContent = "--"
    document.getElementById("fc-repos-place").textContent = "--"
    document.getElementById("modifier-profil").textContent = "Configurer" 
}

async function remplirPlaceProfil() {
    let data = await db.profil.toArray()

    if (data.length > 0) {
        data = data[0] // on recup le dico des datas

        document.getElementById("sexe-place").textContent = data.sexe
        document.getElementById("age-place").textContent = data.age
        document.getElementById("taille-place").textContent = data.taille
        document.getElementById("poids-place").textContent = data.poids.replace(".", ",")
        document.getElementById("fc-repos-place").textContent = data.fc_repos
    } else { // on réinitialise tout les champs au moins si le user restaure son compte ça met à jour le tableau
        reinitialiseUI()
    }

    document.getElementById("sexe-place").classList.remove("skeleton")
    document.getElementById("age-place").classList.remove("skeleton")
    document.getElementById("taille-place").classList.remove("skeleton")
    document.getElementById("poids-place").classList.remove("skeleton")
    document.getElementById("fc-repos-place").classList.remove("skeleton")
}
 
async function toggleMajAuto(event) {
    let toggle = event.target
    let dataProfil = await db.profil.get(1) // on recup les données du profil
    // si il y a pas de datas on ne laisse pas la possiblité d'activer le toggle
    if (!dataProfil) {
        alert("Pour pouvoir activer ce paramètre vous devez d'abord configurer votre profil.")
        toggle.checked = true // on desactive le toggle
        return
    }
    // si le toggle est coché alors on met à jour la valeur dans le local storage sinon on la met à false
    if (toggle.checked) {localStorage.setItem("majAutoProfil", "False")}
    else {localStorage.setItem("majAutoProfil", "True")}
}

function init() {
    let majAutoProfil = localStorage.getItem("majAutoProfil") || "False" // si le user a pas config son profil alors on desactive la maj auto

    if (majAutoProfil == "True") { // si la fonction maj auto est activé alors on active le toggle
        document.getElementById("toggle-banniere").checked = false
    } else { // sinon on le désactive
        document.getElementById("toggle-banniere").checked = true
    }

    // on remplit la tableau
    remplirPlaceProfil()
}

async function supprimerProfil(button, toggleMajAutomatique) {
    if (confirm("Êtes-vous sûr de vouloir supprimer votre profil ?")) {
        button.disabled = true
        button.textContent = "Suppression..."

        try {
            // on clique sur le toggle avant de clear la db sinon ça marchera pas
            toggleMajAutomatique.click()
            localStorage.removeItem("majAutoProfil")

            await db.profil.clear() // suppression du profil dans indexed db
            reinitialiseUI()


            button.textContent = "Supprimé"
            await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 500))
        }catch(error) {
            console.log(error)
            button.textContent = "Erreur"
            await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))
        } finally {
            button.textContent = "Supprimer"
            button.disabled = false
        }

    }
}

window.addEventListener("DOMContentLoaded", () => {
    const toggleMajAutomatique = document.getElementById("toggle-banniere")
    if (toggleMajAutomatique) {toggleMajAutomatique.addEventListener("click", (event) => {toggleMajAuto(event)})}

    const containerToggleMajAutomatique = document.getElementById("container-toggle-maj-auto")
    if (containerToggleMajAutomatique) {containerToggleMajAutomatique.addEventListener("click", (event) => {
        if (event.target !== toggleMajAutomatique) { // si le clic est déjà sur le toggle pas besoin de faire un clic superficiel sur le toggle vu qu'il à déjà un event pour ça
            toggleMajAutomatique.click()
        }
    })}

    const buttonModifProfil = document.getElementById("modifier-profil")
    if (buttonModifProfil) {buttonModifProfil.addEventListener("click", () => {window.location.href = 'modification-profil.html'})}

    const buttonSupprProfil = document.getElementById("supprimer-profil")
    if (buttonSupprProfil) {buttonSupprProfil.addEventListener("click", () => {supprimerProfil(buttonSupprProfil, toggleMajAutomatique)})}

    init()
})