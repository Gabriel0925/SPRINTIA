const conversionNameBddToPoints = {
    "Bienveillant": "point-bienveillant",
    "Strict-Motivant": "point-strict-motivant",
    "Copain": "point-copain"
}

async function choiceCoach(buttonCoach) {
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

    // on selectionne le nouveau point en fonction du coach
    document.querySelector("span.point.selected").classList.remove("selected")
    const nomAttributPoint = conversionNameBddToPoints[nameCoachConvertit]
    document.getElementById(nomAttributPoint).classList.add("selected")

    // enregistrement dans la bdd
    try {
        await db.JRM_Coach.put({
            id:1,
            style: nameCoachConvertit
        })
    } catch(e) {
        console.log(error)
        buttonCoach.textContent = "Erreur"
        buttonCoach.style.background = "red"
        await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))
    }
}

async function init() {
    // on regarde les datas dans la bdd
    const dataBdd = await db.JRM_Coach.get(1)
    let styleCoachUser = "Bienveillant"

    if (dataBdd != undefined) { // si ya des datas dans la bdd on modife la var
        styleCoachUser = dataBdd.style
    }

    // maintenant on convertit la valeur à l'attribut name du bouton
    const conversionNameBdd = {
        "Bienveillant": "bienveillant",
        "Strict-Motivant": "strict-motivant",
        "Copain": "copain"
    }
    const nameAttributButton = conversionNameBdd[styleCoachUser]

    const buttonCoach = document.querySelectorAll("div.personnaliter-coach button.button-coach")
    if (buttonCoach) {
        for (const button of buttonCoach) {
            // on selectionne le bouton du coach que le user avait choisi
            if (button.name == nameAttributButton) {
                button.classList.add("selected")
                button.textContent = "Sélectionné"
            }

            // on ajoute le onclick du button
            button.addEventListener("click", async () => {
                await choiceCoach(button)
            })
        }
    }

    // on selectionne le point du coach select
    const pointsCoach = document.querySelectorAll("span.point")
    if (pointsCoach) {
        for (const points of pointsCoach) {
            if (points.id == conversionNameBddToPoints[styleCoachUser]) { // le dico "conversionNameBddToPoints" est def au début du file
                document.querySelector("span.point.selected").classList.remove("selected")
                points.classList.add("selected")
            }
        }
    }
}

document.addEventListener("DOMContentLoaded",async () =>{
    await init()
})