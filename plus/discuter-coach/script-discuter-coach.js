import * as webLLM from "https://esm.run/@mlc-ai/web-llm" // import du moteur de WebLLM depuis un CDN

// j'ai choisi le modèle nommé "Qwen1.5-0.5B-Chat-q4f16_1-MLC", ce modèle est crée par Alibaba, il possède 500 millions de param soit 0.5GB à télécharger pour le user
const selectedModel = "Qwen1.5-0.5B-Chat-q4f16_1-MLC" // le nom exact pour qu'on puisse le télécharger par la suite

let moteurLLM = null // init pr stocker par la suite "l'IA"

// pour télécharge le modéle sur l'appareil du user et le mettre en mémoire dans la var 'moteur LLM'
async function telechargementModele(progressionTelechargement) {
    if (moteurLLM != null) return moteurLLM // si le modele est déjà télécharger alors return pour pas le retélécharger

    // creer le moteur de l'IA (méthode imposée par la bibliothèque WebLLM)
    moteurLLM = await webLLM.CreateEngine(selectedModel, {
        initProgressCallback: (report) => {
            if (progressionTelechargement) progressionTelechargement(report.text) // pour suivre le pourcentage de progression
        }
    })

    return moteurLLM
}

async function envoyerMessageAuCoach(prompt) { // pour que le LLM fournisse une réponse
    if (moteurLLM == null) { // si la user n'a pas téléchargé le modèle alors on stop
        return false // si le modele n'est pas installé on return false
    }

    // pr demander à l'IA de répondre au prompt
    const response = await moteurLLM.chat.completions.create({
        messages: prompt
    })

    return response.choices[0].message.content // return la réponse du LLM
}
