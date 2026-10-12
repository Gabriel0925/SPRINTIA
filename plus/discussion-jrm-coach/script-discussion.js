document.addEventListener("DOMContentLoaded", () => {
    const buttonBriefing = document.getElementById("button-SPRINTIA-briefing-ask")
    if (buttonBriefing) {
        buttonBriefing.addEventListener("click", () => {
            if (!document.getElementById('promt-user').value.trim()) {
                alert('Veuillez ajouter votre question dans le champs de texte avant de vouloir demander à une IA.')
            } else {
                windowsBriefing('Demander à Vibe')
            }
        })
    }
    const buttonCopy = document.getElementById("copy")
    if (buttonCopy) {buttonCopy.addEventListener("click", () => {copyPrompt()})}
})