async function animationPret(button) {
    button.classList.add("pret")
}

document.addEventListener("DOMContentLoaded", () => {
    const buttonPret = document.getElementById("start")
    if (buttonPret) {
        buttonPret.addEventListener("click", async function() {await animationPret(buttonPret);})
    }
})