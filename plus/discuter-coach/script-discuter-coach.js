import * as webLLM from "https://esm.run/@mlc-ai/web-llm" // import du moteur de WebLLM depuis un CDN

// j'ai choisi le modèle nommé "Qwen2.5-1.5B-Instruct-q4f16_1-MLC", ce modèle est crée par Alibaba, il possède 500 millions de param soit 0.5GB à télécharger pour le user
const modelSelectionner = "Qwen2.5-1.5B-Instruct-q4f16_1-MLC" // le nom exact pour qu'on puisse le télécharger par la suite

let moteurLLM = null // init pr stocker par la suite "l'IA"

// pour télécharge le modéle sur l'appareil du user et le mettre en mémoire dans la var 'moteur LLM'
async function telechargementModele(progressionTelechargement) {
    if (moteurLLM != null) return moteurLLM // si le modele est déjà télécharger alors return pour pas le retélécharger

    // creer le moteur de l'IA (méthode imposée par la bibliothèque WebLLM)
    moteurLLM = await webLLM.CreateMLCEngine(modelSelectionner, { // cette fonction gère le téléchargement et c'est lui qui va retrouver le modele dans le cache du navigateur
        initProgressCallback: (report) => {
            if (progressionTelechargement) progressionTelechargement(report.text) // pour suivre le pourcentage de progression
        }
    })

    return moteurLLM
}

async function verifierModeleInstaller() {
    const modeleDownload = await webLLM.hasModelInCache(modelSelectionner)

    if (modeleDownload == true) {
        await telechargementModele()
    } else {
        if (confirm("Vous n'avez pas encore télécharger le modèle sur votre appareil. Voulez-vous l'installer ?")) {
            window.location.href = "../parametres/modele/modele.html"
        } else {
            return
        }
    }
}

let inputPrompt = document.getElementById("prompt-user")
let buttonEnvoyer = document.getElementById("button-envoyer")
let reponseIA = document.getElementById("reponse-ia")
async function envoyerMessageAuCoach(prompt) { // pour que le LLM fournisse une réponse
    if (moteurLLM == null) { // si la user n'a pas téléchargé le modèle ou alors que le modele n'est pas chargé sur la page alors on renvoie vers la fonction
        await verifierModeleInstaller()
    }

    // pr demander à l'IA de répondre au prompt
    const response = await moteurLLM.chat.completions.create({
        messages: prompt
    })

    return response.choices[0].message.content // return la réponse du LLM
}
async function conversationWithIA(prompt) {
    const instructionsIA = {
        role: "system",
        content: `
                    Tu es le coach sportif de SPRINTIA, une application web créée par Gabriel (17 ans). SPRINTIA aide l'utilisateur 
                    exclusivement AVANT et APRÈS son entraînement, jamais pendant. Ton rôle est de conseiller l'athlète et d'analyser ses 
                    performances comme un vrai entraîneur. Tu dois obligatoirement faire des réponses courtes, simples et directement 
                    exploitables. Ne fais pas de longues introductions.
                `
    }
    const reponse = await envoyerMessageAuCoach(
        [
            instructionsIA,
            {role: "user", content:prompt}
        ]
    )
    reponseIA.innerHTML = reponse
}
if (buttonEnvoyer) {
    buttonEnvoyer.addEventListener("click", async () => {
        const prompt = inputPrompt.value
        await conversationWithIA(prompt)
    })
}


let buttonDownload = document.getElementById("download-modele")
let etape1 = false
function majPourcentageProgression(etapeProgression) {
    if (buttonDownload) {
        // etapeProgression renvoie ça par ex : "Loading model from cache[2/8]: 97MB loaded. 36% completed, 1 secs elapsed."
        // match sert à chercher un motif dans un str grâce à une expression régulière (regex)
        // (\d+)% => d+ => d signifie "digit" donc en francais un chiffre (entre 0 et 9) et le + permet de récupérer 25% par exemple suivis d'un pourcentage
        let pourcentage = etapeProgression.match(/(\d+)%/) // ça renvoie ['24%', '24', index: 44, input: 'Loading model from cache[1/8]: 65MB loaded. 24% completed, 1 secs elapsed.', groups: undefined]

        if (pourcentage == null && etape1 == false) {pourcentage=["0%"]; etape1=true}
        else if (pourcentage == null && etape1 == true) {pourcentage=["100%"]}

        if (pourcentage[0] == "100%") {
            buttonDownload.textContent = "Téléchargé"

            setTimeout(() => {
                buttonDownload.textContent = "Télécharger (~ 500 Mo)"            
            }, 650);
            return
        }
        buttonDownload.textContent = "Téléchargement : " + pourcentage[0]
    }
}
if (buttonDownload) {
    buttonDownload.addEventListener("click", async () => {
        await telechargementModele(majPourcentageProgression) // passage de la fonction par référence
    })
}


let buttonDesintaller = document.getElementById("desinstaller-modele")
async function desinstallerModele() {
    alert("Cette fonctionnalité arrive prochainement")
    return
    // transmission de l'info au user
    buttonDesintaller.textContent = "Désinstallation..."
    buttonDesintaller.disabled = true

    // désintallation du modèle
    await webLLM.deleteModelFromCache(modelSelectionner)

    // on remet la variable du modela à null car le modele est désinstaller
    moteurLLM = null
    
    setTimeout(() => {
        buttonDesintaller.textContent = "Désinstallé"
    }, 650);
    setTimeout(() => {
        // remise etat normal
        buttonDesintaller.textContent = "Désinstaller"
        buttonDesintaller.disabled = false
    }, 1300);
}
if (buttonDesintaller) {
    buttonDesintaller.addEventListener("click", async () => {
        await desinstallerModele()
    })
}