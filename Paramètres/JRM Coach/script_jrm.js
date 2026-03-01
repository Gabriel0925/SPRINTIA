// Initialisation
const DicoPhraseExemple = {
    "Bienveillant": `Tu commences le sport, tu t'y remets ou alors tu es un·e passionné·e de sport ?
                    Dans tous les cas, je serai là pour t'aider à devenir meilleur·e et à t'apprendre de nouvelles choses, 
                    sauf si tu connais déjà tout ! Mon objectif ? Te motiver et toujours voir le positif même dans les moments difficiles.`,
    "Strict-Motivant": `Je suis un coach sévère, juste, mais surtout motivant. Je suis là pour te pousser à te dépasser. Comme on dit, c'est quand on est dans le dur
                    qu'on progresse réellement ! Je te challengerai au quotidien. Avec moi, tu peux être sûr·e que 
                    je te dirai les choses telles qu'elles sont ! Alors, tu es prêt·e à progresser ?`,
    "Copain": `Alors, je dois te prévenir tout de suite : mon but, c'est d'être ton pote ! Et franchement, j’ai l’impression qu’on va super bien s’entendre.
                Je m’adapte peu importe ton niveau. Mon but ? Te motiver, te dire les choses clairement et te faire voir que tu peux toujours aller un peu plus loin mais sans te
                prendre la tête, promis. Alors, prêt·e à me choisir ?!`,
    "Go-muscu": `Que tu sois là pour devenir énorme et sec·he ou juste pour ne plus avoir le souffle coupé en montant de simples escaliers. 
                Avec moi, tu vas apprendre des choses sur la muscu ! Je suis ton coach qui a toujours de l'énergie sache que
                je vois toujours le positif. En revanche, j'ai une personnalité de go-muscu comme on dit, mais bon je suis sympa !`
    }

// init pour le logo dynamique
let Timer1 = 0
let Timer2 = 0

async function SauvegardePreference() {
    // Recup datas
    let NameCoach = document.getElementById("nom-coach").value
    let StyleCoach = document.getElementById("style-coach").value
    let AvatarCoach = document.getElementById("avatar-coach").value

    // recup bouton
    let BoutonSauvegarde = document.getElementById("bouton-save")

    // Desactivation du bouton pour éviter le double clic
    BoutonSauvegarde.disabled = true
    BoutonSauvegarde.textContent = "Sauvegarde..."


    // Nettoyage des données
    if (!NameCoach) {
        NameCoach = "JRM Coach"
    }
    
    // Utilisation de put pr mettre a jour la ligne dans la BDD
    await db.JRM_Coach.put({
        id: 1,
        nom: NameCoach,
        style: StyleCoach,
        avatar: AvatarCoach
    })

    // Légère pause
    await new Promise(r => setTimeout(r, 650))

    // Remise à l'état normal
    BoutonSauvegarde.disabled = false
    BoutonSauvegarde.textContent = "Sauvegarder"

    // Changement du titre du h1
    document.getElementById("title-h1").textContent = NameCoach
    
    // timeout remis a 0 (suppresion plutot)
    clearTimeout(Timer1)
    clearTimeout(Timer2)
    document.getElementById("a-logo").classList.remove("return", "pin-message")

    // animation du dynamic logo pour message au user
    document.getElementById("a-logo").classList.add("pin-message")

    document.getElementById("a-logo").textContent = `${AvatarCoach} C'est parti 🔥`;

    Timer1 = setTimeout(() => { 
        document.getElementById("a-logo").classList.add("return") // a ré-ajoute une class pour qu'il y est une animation de retour
        document.getElementById("a-logo").textContent = "Sprintia"; // on raffiche Sprintia
    }, 2500); // on laisse le message pendant 2,5s pour que le user est le temps de le lire

    Timer2 = setTimeout(() => {
        // remise à l'état initial, on supprime les 2 class qu'on a mis dès la fin du setTimeout au dessus
        document.getElementById("a-logo").classList.remove("return")
        document.getElementById("a-logo").classList.remove("pin-message")
    }, 3100) // durée choisis à la main

    return
}

function ChangeStyle(value) {
    let ZoneJRM = document.getElementById("JRM-coach")

    if (value == "Bienveillant") {
        ZoneJRM.innerHTML = DicoPhraseExemple["Bienveillant"]
    } else if (value == "Strict-Motivant") {
        ZoneJRM.innerHTML = DicoPhraseExemple["Strict-Motivant"]
    } else if (value == "Copain") {
        ZoneJRM.innerHTML = DicoPhraseExemple["Copain"]
    } else {
        ZoneJRM.innerHTML = DicoPhraseExemple["Go-muscu"]
    }

    return
}

function ChangeAvatar(value) {
    // Recup de la zone du nom du coach
    let ZoneNameJRM = document.getElementById("NomCoach")
    let NameJRM = document.getElementById("nom-coach").value

    if (!NameJRM) { // Si il y a rien dans le champs name alors on met en variable le nom de base pour que quand ça passera dans le else le nom de base sera mis
        NameJRM = "JRM Coach"
    }

    if (value == "👨") {
        ZoneNameJRM.innerHTML = "👨" + " " + NameJRM + " :"
    } else if (value == "👩") {
        ZoneNameJRM.innerHTML = "👩" + " " + NameJRM + " :"
    } else if (value == "🥸") {
        ZoneNameJRM.innerHTML = "🥸" + " " + NameJRM + " :"
    } else if (value == "🤠") {
        ZoneNameJRM.innerHTML = "🤠" + " " + NameJRM + " :"
    } else if (value == "👴") {
        ZoneNameJRM.innerHTML = "👴" + " " + NameJRM + " :"
    } else if (value == "👵") {
        ZoneNameJRM.innerHTML = "👵" + " " + NameJRM + " :"
    } else if (value == "🤡") {
        ZoneNameJRM.innerHTML = "🤡" + " " + NameJRM + " :"
    } else if (value == "🤖") {
        ZoneNameJRM.innerHTML = "🤖" + " " + NameJRM + " :"
    } else if (value == "🥷") {
        ZoneNameJRM.innerHTML = "🥷" + " " + NameJRM + " :"
    } else if (value == "🏋️") {
        ZoneNameJRM.innerHTML = "🏋️" + " " + NameJRM + " :"
    } else if (value == "👻") {
        ZoneNameJRM.innerHTML = "👻" + " " + NameJRM + " :"
    } else if (value == "🦆") {
        ZoneNameJRM.innerHTML = "🦆" + " " + NameJRM + " :"
    } else if (value == "🦍") {
        ZoneNameJRM.innerHTML = "🦍" + " " + NameJRM + " :"
    } else if (value == "🦐") {
        ZoneNameJRM.innerHTML = "🦐" + " " + NameJRM + " :"
    } else if (value == "😺") {
        ZoneNameJRM.innerHTML = "😺" + " " + NameJRM + " :"
    } else if (value == "🐵") {
        ZoneNameJRM.innerHTML = "🐵" + " " + NameJRM + " :"
    } else if (value == "🐻") {
        ZoneNameJRM.innerHTML = "🐻" + " " + NameJRM + " :"
    } else {
        ZoneNameJRM.innerHTML = NameJRM + " :"
    }   

    return
}

function MajName(value) {
    let NameJRM = document.getElementById("NomCoach")
    let AvatarCoach = document.getElementById("avatar-coach").value

    if (value == "" || value == " ") { // Si le champs est vide alors on met JRM coach dans la box JRM Coach
        NameJRM.innerHTML = AvatarCoach + " " + "JRM Coach :"
    } else {
        NameJRM.innerHTML = AvatarCoach + " " + value + " :"
    }

    return
}

async function Initialisation() {
    // Zone de message du JRM
    let ZoneJRMBox = document.getElementById("JRM-coach")
    let ZoneNameBox = document.getElementById("NomCoach")
    // Input JRM Coach
    let InputName = document.getElementById("nom-coach")
    let InputStyle = document.getElementById("style-coach")
    let InputAvatar = document.getElementById("avatar-coach")

    // Remise à l'ancien coach
    const JRMCoachDB = await db.JRM_Coach.toArray()
    
    if (JRMCoachDB.length > 0) {
        // Recup des datas
        let TableauName = JRMCoachDB.map(elementDB => elementDB.nom)
        let TableauStyle = JRMCoachDB.map(elementDB => elementDB.style)
        let TableauAvatar = JRMCoachDB.map(elementDB => elementDB.avatar)
        console.log(TableauName[0])
        
        // vérification si c'est la valeur de base du coach alors on rajoute les ':' sinon dans la box du jrm ça affiche "JRM Coach" alors quil faudrait que ce soit écrit "JRM Coach :"
        if (TableauName[0] == "JRM Coach") {
            TableauName[0] = TableauName[0] + " :"
        }

        // Remplissage des zones
        ZoneNameBox.textContent = TableauAvatar[0] + " " + TableauName[0] + " :" // Le nom du coach
        ZoneJRMBox.innerHTML = DicoPhraseExemple[TableauStyle[0]] // Le message du coach
        
        // vérification si c'est la valeur de base on remplit pas le input donc str vide
        if (TableauName[0] == "JRM Coach :") { // "JRM Coach :" car on a modifié TableauName[0] dans le if plus haut
            TableauName[0] = ""
        }
 
        // Remplissage des inputs
        InputName.value = TableauName[0]
        InputStyle.value = TableauStyle[0]
        InputAvatar.value = TableauAvatar[0]

    } else {
        ZoneJRMBox.innerHTML = DicoPhraseExemple["Bienveillant"]
    }

    return
}

async function Reinitialisation() {
    // Demande de confirmation avant
    if (confirm("Êtes-vous sur de vouloir réinitialiser votre coach ?")) {
        let Button = document.getElementById("reinitialiser")
        // Desactivation du button
        Button.disabled = true
        Button.textContent = "Réinitialisation..."

        // Recup data dans BDD
        db.JRM_Coach.clear()

        // Légère pause
        await new Promise(r => setTimeout(r, 650))

        // on remet tout de base sur la page premierement les input
        document.getElementById("title-h1").textContent = "JRM Coach"
        document.getElementById("nom-coach").value = ""
        document.getElementById("style-coach").value = "Bienveillant"
        document.getElementById("avatar-coach").value = ""
        document.getElementById("NomCoach").innerHTML = "JRM Coach :"
        document.getElementById("JRM-coach").innerHTML = DicoPhraseExemple["Bienveillant"]

        // confirmation sauvegarde
        Button.textContent = "Réinitialisé"

        // Pause
        await new Promise(r => setTimeout(r, 650))

        // remise etat normal
        Button.textContent = "Réinitialiser votre coach"
        Button.disabled = false // Réactivation du bouton
    }

    return
}

window.addEventListener("DOMContentLoaded", () => {
    Initialisation()
})