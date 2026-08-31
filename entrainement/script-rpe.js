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

let ChampDate = document.getElementById("date-entrainement-user")
let DateActuelle = new Date().toISOString() // ça renvoie ça "2026-01-24T13:55:37.171Z"
// Enlever la partie qui nous interrese pas
DateActuelle = DateActuelle.split("T") // ['2026-01-24', '13:57:55.505Z']
DateActuelle = DateActuelle[0] // '2026-01-24'

ChampDate.max = DateActuelle // bloque la saisi de date dans le futur
ChampDate.value = DateActuelle