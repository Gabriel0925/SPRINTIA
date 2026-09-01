const constante = {"Homme":5, "Femme":-161}

function calculMB(poidsUser, tailleUser, ageUser, sexeUser) {
    // utilisation de la formule de Mifflin-St Jeor
    return Math.round((10*poidsUser)+(6.25*tailleUser)-(5*ageUser)+constante[sexeUser])
}
function runAnalyse() {
    // recup des datas
    let poidsUser = document.getElementById("poids-user").value
    let tailleUser = document.getElementById("taille-user").value
    let ageUser = parseInt(document.getElementById("age-user").value)
    let sexeUser = document.getElementById("sexe-user").value

    // vérification des champs
    if (isNaN(poidsUser)|| isNaN(tailleUser) || isNaN(ageUser)) {
        alert("Erreur de saisie : tous les champs doivent être remplis.")
        return
    }
    if (poidsUser <= 0 || tailleUser <= 0 || ageUser <= 0) {
        alert("Valeur non valide, l'âge, le poids et la taille doivent être un nombre supérieur à 0.")
        return
    }
    if (ageUser >= 120) {
        alert("Valeur non valide, l'âge doit être un nombre inférieur à 120.")
        return
    }
    if (poidsUser >= 1000) {
        alert("Valeur non valide, le poids doit être un nombre inférieur à 1000.")
        return
    }
    if (tailleUser >= 350) {
        alert("Valeur non valide, la taille doit être un nombre inférieur à 350.")
        return
    }

    // calcul du MB (Métabolisme de base)
    const mbUser = calculMB(poidsUser, tailleUser, ageUser, sexeUser)

    // affichage
    document.getElementById("resultat-mb").innerHTML = mbUser + " kcal/j"
}

document.addEventListener("DOMContentLoaded", async () => {
    const buttonCalcul = document.getElementById("button-calcul-mb")
    if (buttonCalcul) {buttonCalcul.addEventListener("click", runAnalyse)}

    await remplissageChamps(["sexe-user", "age-user","taille-user", "poids-user"])

    if (document.getElementById("taille-user").value && document.getElementById("poids-user").value && 
        document.getElementById("age-user").value) {
        document.getElementById("button-calcul-mb").click()
    }

    // pour détecter si lorsqu'on est dans le formulaire il y a un appuie sur la touche entrée
    let formKeyEntry = document.querySelector(".form")
    formKeyEntry.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            runAnalyse()
        }
    })
})