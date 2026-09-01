function MilesKm() {
    let MilesEntry = document.getElementById("miles").value.trim().replace(",", ".")

    let Kilometres = MilesEntry*1.609
    document.getElementById("kilometres").value = Kilometres.toFixed(2)
    return
}

function KmMiles() {
    let KmEntry = document.getElementById("kilometres").value.trim().replace(",", ".")

    let Miles = KmEntry*0.621
    document.getElementById("miles").value = Miles.toFixed(2)
    return
}

document.addEventListener("DOMContentLoaded", () => {
    const inputKm = document.getElementById("kilometres")
    if (inputKm) {inputKm.addEventListener("input", KmMiles)}

    const inputMiles = document.getElementById("miles")
    if (inputMiles) {inputMiles.addEventListener("input", MilesKm)}
})