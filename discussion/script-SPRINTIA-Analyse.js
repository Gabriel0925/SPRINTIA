// Init Variable Globale
const dicoIA = {
    "vibe":"Vibe", "gemini":"Gemini", "chat-gpt":"ChatGPT", "claude":"Claude",
    "grok":"Grok", "meta-ai":"Meta AI", "deepseek":"DeepSeek", "copilot":"Copilot",
    "perplexity": "Perplexity", 
    "ia-locale": "l'IA locale de votre choix" // on le met quand meme dans le dico pour : ".explanation-analyse"
}
const dicoLienIA = {
    "Vibe":"https://chat.mistral.ai/", "Gemini":"https://gemini.google.com/", 
    "ChatGPT":"https://chatgpt.com/", "Claude":"https://claude.ai/",
    "Grok":"https://grok.com/", "Meta AI":"https://www.meta.ai/", 
    "DeepSeek":"https://chat.deepseek.com/", "Copilot":"https://copilot.microsoft.com/",
    "Perplexity": "https://www.perplexity.ai/"
}
const dicoStyleCoach = {
    "Bienveillant": "Je suis là pour t'aider à devenir meilleur·e et toujours voir le positif même dans les moments difficiles.",
    "Strict-Motivant": "Je suis là pour te pousser à te dépasser, comme on dit : 'C'est quand on est dans le dur qu'on progresse réellement !'",
    "Copain": "Je suis là pour te motiver, te dire les choses clairement et te faire voir que tu peux toujours aller un peu plus loin mais sans te prendre la tête.",
}
const iaFavoriteUser = dicoIA[localStorage.getItem("iaFavorite")] || "Vibe"
let promptGenerate = undefined
let clickOnButtonCopy = false
let dataInLocalStorage = false


// --- Raccourcis/Idées prompt ---
const ideasQuestions = {
    "recuperation": [
        "Pourquoi suis-je fatigué·e aujourd'hui?",
        "Analyse ma récupération du jour",
        "Ma FC de repos est-elle bonne?",
        "Suis-je assez reposé·e pour m'entraîner?",
        "Comment accélérer ma récupération aujourd'hui?",
        "Donne-moi des conseils pour mieux dormir ce soir.",
        "Douche chaude ou froide après mon entraînement?"
    ],
    "entrainement": [
        "Donne-moi une idée d'entraînement pour aujourd'hui.",
        "Analyse le dernier entraînement que j'ai effectué.",
        "Planifie ma semaine d'entraînement en fonction de mes derniers entraînements.",
        "Quelle allure je devrais viser pour ma prochaine course?",
        "Y a-t-il des courses prochainement autour de chez moi?",
        "Donne-moi des idées d'objectifs à réaliser ce mois-ci.",
        "Comment courir plus vite?",
        "Comment améliorer mon endurance?",
        "Donne-moi 3 conseils pour améliorer ma VMA.",
        "C'est quoi la VMA et à quoi ça sert?",
        "Crée un entraînement basé sur ma récupération.",
        "Suggère-moi des exercices de renforcement pour devenir plus rapide."
    ],
    "conseils": [
        "Donne-moi 3 exercices de récupération active.",
        "Comment m'échauffer correctement?",
        "Quelles sont les erreurs à ne pas faire le jour d'une course?",
        "Quels aliments manger avant un entraînement?",
        "Puis-je m'entraîner en étant malade?",
        "Motive-moi à aller m'entraîner aujourd'hui!"
    ]
}
function generateNbAleatoire() {
    const nbAleatoireForRecuperation = Math.floor(Math.random() * ideasQuestions["recuperation"].length)
    const nbAleatoireForEntrainement = Math.floor(Math.random() * ideasQuestions["entrainement"].length)
    const nbAleatoireForConseils = Math.floor(Math.random() * ideasQuestions["conseils"].length)

    return [nbAleatoireForRecuperation, nbAleatoireForEntrainement, nbAleatoireForConseils]
}
function raccourciPrompt() {
    const tableauNbAleatoire = generateNbAleatoire() // ça renvoie un tableau avec le nombre aléatoire pour [recuperation, entrainement, conseils]

    // on va cherche les phrases correspondante dans le dico
    const ideasForRecup = ideasQuestions["recuperation"][tableauNbAleatoire[0]]
    const ideasForEntrainement = ideasQuestions["entrainement"][tableauNbAleatoire[1]]
    const ideasForConseils = ideasQuestions["conseils"][tableauNbAleatoire[2]]

    // création d'un tableau pour ensuite pouvoir chercher avec un compteur ses phrases dans la boucle for
    const tableauIdeas = [ideasForRecup, ideasForEntrainement, ideasForConseils]

    const allIdeePrompt = document.querySelectorAll(".idee-prompt")
    if (allIdeePrompt) {
        let compteur = 0
        for (const elt of allIdeePrompt) {
            const ideasCorrespondante = tableauIdeas[compteur]

            elt.classList.remove("skeleton") // on enleve les loaders
            elt.classList.add("generate")
            elt.textContent = ideasCorrespondante // on attribue une phrase à un element

            // on ajoute un onclick
            elt.addEventListener("click", () => {
                const inputForPrompt = document.getElementById("promt-user")
                if (inputForPrompt) {
                    // si le texte du raccourci est égale à ce qu'il y a dans le textarea alors on déselectionne le raccourci et on vide le textarea
                    if (elt.textContent == inputForPrompt.value) {
                        const eltSelected = document.querySelector(".idee-prompt.selected")
                        if (eltSelected) {
                            eltSelected.classList.remove("selected")
                        }
                        inputForPrompt.value = ""
                    } else if (inputForPrompt.value != "") { // si le user a déjà mis qqch dans le textarea
                        // pour éviter d'effacer le prompt que le user était potentiellement en train de taper
                        if (confirm("Êtes-vous sur de vouloir continuer car le prompt que vous étiez en train d'écrire va être effacé ?")) {
                            inputForPrompt.value = ideasCorrespondante // on met le texte de l'élement dans l'input (enfin le textarea)

                            const eltSelected = document.querySelector(".idee-prompt.selected")
                            if (eltSelected) {
                                eltSelected.classList.remove("selected")
                            }
                            elt.classList.add("selected")
                        }
                    } else {
                        inputForPrompt.value = ideasCorrespondante // on met le texte de l'élement dans l'input (enfin le textarea)
                        
                        const eltSelected = document.querySelector(".idee-prompt.selected")
                        if (eltSelected) {
                            eltSelected.classList.remove("selected")
                        }
                        elt.classList.add("selected")
                    }
                }
            })

            compteur+=1
        }

    }
}
// --- Fin raccourcis/Idées prompt ---


// --- Changement de l'avatar SVG en fonction du choix de l'utilisateur ---
async function affichageStyleCoach() {
    const dataCoach = await db.JRM_Coach.get(1)
    let styleCoach = "Bienveillant"
    if (dataCoach != undefined) { // si ya des données alors on change la var
        styleCoach=dataCoach.style
    }

    const allSVG = document.querySelectorAll("div.container-avatar svg")
    if (allSVG) {
        for (const elt of allSVG) {
            elt.style.display = "none"
        }
    }

    const convertisseurNameId = {
        "Bienveillant": "bienveillant",
        "Strict-Motivant": "strict-motivant",
        "Copain": "copain",
    }
    document.getElementById(convertisseurNameId[styleCoach]).style.display = "block"    
    document.querySelector(".container-avatar.skeleton").classList.remove("skeleton")


    const dicoStyleCoachColor = {
        "Strict-Motivant": ["#ca6dfc", "#e0b3f8", "#ffa7fe"],
        "Copain": ["#5af2cedb", "#d6fff5db", "#8dffe8"]
    }
    if (styleCoach=="Bienveillant") {
        document.documentElement.style.removeProperty("--COLOR_ANALYSE_START")
        document.documentElement.style.removeProperty("--COLOR_ANALYSE_END")
        document.documentElement.style.removeProperty("--COLOR_ACCENT_TEXT")
    } else {
        document.documentElement.style.setProperty("--COLOR_ANALYSE_START", dicoStyleCoachColor[styleCoach][0])
        document.documentElement.style.setProperty("--COLOR_ANALYSE_END", dicoStyleCoachColor[styleCoach][1])
        document.documentElement.style.setProperty("--COLOR_ACCENT_TEXT", dicoStyleCoachColor[styleCoach][2])
    }
}
// --- Fin changement de l'avatar SVG en fonction du choix de l'utilisateur ---


// -- Recup des paramètres dans l'URL (methode get) ---
function paramURL() {
    const settingURL = window.location.search // on check si il y a des params dans l'url

    if (settingURL) {
        const tableauSeparation = settingURL.split("?") // ['', 'question=test', 'type=ce', 'data=[]']
        const newTableauSeparation = tableauSeparation.slice(1) // ['question=test', 'type=ce', 'data=[]']
        const dicoParametres = {}

        for (const elt of newTableauSeparation) {
            const tableauKeyValue = elt.split("=") // ex =['question', 'test']
            // on ajoute au dico la clé et la valeur
            // "decodeURIComponent" pour enlever les %20 qui est un espace,... exemple on passe de ça "Analyse%20ma%20r%C3%A9cup%C3%A9ration" -> "Analyser ma récupération"
            dicoParametres[tableauKeyValue[0]] = decodeURIComponent(tableauKeyValue[1])
        }

        if (dicoParametres.question) { // si il y a une question alors on le met dans le textarea
            let textarea = document.getElementById("promt-user")
            if (textarea) {
                textarea.value = dicoParametres.question
            }
        }

        if (dicoParametres.data && dicoParametres.data == "true") {
            dataInLocalStorage = true
        }


    }
}
// -- Fin recup des paramètres dans l'URL (methode get) ---


// --- Ouverture de SPRINTIA Analyse ---
async function windowsAnalyse() {
    document.querySelector("section.background-SPRINTIA-analyse").style.display = "flex"
    document.querySelector("div.windows-SPRINTIA-analyse").classList.add("open")
    document.querySelector("body").classList.add("analyse-open") 
    document.querySelector("main").classList.add("analyse-open")

    // on met un écouteur d'event pour refermer la fenetre si ya un clic sur le background
    document.querySelector("section.background-SPRINTIA-analyse").addEventListener("click", (event) => {
        if (document.querySelector(".windows-SPRINTIA-analyse.open") && !event.target.closest(".windows-SPRINTIA-analyse.open")) {
            closeWindows()   
        }
    })
}
function closeWindows() {
    document.querySelector("div.windows-SPRINTIA-analyse").classList.add("close")
    document.querySelector("body").classList.remove("analyse-open")
    document.querySelector("main").classList.remove("analyse-open")

    setTimeout(() => {
        document.querySelector("section.background-SPRINTIA-analyse").style.display = "none"

        document.querySelector("div.windows-SPRINTIA-analyse").classList.remove("close")
        document.querySelector("div.windows-SPRINTIA-analyse").classList.remove("open")
    }, 150);
}
// --- Fin de l'ouverture de SPRINTIA Analyse ---


// -- Génération du prompt ---
async function dataEntrainement() {
    let historiqueDataWorkout = await db.entrainement.where("date").aboveOrEqual(createObjetDate(28)).toArray();

    if (historiqueDataWorkout.length < 6) {
        historiqueDataWorkout = await db.entrainement.where("date").aboveOrEqual(createObjetDate(42)).toArray();

        // si on a tjrs pas assez de données
        if (historiqueDataWorkout.length < 6) {
            historiqueDataWorkout = await db.entrainement.where("date").aboveOrEqual(createObjetDate(56)).toArray();

            // si ya toujours pas assez de données alors qu'on prend les 56 derniers jour (la requete la plus grande) on return undefined pour arreter le code dans la fonction generatePrompt
            if (historiqueDataWorkout.length <= 0) {
                return undefined
            }
        }
        // si on a trop de données on fait un entre deux
        if (historiqueDataWorkout.length > 8) {
            historiqueDataWorkout = await db.entrainement.where("date").aboveOrEqual(createObjetDate(49)).toArray();
        };
    } else if (historiqueDataWorkout.length >= 12) {
        historiqueDataWorkout = await db.entrainement.where("date").aboveOrEqual(createObjetDate(21)).toArray();
        
        // si on a tjrs trop de datas on réduit encore
        if (historiqueDataWorkout.length > 8) {
            historiqueDataWorkout = await db.entrainement.where("date").aboveOrEqual(createObjetDate(14)).toArray();
        };
        // si on en a pas assez on fait un entre deux
        if (historiqueDataWorkout.length < 6) {
            historiqueDataWorkout = await db.entrainement.where("date").aboveOrEqual(createObjetDate(18)).toArray();
        };
    };

    return historiqueDataWorkout.map((workout) =>{
        // on sépare les points gps du reste des données de l'entrainement car on n'envoie pas les points GPS à l'IA! on enleve aussi l'id
        const {points_gps, id, ...autreStats} = workout;
        return autreStats;
    }).reverse(); // on remet de la date la plus récente à la plus ancienne 
}
async function dataRecuperation() {
    let historiqueDataRecuperation = await db.recuperation.where("date").aboveOrEqual(createObjetDate(14)).toArray();

    if (historiqueDataRecuperation.length < 6) {
        historiqueDataRecuperation = await db.recuperation.where("date").aboveOrEqual(createObjetDate(28)).toArray();

        
        // si ya toujours pas assez de données alors qu'on prend les 28 derniers jour (la requete la plus grande) on return undefined pour arreter le code dans la fonction generatePrompt
        if (historiqueDataRecuperation.length <= 0) {
            return undefined
        }
        
        // si on a trop de données on en prend moins
        if (historiqueDataRecuperation.length > 8) {
            historiqueDataRecuperation = await db.recuperation.where("date").aboveOrEqual(createObjetDate(21)).toArray();

            // si on a encore trop de donnée on fait un entre deux entre 14J et 21J
            if (historiqueDataRecuperation.length > 8) {
                historiqueDataRecuperation = await db.recuperation.where("date").aboveOrEqual(createObjetDate(18)).toArray();
            };
        };
    } else if (historiqueDataRecuperation.length > 8) {
        historiqueDataRecuperation = await db.recuperation.where("date").aboveOrEqual(createObjetDate(7)).toArray();

        // si on a pas assez de données on prend un entre deux etre 14J et 7J
        if (historiqueDataRecuperation.length < 6) {
            historiqueDataRecuperation = await db.recuperation.where("date").aboveOrEqual(createObjetDate(11)).toArray();
        };
    };

    return historiqueDataRecuperation.map(elt => ({ // on garde que les datas essentielles car les ID par exemple on s'en fou
        "date": elt.date,
        "fc_repos": elt.fc_repos
    }));
}

function convertToCSV(dataJSON) {
    // on init une variable qui contiendra les entetes et les datas
    let datasInCSV = "| "

    for (const key in dataJSON[0]) {
        datasInCSV += key+" | "
    }

    datasInCSV = datasInCSV.replace("duree", "duree (min)")
                            .replace("rpe", "RPE (1 à 10)")
                            .replace("fc_moy", "fc_moy (bpm)")
                            .replace("fc_max", "fc_max (bpm)")
                            .replace("distance", "distance (km)")
                            .replace("denivele", "denivele (m)")
                            .replace("allure_moy", "allure_moy (min/km)")
                            .replace("fc_repos", "fc_repos (bpm)")
                            .replace("transpiration_estimee", "Transpiration estimée (mL)")
                            .replace("hydratation_estimee", "Hydratation estimée (mL)")

    // on recup les datas et on les met en ligne
    for (const data of dataJSON) {
        datasInCSV += "\n|"
        for (const key in data) {
            if (data[key] != undefined  && data[key] != null) { // si la valeur est undefined ou null on met rien
                if (key == "note") { // si la clé est les notes d'entrainement
                    // on remplace les saut de ligne par un espace pour pas que ça casse le CSV
                    let noteSansSautDeLigne = data[key].replace(/\n/g, " ")
                    datasInCSV += noteSansSautDeLigne+" | "
                } else {
                    datasInCSV += data[key]+" | "
                }

            } else {
                datasInCSV += "- | "
            }
        }
    }

    return datasInCSV
}
function calculMoyenneRecuperation(allRecuperation) {
    let sommeFcRepos = 0
    allRecuperation.forEach(element => {
        sommeFcRepos += element.fc_repos
    });
    
    return Math.round(sommeFcRepos/allRecuperation.length)
}

async function styleCoach() {
    const dataCoachUser = await db.JRM_Coach.get(1)
    if (dataCoachUser != undefined) {
        return dataCoachUser.style
    } else {
        return undefined
    }
}

async function generatePrompt() {
    const dataWorkout = await dataEntrainement()
    const dataRecup = await dataRecuperation()

    // si ya pas de données d'entrainement ou/et de récup alors on genere rien du tout
    if (dataWorkout == undefined && dataRecup == undefined) {
        return undefined
    }

    // Consigne de base
    promptGenerate = `Tu es le coach sportif expert de l'application SPRINTIA. L'utilisateur va te poser une question, ton but ? Répondre à ses questions de manière fluide et précise en te basant sur les données qu'il a enregistré dans l'application. Information temporelle : aujourd'hui nous sommes le ${createObjetDate(0)}.`

    if (dataWorkout != undefined) {
        promptGenerate += "\n\nL'historique d'entrainement :\n" + convertToCSV(dataWorkout)
    }

    if (dataRecup != undefined) {
        promptGenerate += "\n\nL'historique de récupération :\n" + convertToCSV(dataRecup)

        const moyenneRecuperation = calculMoyenneRecuperation(dataRecup)
        promptGenerate+= "\nMoyenne des récupérations : " + moyenneRecuperation + " bpm"
    }
    
    // ajout de la question du user (pr info on a déjà vérifié si le textearea était vide dans le html)
    // on remplace les \n par des espaces pr économiser des tokens
    promptGenerate += `\n\nVoici la question que l'utilisateur a posé à SPRINTIA : "${document.getElementById("promt-user").value.replace(/\n/g, " ")}"`

    // on regarde si on a pas passé des datas dans le localStorage depuis la CE ou l'indulgence de course
    if (dataInLocalStorage == true) {
        const dataAlgorithme = localStorage.getItem("dataAlgorithmeEphemere")
        if (dataAlgorithme != null) {
            promptGenerate += "\n\n" + dataAlgorithme
        }

        dataInLocalStorage = false
        localStorage.removeItem("dataAlgorithmeEphemere")
    }

    let styleCoachUser = await styleCoach()
    if (styleCoachUser == undefined) {styleCoachUser = "Bienveillant"}
    promptGenerate += `\n\nStyle de coach : "${styleCoachUser}"\nDescription du coach : "${dicoStyleCoach[styleCoachUser]}"`

    // Finalisation
    promptGenerate += `\n
Contraintes :
- Reprend exactement le style du coach que l'utilisateur a configuré dans SPRINTIA
- Tutoie l'utilisateur et répond en français
- N'hésite pas à lui poser une question pour continuer la discussion et renforcer le lien entre toi (le coach de SPRINTIA) et l'utilisateur.`

    return promptGenerate
}

async function copyPrompt(buttonCopy) {
    promptGenerate = await generatePrompt()

    if (promptGenerate != undefined) { // quand le prompt a été généré avec succès
        // on copie le prompt dans le clavier
        navigator.clipboard.writeText(promptGenerate)
        .then(async() => {
            buttonCopy.textContent = "Prompt copié !"
            buttonCopy.classList.add("unselected")

            let buttonOpenIa = document.getElementById("button-open-ia")
            if (buttonOpenIa && !buttonOpenIa.classList.contains("selected")) {
                buttonOpenIa.classList.add("selected")
            }
        }).catch(error => {
            console.log(error)
            alert("Une erreur s'est produite lors de la copie du prompt dans votre papier presse.")
            return
        })

        // on enregistre dans la base de données la question et le prompt
        try {
            await db.discussion.add({
                date: createObjetDate(0),
                question: document.getElementById("promt-user").value.replace(/\n/g, " "),
                prompt: promptGenerate
            })
        } catch(error) {
            console.log(error)
            alert("Une erreur s'est produite lors de l'enregistrement du prompt, veuillez réessayer.")
            return
        }


        clickOnButtonCopy = true
    } else {
        alert("Aucun prompt n'a été généré car SPRINTIA n'a pas assez de données pour en générer un !")
        return 
    }
}
function openIA() {
    // si le prompt est généré et que le user a bien copié le prompt dans son papier presse alors...
    if (promptGenerate != undefined && clickOnButtonCopy == true) {
        window.open(dicoLienIA[iaFavoriteUser], '_blank') // ouverture de l'IA préféré du user
    } else { // si le user n'a pas copié le prompt
        alert(`Veuillez copier le prompt pour pouvoir ensuite le coller dans ${iaFavoriteUser}.`)
        return
    }
}
// --- Fin génération du prompt ---


function init() {
    if (iaFavoriteUser != "Vibe") {
        const spanIaFavorite = document.querySelectorAll(".explanation-analyse .ia-favorite")
        if (spanIaFavorite) {
            spanIaFavorite.forEach(element => {
                element.textContent = iaFavoriteUser
            });
        }

        let buttonOpenIa = document.getElementById("button-open-ia")
        let textInButton = "Ouvrir " + iaFavoriteUser

        if (buttonOpenIa) {
            if (iaFavoriteUser == "l'IA locale de votre choix") {
                buttonOpenIa.style.display = "none" 
                document.querySelector("div.container-button-windows-SPRINTIA-analyse").style.display = "flex"
            } else {
                buttonOpenIa.textContent = textInButton
            }
        }

        // le bouton dans discuter avec le coach
        let textArea = document.getElementById("promt-user")
        if (textArea) {
            textArea.placeholder = "Posez n'importe quelle question à " + iaFavoriteUser + "..."
        }
    }
}


document.addEventListener("DOMContentLoaded", async() => {
    const buttonAnalyse = document.getElementById("button-SPRINTIA-analyse-ask")
    if (buttonAnalyse) {
        buttonAnalyse.addEventListener("click", () => {
            if (!document.getElementById('promt-user').value.trim()) {
                alert('Veuillez ajouter votre question dans le champs de texte avant de vouloir demander à une IA.')
            } else {
                windowsAnalyse()
            }
        })
    }

    const iconFermer = document.querySelector("div.windows-SPRINTIA-analyse-head i.icon_fermer")
    if (iconFermer) {iconFermer.addEventListener("click", closeWindows)}

    const buttonCopy = document.getElementById("copy")
    if (buttonCopy) {
        buttonCopy.addEventListener("click", () => {copyPrompt(buttonCopy)}
    )}

    const buttonOpenIa = document.getElementById("button-open-ia")
    if (buttonOpenIa) {buttonOpenIa.addEventListener("click", () => {openIA()})}


    await affichageStyleCoach()
    raccourciPrompt()
    init()
    paramURL()
})