function EstimationOneRep() {
    // Recup valeur des champs
    let ChargeUser = parseFloat(document.getElementById("charge-user").value.trim().replace(",", "."))
    let RepUser = parseInt(document.getElementById("rep-user").value.trim().replace(",", "."))
    let MethodeUser = document.getElementById("methode-user").value

    // Vérification des champs
    if (isNaN(ChargeUser) || isNaN(RepUser)) {
        alert("Erreur de saisie : tous les champs doivent être remplis.")
        return
    }
    if (ChargeUser <= 0 || RepUser <= 0) {
        alert("Valeur non valide, la charge et les répétitions doivent être un nombre supérieur à 0.")
        return
    }

    // Initialisation
    let Estimation1RM = 0

    // Calcul
    if (MethodeUser === "Epley") {
        Estimation1RM = ChargeUser*(1+(RepUser/30))
    } else {
        Estimation1RM = ChargeUser/(1.0278-(0.0278*RepUser))
    }

    let ResultEstimation = Estimation1RM.toFixed(1).replace(".", ",") + " kg"
    document.querySelector(".large-zone-result-result").textContent = ResultEstimation
    return
}

function MethodeChoisie() {
    let ChargeUser = parseFloat(document.getElementById("charge-user").value.trim().replace(",", "."))
    let RepUser = parseFloat(document.getElementById("rep-user").value.trim().replace(",", "."))

    if (!ChargeUser || !RepUser) {
        return
    }

    EstimationOneRep()
    return
}

document.addEventListener("DOMContentLoaded", () => {
    const buttonEstimer = document.getElementById("button-estimer")
    if (buttonEstimer) {buttonEstimer.addEventListener("click", EstimationOneRep)}

    const selectMethode = document.getElementById("methode-user")
    if (selectMethode) {selectMethode.addEventListener("change", MethodeChoisie)}

    // pour détecter si lorsqu'on est dans le formulaire il y a un appuie sur la touche entrée
    let formKeyEntry = document.querySelector(".form")
    formKeyEntry.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            EstimationOneRep()
        }
    })
})
