async function shareDataProfil(event) {
    let dataProfil = await db.profil.get(1) // on recup les données du profil
    // si il y a pas de datas on ne laisse pas la possiblité d'activer le toggle
    if (!dataProfil) {
        alert("Pour pouvoir activer ce paramètre vous devez d'abord configurer votre profil.")
        document.getElementById("toggle-partage-profil").checked = true // on desactive le toggle
        return
    }

    if (event.target.checked) {
        localStorage.setItem("shareProfilDataInPrompt", false)
    } else {
        localStorage.setItem("shareProfilDataInPrompt", true)
    }
}

async function restoreToggle() {
    let userChoice = localStorage.getItem("shareProfilDataInPrompt")

    let dataProfil = await db.profil.get(1) // on recup les données du profil
    // si il y a pas de datas on désactive le toggle
    if (!dataProfil) {
        document.getElementById("toggle-partage-profil").checked = true // on desactive le toggle
        return
    }

    if (userChoice == "false") { // si le user à désactiver la fonction
        document.getElementById("toggle-partage-profil").checked = true
    } else { // si il l'a activé (par défaut)
        document.getElementById("toggle-partage-profil").checked = false
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const togglePartageData = document.getElementById("toggle-partage-profil")
    if (togglePartageData) {togglePartageData.addEventListener("click", (event) => {shareDataProfil(event)})}

    await restoreToggle()
})