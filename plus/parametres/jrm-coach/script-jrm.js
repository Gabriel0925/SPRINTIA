async function selectCoach(item) {
    // on désactive l'item qui est selected si il y en a un
    const itemSelect = document.querySelector("div.card-coach.selected")
    if (itemSelect) {
        itemSelect.classList.remove("selected")
    }

    // on select le nouveau item
    item.classList.add("selected")

    // style du coach
    const convertisseurIdName = {
        "coach-bienveillant": "Bienveillant",
        "coach-strict-motivant": "Strict-Motivant",
        "coach-copain": "Copain"
    }
    const styleCoach = convertisseurIdName[convertisseurIdName]

    // enregistrement dans la bdd
    try {
        await db.JRM_Coach.put({
            id:1,
            style: styleCoach
        })
    } catch(e) {
        console.log(error)
        alert("Une erreur s'est produite lors de l'enregistrement du style de votre coach !")
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

    const conversionNameBdd = {
        "Bienveillant": "coach-bienveillant",
        "Strict-Motivant": "coach-strict-motivant",
        "Copain": "coach-copain"
    }
    const idItem = conversionNameBdd[styleCoachUser]
    const itemSelect = document.getElementById(idItem)
    if (itemSelect) {
        itemSelect.classList.add("selected")
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const allCardCoach = document.querySelectorAll("div.card-coach")
    if (allCardCoach.length > 0 && allCardCoach) {
        for (const elt of allCardCoach) {
            elt.addEventListener("click", async() => {
                await selectCoach(elt)
            })
        }
    }

    init()
})