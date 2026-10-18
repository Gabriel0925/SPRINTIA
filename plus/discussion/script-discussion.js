document.addEventListener("DOMContentLoaded", () => {
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
})