async function affichageStyleCoach() {
    const dataCoach = await db.JRM_Coach.get(1)
    let styleCoach = "Bienveillant"
    if (dataCoach != undefined) { // si ya des données alors on change la var
        styleCoach=dataCoach.style
    }

    const allSVG = document.querySelectorAll("div.container-avatar svg")
    if (allSVG) {
        for (const elt of allSVG) {
            elt.style.display = "none"
        }
    }

    const convertisseurNameId = {
        "Bienveillant": "bienveillant",
        "Strict-Motivant": "strict-motivant",
        "Copain": "copain",
    }
    document.getElementById(convertisseurNameId[styleCoach]).style.display = "block"    
    document.querySelector(".container-avatar.skeleton").classList.remove("skeleton")
}

document.addEventListener("DOMContentLoaded", async() => {
    const buttonAnalyse = document.getElementById("button-SPRINTIA-analyse-ask")
    if (buttonAnalyse) {
        buttonAnalyse.addEventListener("click", () => {
            if (!document.getElementById('promt-user').value.trim()) {
                alert('Veuillez ajouter votre question dans le champs de texte avant de vouloir demander à une IA.')
            } else {
                windowsAnalyse('Demander à Vibe')
            }
        })
    }
    const buttonCopy = document.getElementById("copy")
    if (buttonCopy) {buttonCopy.addEventListener("click", () => {copyPrompt()})}

    await affichageStyleCoach()
})