const dicoPhraseExemple = {
    "Bienveillant": `Tu commences le sport, tu t'y remets ou alors tu es un·e passionné·e de sport ?
                    Dans tous les cas, je serai là pour t'aider à devenir meilleur·e et à t'apprendre de nouvelles choses, 
                    sauf si tu connais déjà tout ! Mon objectif ? Te motiver et toujours voir le positif même dans les moments difficiles.`,
    "Strict-Motivant": `Je suis un coach sévère, juste, mais surtout motivant. Je suis là pour te pousser à te dépasser. Comme on dit, c'est quand on est dans le dur
                    qu'on progresse réellement ! Je te challengerai au quotidien. Avec moi, tu peux être sûr·e que 
                    je te dirai les choses telles qu'elles sont ! Alors, tu es prêt·e à progresser ?`,
    "Copain": `Alors, je dois te prévenir tout de suite : mon but, c'est d'être ton pote ! Et franchement, j'ai l'impression qu'on va super bien s'entendre.
                Je m'adapte peu importe ton niveau. Mon but ? Te motiver, te dire les choses clairement et te faire voir que tu peux toujours aller un peu plus loin mais sans te
                prendre la tête, promis. Alors, prêt·e à me choisir ?!`,
    "Go-muscu": `Que tu sois là pour devenir énorme et sec·he ou juste pour ne plus avoir le souffle coupé en montant de simples escaliers. 
                Avec moi, tu vas apprendre des choses sur la muscu ! Je suis ton coach qui a toujours de l'énergie sache que
                je vois toujours le positif. En revanche, j'ai une personnalité de go-muscu comme on dit, mais bon je suis sympa !`
}

async function sauvegardePreference(buttonSave) {
    let nameCoach = document.getElementById("nom-coach").value.trim()
    let styleCoach = document.getElementById("style-coach").value
    let avatarCoach = document.getElementById("avatar-coach").value

    buttonSave.disabled=true
    buttonSave.textContent= "Sauvegarde..."

    if (nameCoach == "") {nameCoach = "JRM Coach"} // petite vérif pr stocker la bonne valeur

    try {
        await db.JRM_Coach.put({
            id: 1,
            nom: nameCoach,
            style: styleCoach,
            avatar: avatarCoach
        })

        const nameCoachInH1 = document.getElementById("briefing")
        if (nameCoachInH1) {nameCoachInH1.textContent = nameCoach}

        logoDynamique(`${avatarCoach} C'est parti !`)

        buttonSave.textContent = "Sauvegardé"
        await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 500))
    } catch(error) {
        console.log(error)
        buttonSave.textContent = "Une erreur s'est produite"
        await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))
    } finally {
        buttonSave.textContent = "Sauvegarde"
        buttonSave.disabled = false
    }
}

function changeStyle(value) {
    const zoneInterpretationJRM = document.getElementById("JRM-coach")
    if (zoneInterpretationJRM) {zoneInterpretationJRM.textContent = dicoPhraseExemple[value]}

    document.getElementById("JRM-coach").classList.remove("skeleton") // on enleve l'effet de chargement
}
function changeAvatar(avatarCoachUser, nameCoachUser) {
    if (nameCoachUser == "") {nameCoachUser="JRM Coach"}

    document.getElementById("zone-coach-avatar").textContent = avatarCoachUser
    document.getElementById("zone-coach-nom").textContent = nameCoachUser
}
function majNameCoach(nameCoachUser) {
    if (nameCoachUser == "") {nameCoachUser = "JRM Coach"}
    
    document.getElementById("zone-coach-avatar").textContent = document.getElementById("avatar-coach").value
    document.getElementById("zone-coach-nom").textContent = nameCoachUser
    document.getElementById("briefing").textContent = nameCoachUser // on met à jour le nom du coach dans le h1
}

async function init() {
    // Zone de message du JRM
    let zoneInterpretationJRM = document.getElementById("JRM-coach")

    const inputNameCoach = document.getElementById("nom-coach")
    const selectStyleCoach = document.getElementById("style-coach")
    const selectAvatarCoach = document.getElementById("avatar-coach")

    const coachUserSave = await db.JRM_Coach.get(1)
    if (coachUserSave != undefined) {
        // petite vérif -> si dans la bdd on a le nom qui est égale à "" alors on met la valeur de base
        if (coachUserSave.nom == "") {
            inputNameCoach.value = "JRM Coach"
            document.getElementById("briefing").textContent = "JRM Coach" // on met à jour le nom du coach dans le h1
        } else {
            inputNameCoach.value = coachUserSave.nom
            document.getElementById("briefing").textContent = coachUserSave.nom // on met à jour le nom du coach dans le h1
        }
        // on met le style et l'avatar correspondant
        selectStyleCoach.value = coachUserSave.style
        selectAvatarCoach.value = coachUserSave.avatar

        // on met à jour l'interface
        document.getElementById("zone-coach-avatar").textContent = coachUserSave.avatar
        document.getElementById("zone-coach-nom").textContent = coachUserSave.nom
        zoneInterpretationJRM.textContent = dicoPhraseExemple[coachUserSave.style]
    } else {
        zoneInterpretationJRM.textContent = dicoPhraseExemple["Bienveillant"]
    }

    zoneInterpretationJRM.classList.remove("skeleton")
}

async function reinitialisation(buttonReinitialisation) {
    // Demande de confirmation avant
    if (confirm("Êtes-vous sur de vouloir réinitialiser votre coach ?")) {
        buttonReinitialisation.disabled = true
        buttonReinitialisation.textContent = "Réinitialisation..."

        try {
            db.JRM_Coach.clear() // on supprime les datas de la database

            // on remet tout de base sur la page premierement les input
            document.getElementById("briefing").textContent = "JRM Coach"
            document.getElementById("nom-coach").value = ""
            document.getElementById("style-coach").value = "Bienveillant"
            document.getElementById("avatar-coach").value = ""
            document.getElementById("zone-coach-nom").textContent = "JRM Coach"
            document.getElementById("zone-coach-avatar").textContent = ""
            document.getElementById("JRM-coach").textContent = dicoPhraseExemple["Bienveillant"]

            buttonReinitialisation.textContent = "Réinitialisé"
            await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 500))
        } catch(error) {
            console.log(error)
            buttonRestoration.textContent = "Une erreur s'est produite"
            await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))
        } finally {
            buttonReinitialisation.textContent = "Réinitialiser votre coach"
            buttonReinitialisation.disabled = false
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const inputNomDuCoach = document.getElementById("nom-coach")
    if (inputNomDuCoach) {inputNomDuCoach.addEventListener("input", (event) => {majNameCoach(event.target.value)})}

    const selectStyleCoach = document.getElementById("style-coach")
    if (selectStyleCoach) {selectStyleCoach.addEventListener("change", (event) => {changeStyle(event.target.value)})}

    const selectAvatarCoach = document.getElementById("avatar-coach")
    if (selectAvatarCoach) {selectAvatarCoach.addEventListener("change", (event) => {changeAvatar(event.target.value, inputNomDuCoach.value)})}

    const buttonSave = document.getElementById("button-save")
    if (buttonSave) {buttonSave.addEventListener("click", function() {sauvegardePreference(buttonSave)})}

    const buttonReinitialisation = document.getElementById("reinitialiser")
    if (buttonReinitialisation) {buttonReinitialisation.addEventListener("click", function(){reinitialisation(buttonReinitialisation)})}

    init()

    // pour détecter si lorsqu'on est dans le formulaire il y a un appuie sur la touche entrée
    let formKeyEntry = document.querySelector(".form")
    formKeyEntry.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            sauvegardePreference(document.getElementById("button-save"))
        }
    })
})