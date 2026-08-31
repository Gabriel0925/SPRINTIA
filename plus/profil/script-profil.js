async function remplirPlaceProfil() {
    let data = await db.profil.toArray()

    if (data.length > 0) {
        data = data[0] // on recup le dico des datas

        document.getElementById("sexe-place").innerHTML = data.sexe
        document.getElementById("age-place").innerHTML = data.age + " <small>ans</small>"
        document.getElementById("taille-place").innerHTML = data.taille + " <small>cm</small>"
        document.getElementById("poids-place").innerHTML = data.poids.replace(".", ",") + " <small>kg</small>"
        document.getElementById("fc-repos-place").innerHTML = data.fc_repos + " <small>bpm</small>"
        document.getElementById("modifier-profil").textContent = "Modifier mon profil"
            } else { // on réinitialise tout les champs au moins si le user restaure son compte ça met à jour le tableau

        document.getElementById("sexe-place").innerHTML = "--"
        document.getElementById("age-place").innerHTML = "-- <small>ans</small>"
        document.getElementById("taille-place").innerHTML = "-- <small>cm</small>"
        document.getElementById("poids-place").innerHTML = "-- <small>kg</small>"
        document.getElementById("fc-repos-place").innerHTML = "-- <small>bpm</small>"
        document.getElementById("modifier-profil").textContent = "Configurer mon profil"
    }
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

window.addEventListener("DOMContentLoaded", () => {
    const toggleMajAutomatique = document.getElementById("toggle-banniere")
    if (toggleMajAutomatique) {toggleMajAutomatique.addEventListener("click", (event) => {toggleMajAuto(event)})}

    const buttonModifProfil = document.getElementById("modifier-profil")
    if (buttonModifProfil) {buttonModifProfil.addEventListener("click", () => {window.location.href = 'modification-profil.html'})}

    init()
})