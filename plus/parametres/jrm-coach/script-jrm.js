function choiceCoach(buttonCoach) {
    // on recup la personnalité du coach
    const conversionNomCoach = {
        "bienveillant": "Bienveillant",
        "strict-motivant": "Strict-Motivant",
        "copain": "Copain"
    }
    const nameCoachConvertit = conversionNomCoach[buttonCoach.name]

    // on déséléctionne l'ancien bouton et on selectionne le nouveau bouton du coach choisi
    const buttonSelected = document.querySelector("div.personnaliter-coach button.button-coach.selected")
    if (buttonSelected) {
        buttonSelected.classList.remove("selected")
        buttonSelected.textContent = "Choisir"
    }
    buttonCoach.classList.add("selected")
    buttonCoach.textContent = "Sélectionné"
}

document.addEventListener("DOMContentLoaded", () =>{
    const buttonCoach = document.querySelectorAll("div.personnaliter-coach button.button-coach")
    if (buttonCoach) {
        for (const button of buttonCoach) {
            button.addEventListener("click", () => {
                choiceCoach(button)
            })
        }
    }
})