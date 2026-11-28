function chargerNewTheme(theme) {
    const dicoTheme = {
        "clair": {
            
        }
    }

    if (theme=="theme-sombre") {

    } else {

    }
}

function gereOptionList(idElt) {
    const eltSelected = document.querySelector("div.option-list.selected")
    if (eltSelected){
        eltSelected.classList.remove("selected")
    }

    const newElt = document.getElementById(idElt)
    if (newElt) {
        newElt.classList.add("selected")
    }

    // maj des couleurs
    chargerNewTheme(idElt)
}

function init() {
    gereOptionList("theme-sombre")
}

window.addEventListener("DOMContentLoaded", () => {
    const allOptionList=document.querySelectorAll("div.option-list")
    if (allOptionList.length>0) {
        for (const elt of allOptionList) {
            elt.addEventListener("click", () => {gereOptionList(elt.id)})
        }
    }

    init()
})