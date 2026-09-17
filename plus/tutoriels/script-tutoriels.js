window.addEventListener("load", () => {
    let divChargement = document.querySelector(".container-chargement")
    if (divChargement) {divChargement.classList.add("finish")}

    let mainLoading = document.querySelector("main.loading")
    if (mainLoading) {mainLoading.classList.remove("loading")}
})