let promptForIA = undefined
const buttonFonction  = {
    "Analyser mes tendances": promptTendances,
    "Analyser ma CE": promptCE,
    "Analyser mon indulgence": promptIndulgence,
    "Analyser ma récupération": promptRecuperation
}

async function windowsBriefing(textInButton) {
    document.querySelector("section.background-SPRINTIA-briefing").style.display = "flex"
    document.querySelector("div.windows-SPRINTIA-briefing").classList.add("open")
    document.querySelector("body").classList.add("no-scroll")

    promptForIA = await buttonFonction[textInButton]()
}
function closeWindows() {
    document.querySelector("div.windows-SPRINTIA-briefing").classList.add("close")
    document.querySelector("body").classList.remove("no-scroll")

    setTimeout(() => {
        document.querySelector("section.background-SPRINTIA-briefing").style.display = "none"

        document.querySelector("div.windows-SPRINTIA-briefing").classList.remove("close")
        document.querySelector("div.windows-SPRINTIA-briefing").classList.remove("open")
    }, 150);
}

const dicoLienIA = {
    "vibe":"https://chat.mistral.ai/", "gemini":"https://gemini.google.com/", 
    "chat-gpt":"https://chatgpt.com/", "claude":"https://claude.ai/",
    "grok":"https://grok.com/", "meta-ai":"https://www.meta.ai/", 
    "deepseek":"https://chat.deepseek.com/", "copilot":"https://copilot.microsoft.com/"
}
function openIA(favoriteIA) {
    if (promptForIA != undefined) {
        navigator.clipboard.writeText(promptForIA)
        .then(() => {
            window.open(dicoLienIA[favoriteIA], '_blank') // ouverture de l'IA préféré du user
        })
        .catch(error => {
            alert("Une erreur s'est produite lors de la copie du prompt dans votre papier presse.", error)
        })

    } else {
        alert("Aucun prompt n'a été créé car SPRINTIA n'a pas assez de données pour en générer un !")
        return
    }
}

const dicoIA = {
    "vibe":"Vibe", "gemini":"Gemini", "chat-gpt":"ChatGPT", "claude":"Claude",
    "grok":"Grok", "meta-ai":"Meta AI", "deepseek":"DeepSeek", "copilot":"Copilot"
}
function nameFavoriteIA() {
    let favoriteIA = localStorage.getItem("ia-favorite")

    if (favoriteIA != null) { // si il y a des datas
        // changement du nom de l'IA dans le texte explicatif
        document.querySelector(".explanation-briefing").innerHTML = `
            SPRINTIA a généré un prompt qui contient vos données d'entaînement. <strong>En cliquant sur le bouton ci-dessous vous acceptez
            le transfert de vos données à ${dicoIA[favoriteIA]}</strong>. Vos données quitteront SPRINTIA et seront donc soumises aux conditions de ${dicoIA[favoriteIA]}.
            <a href="/plus/parametres/SPRINTIA-briefing/SPRINTIA-briefing-info.html" class="lien">En savoir plus</a>.
        `
        document.getElementById("button-open-ia").textContent = "Copier & Ouvrir " + dicoIA[favoriteIA]
        document.getElementById("button-open-ia").onclick = () => openIA(favoriteIA)
    }
}


async function coachUser() {
    let coachUserDB = await db.JRM_Coach.get(1); // si ya pas de data ça renvoie undefined
    let styleCoachUser = "Bienveillant"; // on init sur Bienveillant si le user a laisser le choix de base
    let avatarCoach = "";
    let nameCoach = "JRM Coach";

    if (coachUserDB != undefined) {
        styleCoachUser = coachUserDB.style; // attribution du coach choisi par le user à la variable nommé "styleCoachUser"

        // attribution du nom pour pouvoir l'afficher dans une autre fonction et éviter de faire une autre requete
        nameCoach = coachUserDB.nom;
        avatarCoach = coachUserDB.avatar
    };

    return JSON.stringify({"nom_coach_user": nameCoach, "avatar_coach_user": avatarCoach, "style_coach_user": styleCoachUser}, null, 2)
}

        
async function promptTendances() {
    // début du prompt
    let prompt = `Tu es le coach sportif expert de la PWA nommé SPRINTIA. Analyse les données que SPRINTIA te fournit dans ce prompt et donne à l'utilisateur :
    1. 3 insights clés sur sa performance récente.
    2. 1 conseil actionnable pour sa prochaine séance.
    3. Analyse les tendances des statistiques en comparant la semaine actuelle (les 7 derniers jours) aux semaines précédentes.

Information temporelle : Nous sommes aujourd'hui le ${createObjetDate(0)}.

Données :
            `

    // récup des données entrainement de l'utilisateur
    let historiqueData = await db.entrainement.where("date").aboveOrEqual(createObjetDate(21)).toArray()
    let nbEntrainement = historiqueData.length

    if (nbEntrainement < 5) {
        historiqueData = await db.entrainement.where("date").aboveOrEqual(createObjetDate(30)).toArray()
    } else if (nbEntrainement > 10) {
        historiqueData = await db.entrainement.where("date").aboveOrEqual(createObjetDate(14)).toArray()
    }

    if (historiqueData.length <= 0) {
        // on return undefined au moins la var prompt sera égale à undefined car il n'y pas assez de données et ça bloquera l'utilisateur d'ouvrir 
        // une IA alors qu'il n'y a pas de data
        return undefined
    }

    // ajout des données au prompt
    prompt += JSON.stringify(historiqueData, null, 2)

    // ajout du coach de l'utilisateur
    prompt += `

Voici le coach que l'utilisateur à configurer dans la PWA SPRINTIA :
            `
    prompt += await coachUser() // ajout du dico contenant le nom, l'avatar et le style du coach

    // ajout des contraintes
    prompt += `
                       
Contraintes :
    - Reprend exactement le style du coach que l'utilisateur à configurer dans SPRINTIA
    - Tutoie l'utilisateur et répond en français
    - Pose lui quelques questions à la fin de l'analyse pour continuer la discussion et renforcer ce lien entre
        toi (le coach de SPRINTIA) et l'utilisateur.`

    return prompt
}

async function promptCE() {
    // début du prompt
    let prompt = `Tu es le coach sportif expert de la PWA nommé SPRINTIA. Analyse les données que SPRINTIA te fournit dans ce prompt et apporte une vraie plus-value à l'algorithme de SPRINTIA pour aider l'utilisateur :
    1. Interprète ce que SPRINTIA a analysé mais en apportant une plus-value qu'un algorithme ne peut pas comprendre.
    2. Regarde la régularité : la charge vient-elle de séances régulières et stables, ou de gros pics soudains ?
    3. Suggère un conseil actionnable pour la prochaine séance et propose lui une type de séance a effectuer (en précisant un RPE cible cohérent avec l'état actuel de sa charge d'entraînement).

Information temporelle : Nous sommes aujourd'hui le ${createObjetDate(0)}.

Données :
            `
    let historiqueData = await db.entrainement.where("date").aboveOrEqual(createObjetDate(28)).toArray()

    if (historiqueData.length <= 0) {
        // on return undefined au moins la var prompt sera égale à undefined car il n'y pas assez de données et ça bloquera l'utilisateur d'ouvrir 
        // une IA alors qu'il n'y a pas de data
        return undefined
    }

    // ajout des données au prompt
    prompt += JSON.stringify(historiqueData, null, 2)

    // ajout de l'interpretation de SPRINTIA
    prompt += `
        
Voici ce que SPRINTIA a interpreté :
Statut : ${document.getElementById("statut-ce").textContent}
Charge aiguë (7J) : ${Number(document.getElementById("charge-7j").textContent)} CE (=charge entraînement)
Cible pour rester en statut productif : ${document.getElementById("cible-charge-7j").textContent}
Charge chronique (28J) : ${Number(document.getElementById("charge-28j").textContent)} CE
    `

    // ajout du coach de l'utilisateur
    prompt += `

Voici le coach que l'utilisateur à configurer dans la PWA SPRINTIA :
            `
    prompt += await coachUser() // ajout du dico contenant le nom, l'avatar et le style du coach

    // ajout des contraintes
    prompt += `
                       
Contraintes :
    - Reprend exactement le nom, le style du coach que l'utilisateur à configurer dans SPRINTIA
    - Tutoie l'utilisateur et répond en français
    - Pose lui quelques questions à la fin de l'analyse pour continuer la discussion et renforcer ce lien entre
        toi (le coach de SPRINTIA) et l'utilisateur.`

    return prompt
}

async function promptIndulgence() {
    // début du prompt
    let prompt = `Tu es le coach sportif expert de la PWA nommé SPRINTIA. Tu dois analyser plus profondément ce que l'algorithme nommé "Indulgence de course" de SPRINTIA ne peut pas voir ni comprendre. Ton but ? Aider l'utilisateur à gérer sa tolérence mécanique en course à pied et apporte des conseils comportementaux exclusifs : 
    1. Interprète ce que SPRINTIA a analysé mais ne te contente pas de valider la distance cible calculée par SPRINTIA, explique lui comment diviser intelligemment ce volume. Bien entendu tu adapteras ton explication en fonction du type de coureur·euse. 
    2. Explique à l'utilisateur comment ces séances influencent la fatigue musculaire globale de ses jambes, même si son kilométrage de course semble faible.
    3. N'hésite pas à prendre en compte les autres sports que l'utilisateur a pratiqué mais reste focus un maximum sur la course à pied.

Information temporelle : Nous sommes aujourd'hui le ${createObjetDate(0)}.

Données :
            `
    let historiqueData = await db.entrainement.where("date").aboveOrEqual(createObjetDate(28)).toArray()

    if (historiqueData.length <= 0) {
        // on return undefined au moins la var prompt sera égale à undefined car il n'y pas assez de données et ça bloquera l'utilisateur d'ouvrir 
        // une IA alors qu'il n'y a pas de data
        return undefined
    }

    // ajout des données au prompt
    prompt += JSON.stringify(historiqueData, null, 2)

    // ajout de l'interpretation de SPRINTIA
    const dicoTypeCoureur = {
        "occasionnel": "Occasionnel·le",
        "regulier": "Régulier·ère",
        "confirme": "Confirmé·e",
    }
    let typeCoureur = dicoTypeCoureur[localStorage.getItem("typeCoureur")]
    if (typeCoureur == null) {typeCoureur = "Occasionnel·le"}
    prompt += `
        
Voici ce que SPRINTIA a interpreté :
L'analyse du coach de SPRINTIA : ${document.getElementById("reponse-coach-indulgence").textContent}
Distance réel sur 7J : ${document.getElementById("reponse-algo-allure").textContent}
Distance hebdomadaire conseillée : ${document.getElementById("reponse-algo-indulgence").textContent}
Type de coureur·euse : ${typeCoureur}
    `

    // ajout du coach de l'utilisateur
    prompt += `

Voici le coach que l'utilisateur à configurer dans la PWA SPRINTIA :
            `
    prompt += await coachUser() // ajout du dico contenant le nom, l'avatar et le style du coach

    // ajout des contraintes
    prompt += `
                       
Contraintes :
    - Reprend exactement le nom, le style du coach que l'utilisateur à configurer dans SPRINTIA
    - Tutoie l'utilisateur et répond en français
    - Pose lui quelques questions à la fin de l'analyse pour continuer la discussion et renforcer ce lien entre
        toi (le coach de SPRINTIA) et l'utilisateur.`

    return prompt
}

async function promptRecuperation() {
    // début du prompt
    let prompt = `Tu es le coach sportif expert de la PWA nommé SPRINTIA. Tu dois analyser plus profondément ce que l'algorithme nommé "Récupération" de SPRINTIA ne peut pas voir ni comprendre. Ton but ? Aider l'utilisateur à comprendre s'il est en forme pour faire une séance d'entraînement, l'algorithme de récupération n'as accès que à la FC repos de l'utilisateur mais toi tu as accès à la FC repos et aux entraînements donc apporte un vraie plus
    1. Interprète ce que SPRINTIA a analysé mais ne te contente pas de valider ce que l'algorithme analyse va chercher plus loin dans l'analyse étant donné que tu as accès à l'historique d'entraînement.
    2. Suggére un entraînement que l'utilisateur pourrais faire en fonction des ses préférences et de sa récupération. N'hésites pas à lui conseiller du repos si il en a besoin.

Information temporelle : Nous sommes aujourd'hui le ${createObjetDate(0)}.

Données :
            `
    let historiqueData = await db.entrainement.where("date").aboveOrEqual(createObjetDate(14)).toArray()
    let historiqueRecuperationData = await db.recuperation.where("date").aboveOrEqual(createObjetDate(14)).toArray()

    if (historiqueData.length <= 0 || historiqueRecuperationData.length <= 0) {
        // on return undefined au moins la var prompt sera égale à undefined car il n'y pas assez de données et ça bloquera l'utilisateur d'ouvrir 
        // une IA alors qu'il n'y a pas de data
        return undefined
    }

    // ajout des données au prompt
    prompt += JSON.stringify(historiqueData, null, 2)
    prompt += JSON.stringify(historiqueRecuperationData, null, 2)

    // ajout de l'interpretation de SPRINTIA
    prompt += `
        
Voici ce que SPRINTIA a interpreté :
L'analyse du coach de SPRINTIA : ${document.getElementById("reponse-coach").textContent}
FC repos du jour : ${document.getElementById("fc-repos-today").textContent}
Moyenne 30J : ${document.getElementById("fc-repos-moyenne-30j").textContent}
    `

    // ajout du coach de l'utilisateur
    prompt += `

Voici le coach que l'utilisateur à configurer dans la PWA SPRINTIA :
            `
    prompt += await coachUser() // ajout du dico contenant le nom, l'avatar et le style du coach

    // ajout des contraintes
    prompt += `
                       
Contraintes :
    - Reprend exactement le nom, le style du coach que l'utilisateur à configurer dans SPRINTIA
    - Tutoie l'utilisateur et répond en français
    - Pose lui quelques questions à la fin de l'analyse pour continuer la discussion et renforcer ce lien entre
        toi (le coach de SPRINTIA) et l'utilisateur.`

    return prompt
}

window.addEventListener("DOMContentLoaded", () => {
    nameFavoriteIA()
})