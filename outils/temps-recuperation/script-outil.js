function estimationTempsRecuperation() {
    // Recup valeur des champs
    let dureeUser = document.getElementById("duree-entrainement-user").value.trim()
    let valueRpeUser = parseInt(document.querySelector(".slider progress").value)
    let profilUser = document.getElementById("methode-user").value

    // conversion de la durée en minutes
    dureeUser = conversionMinutes(dureeUser)
    if (dureeUser == null) {return}

    // Calcul intensité (utilisation de pow pr que les RPE haut soit plus amplifiées que les petits rpe)
    valueRpeUser = Math.pow(valueRpeUser, 1.5) // ex : RPE=3 alors 3**1.5

    // Vérification des champs 
    if (isNaN(dureeUser)) {
        alert("Erreur de saisie : le champ 'Durée de l'entraînement' doit être rempli.");
        return
    }
    if (dureeUser <= 0) {
        alert("Valeur non valide, la durée votre entraî. doivent être un nombre supérieur à 0.")
        return
    }

    // init d'un dico pour trouver le coef
    const dicoCoef = {"occasionnel":1.35, "regulier":0.95, "athlete":0.65}
    let coefProfil = dicoCoef[profilUser]

    // Calcul
    let charge = dureeUser*valueRpeUser
    let tempsRecup = (charge*coefProfil)/15

    // controle des valeurs pour avoir une estimation plus propre
    if (tempsRecup > 120) tempsRecup = 120

    document.querySelector(".large-zone-result-result").textContent = Math.round(tempsRecup) + " h"
}

function comboBox() {
    // Recup valeur des champs
    let dureeUser = parseInt(document.getElementById("duree-entrainement-user").value.trim())
    let valueRpeUser = parseInt(document.querySelector(".slider progress").value)

    if (!isNaN(dureeUser) || !isNaN(valueRpeUser)) {estimationTempsRecuperation()} // si les champs sont remplit on lance direct les analyses
}

document.addEventListener("DOMContentLoaded", async () => {
    const selectMethode = document.getElementById("methode-user")
    if (selectMethode) {selectMethode.addEventListener("change", comboBox)}
    
    const buttonEstimer = document.getElementById("button-estimer")
    if (buttonEstimer) {buttonEstimer.addEventListener("click", estimationTempsRecuperation)}

    let Slider = document.querySelector(".slider input")
    let Progress = document.querySelector(".slider progress")
    let Display = document.querySelector(".slider-name")
    const dicoDescriptionRPE = {
        1:["Facile", "#1fff80"], 2:["Facile", "#1fff80"], 3:["Facile", "#1fff80"],
        4:["Modéré", "#e7e625"], 5:["Modéré", "#e7e625"], 6:["Modéré", "#e7e625"],
        7:["Difficile", "#ff4b4c"], 8:["Difficile", "#ff4b4c"],
        9:["Effort maximal", "#9386f1"], 10:["Effort maximal", "#9386f1"]
    }

    Slider.addEventListener("input", function() {
        Progress.value = this.value
        Display.innerHTML = "RPE : " + "<span class='RPE'>" + String(this.value) + "</span>" + " " + "<strong>" + dicoDescriptionRPE[this.value][0] + "</strong>"
        document.querySelector(".slider-name span.RPE").style.background = dicoDescriptionRPE[String(this.value)][1]
        document.querySelector(".slider-name strong").style.color = dicoDescriptionRPE[String(this.value)][1]
    })

    // pour détecter si lorsqu'on est dans le formulaire il y a un appuie sur la touche entrée
    let formKeyEntry = document.querySelector(".form")
    formKeyEntry.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            estimationTempsRecuperation()
        }
    })
})