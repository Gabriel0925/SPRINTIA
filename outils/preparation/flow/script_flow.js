async function animationPret(button) {
    button.classList.add("animation-button-pret")
    await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 3000))
    button.classList.add("finish")
}

document.addEventListener("DOMContentLoaded", () => {
    const buttonPret = document.getElementById("start")
    if (buttonPret) {
        buttonPret.addEventListener("click", async function() {await animationPret(buttonPret);})
    }
})