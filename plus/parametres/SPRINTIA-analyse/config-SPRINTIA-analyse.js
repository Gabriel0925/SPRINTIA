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
    const styleCoach = convertisseurIdName[item.id]

    // enregistrement dans la bdd
    try {
        await db.JRM_Coach.put({
            id:1,
            style: styleCoach
        })
    } catch(error) {
        console.log(error)
        alert("Une erreur s'est produite lors de l'enregistrement du style de votre coach !")
        await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))
    }

    // maintenant on change la valeur des variables de SPRINTIA Briefing
    
}

function favoriteIA(idElement) {
    let eltSelected = document.querySelectorAll(".choice-item.selected")
    let eltNow = document.getElementById(idElement)

    if (eltSelected.length > 0) { // si un élément est déjà séléctionné
        eltSelected[0].classList.remove("selected")
    }
    if (eltNow) {
        eltNow.classList.add("selected")
        localStorage.setItem("iaFavorite", idElement)
    }   
}

async function reinitialiserAnalyse(btn) {
    if (confirm("Êtes-vous sur de vouloir restaurer les paramètres par défaut de SPRINTIA Analyse ?")) {
        btn.disabled = true
        btn.textContent = "Restauration..."

        // style du coach
        try {
            await db.JRM_Coach.put({
                id:1,
                style: "Bienveillant"
            })
        } catch(error) {
            console.log(error)
            alert("Une erreur s'est produite lors de l'enregistrement du style de votre coach !")
            await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))
        }
        // on deselectionne le style du coach actif
        document.querySelector("div.card-coach.selected").classList.remove("selected")
        
        // IA préférée
        localStorage.removeItem("iaFavorite") // on supprimer de la bdd
        document.querySelector(".choice-item.selected").classList.remove("selected") // on désélectionne l'ia active

        await init() // on relance la fonction init

        btn.textContent = "Restauré"
        await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 500))
        
        btn.textContent = "Restaurer valeurs par défaut"
        btn.disabled = false
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

    // pour l'ia préférée
    let iaFavoriteUser = localStorage.getItem("iaFavorite")

    if (iaFavoriteUser != null) { // si il y a des datas
        document.getElementById(iaFavoriteUser).classList.add("selected")
    } else {
        document.getElementById("vibe").classList.add("selected")
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

    const allItemIA = document.querySelectorAll(".choice-item")
    if(allItemIA) {
        let compteurAllItem = 0
        let tableauOrdreIA = ["vibe", "gemini", "chat-gpt", "claude", "meta-ai", "perplexity", "grok", "copilot", "deepseek", "ia-locale"]

        allItemIA.forEach(element => {
            let iaAssocier = tableauOrdreIA[compteurAllItem]

            element.addEventListener("click", () => {
                favoriteIA(iaAssocier)
            })

            compteurAllItem+=1
        });
    };

    
    const buttonReinitialiser = document.getElementById("reinitialiser-analyse");
    if (buttonReinitialiser) {buttonReinitialiser.addEventListener("click", async function() {await reinitialiserAnalyse(buttonReinitialiser)});};

    init()
})