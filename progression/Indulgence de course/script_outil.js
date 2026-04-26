// dico des interpretation
const InterpretationBienveillant = {
    "1": "Je n'ai <strong>pas encore assez de données</strong> pour calculer ton indulgence de course. J'ai hâte que tu enregistres ton <strong>premier entraînement</strong> de course (en enregistrant une distance) dans Sprintia pour qu'on analyse ça ensemble.", 
    "2": "Tu cours <strong>moins depuis 7 jours</strong>, c'est dommage ! Si c'est un choix profite-en pour te reposer ou travailler d'autres aspects de la course comme le <strong>renforcement</strong> ou de la <strong>mobilité</strong>.", 
    "3": "Parfait ! <strong>Tu progresses</strong> grâce à ta <strong>régularité</strong> ainsi qu'à ta discipline, continue comme ça pour booster tes performances. Pour maximiser ta progression, pense toujours à <strong>varier tes allures</strong> d'entraînement.", 
    "4": "Attention, tu cours <strong>bien plus que d'habitude</strong> ! Si tu continues sur ce rythme tu risques de te <strong>blesser</strong>. P'tit conseil, <strong>réduis</strong> ton volume d'entraînement.", 
    // Pour les statut
    "5": "Statut : <strong>Pause</strong><br>Tu as mis en pause les analyses, je ne peux donc pas analyser ton indulgence de course."
}
const InterpretationStrictMotivant = {
    "1": "Je n'ai <strong>pas encore assez de données</strong> pour calculer ton indulgence de course. J'ai hâte que tu enregistres ton <strong>premier entraînement</strong> de course (en enregistrant une distance) dans Sprintia pour qu'on analyse ça ensemble.", 
    "2": "Tu cours <strong>moins depuis 7 jours</strong>. Fais attention si tu continues sur cette voie, tu risques de perdre du niveau rapidement ! Petit conseil pour limiter la casse, fais du <strong>renforcement</strong>.", 
    "3": "Parfait ! <strong>Tu progresses</strong> grâce à ta <strong>régularité</strong>. La régularité c'est la clé de la réussite donc, continue comme ça pour progresser. Mais attention, le plus dur n'est pas de progresser mais de continuer à progresser.", 
    "4": "Tu cours <strong>bien plus que d'habitude</strong> ! Si tu veux te <strong>blesser</strong>, tu es sur la bonne voie, ne joue pas avec le feu, arrête de courir pendant quelques jours, pour revenir plus fort.", 
    // Pour les statut
    "5": "Statut : <strong>Pause</strong><br>Tu as mis en pause les analyses, je ne peux donc pas analyser ton indulgence de course."
}
const InterpretationCopain = {
    "1": "Je n'ai <strong>pas encore assez de données</strong> pour calculer ton indulgence de course. J'ai hâte que tu enregistres ton <strong>premier entraînement</strong> de course (en enregistrant une distance) dans Sprintia pour qu'on analyse ça ensemble.", 
    "2": "Tu cours <strong>moins depuis 7 jours</strong>. Essaie de courir un peu plus, ne te relâche pas, sinon tu vas finir par perdre tout ton niveau et crois moi, tu vas t'en vouloir une fois qu'il sera trop tard.", 
    "3": "Bravo ! <strong>Tu progresses</strong> grâce à ton sérieux, ta concentration et ta détermination à toujours donner le meilleur de toi-même. Pour continuer à progresser, pense toujours à <strong>varier tes allures</strong> d'entraînement.", 
    "4": "Attention, tu cours <strong>bien plus que d'habitude</strong> ! J'ai l'impression que tu aimes un peu trop courir en ce moment, c'est bien, mais attention : moins tu es progressif·ve, plus tu risques de te blesser.", 
    // Pour les statut
    "5": "Statut : <strong>Pause</strong><br>Tu as mis en pause les analyses, je ne peux donc pas analyser ton indulgence de course."
}
const InterpretationGoMuscu = {
    "1": "Je n'ai <strong>pas encore assez de données</strong> pour calculer ton indulgence de course. J'ai hâte que tu enregistres ton <strong>premier entraînement</strong> de course (en enregistrant une distance) dans Sprintia pour qu'on analyse ça ensemble.", 
    "2": "Tu cours <strong>moins depuis 7 jours</strong>, attention, la course à pied c'est comme la musculation ça demande de la <strong>régularité</strong>. Ton coeur, c'est un muscle, il faut le travailler pour qu'il devienne meilleur.", 
    "3": "<strong>Tu progresses</strong>, parfait ! En plus de travailler tes muscles, tu travailles ton coeur, bien joué ! Pour continuer à progresser, pense toujours à <strong>varier tes allures</strong> d'entraînement.", 
    "4": "Tu cours <strong>bien plus que d'habitude</strong> ! Fais attention, si tu continues sur ce rythme tu risques de te <strong>blesser</strong> donc réduis ton volume kilométrique.", 
    // Pour les statut
    "5": "Statut : <strong>Pause</strong><br>Tu as mis en pause les analyses, je ne peux donc pas analyser ton indulgence de course."
}

async function RecupData() {
    // recup des datas d'entrainements
    let HistoriqueWorkoutDB = await db.entrainement.toArray()

    // Trier par date 
    HistoriqueWorkoutDB.sort((element1, element2) => { // En js on peut comparer 2 dates comme des maths
        if (element1.date < element2.date) return -1
        if (element1.date > element2.date) return 1
    })

    let TableauDate = HistoriqueWorkoutDB.map(elementDB => elementDB.date)
    let TableauSport = HistoriqueWorkoutDB.map(elementDB => elementDB.sport)
    let TableauDistance = HistoriqueWorkoutDB.map(elementDB => elementDB.distance)

    // setting date
    const DateActuelle = new Date()

    let DateMoins7J = new Date()
    DateMoins7J = DateMoins7J.setDate(DateActuelle.getDate() - 7) // pour le calcul des dates il faut les mettre en timestamp enleve le nb de j ici, ça renvoie ex: 1769014250809
    DateMoins7J = new Date(DateMoins7J).toISOString() // permet de recup "2026-01-21T17:13:53.151Z"
    // On prend que ce qui nous interesse donc la premiere partie
    DateMoins7J = DateMoins7J.split("T")[0] // on obtient "2026-01-21"

    let DateMoins14J = new Date() // voir commentaire au dessus pr explication
    DateMoins14J = DateMoins14J.setDate(DateActuelle.getDate() - 14) 
    DateMoins14J = new Date(DateMoins14J).toISOString()
    DateMoins14J = DateMoins14J.split("T")[0] 

    let DateMoins21J = new Date() // voir commentaire au dessus pr explication
    DateMoins21J = DateMoins21J.setDate(DateActuelle.getDate() - 21) 
    DateMoins21J = new Date(DateMoins21J).toISOString()
    DateMoins21J = DateMoins21J.split("T")[0] 

    let DateMoins28J = new Date() // voir commentaire au dessus pr explication
    DateMoins28J = DateMoins28J.setDate(DateActuelle.getDate() - 28) 
    DateMoins28J = new Date(DateMoins28J).toISOString()
    DateMoins28J = DateMoins28J.split("T")[0] 

    // Initialisation pour la boucle
    let compteur = 0
    let DistanceWorkout = 0
    let Tableau7J = []
    let Tableau14J = []
    let Tableau21J = []
    let Tableau28J = []
    let firstWorkoutFind = false
    let fisrtWorkoutRunning = ""

    TableauDate.forEach(elementDate => {
        // recup de la distance du workout
        DistanceWorkout = TableauDistance[compteur]

        // ---- Pour l'algorithme de lissage ----
        if (TableauSport[compteur] == "Course" && firstWorkoutFind == false) {
            fisrtWorkoutRunning = elementDate // on sauvegarde la date du premier entraînement de running
            firstWorkoutFind = true // on met sur true pour eviter qu'au prochain tour de la boucle la variable fisrtWorkout soit écrasée par une autre
        }
        // ---- Fin ----

        if (elementDate >= DateMoins7J) {
            if (TableauSport[compteur] == "Course") {
                if (DistanceWorkout != null || DistanceWorkout != undefined) {
                    if (!isNaN(Number(DistanceWorkout))) {
                        Tableau7J.push(Number(DistanceWorkout))
                    }
                }
            }
        } else if (elementDate >= DateMoins14J) {
            if (TableauSport[compteur] == "Course") {
                if (DistanceWorkout != null || DistanceWorkout != undefined) {
                    if (!isNaN(Number(DistanceWorkout))) {
                        Tableau14J.push(Number(DistanceWorkout))
                    }
                }
            }
        } else if (elementDate >= DateMoins21J) {
            if (TableauSport[compteur] == "Course") {
                if (DistanceWorkout != null || DistanceWorkout != undefined) {
                    if (!isNaN(Number(DistanceWorkout))) {
                        Tableau21J.push(Number(DistanceWorkout))
                    }
                }
            }
        } else if (elementDate >= DateMoins28J) {
            if (TableauSport[compteur] == "Course") {
                if (DistanceWorkout != null || DistanceWorkout != undefined) {
                    if (!isNaN(Number(DistanceWorkout))) {
                        Tableau28J.push(Number(DistanceWorkout))
                    }
                }
            }
        }

       compteur += 1 
    });

    // ---- algorithme de lissage ----
    // si le user a moins de 28 jours de datas sur Sprintia alors au lieu de diviser par 4 la distance28j on divise par le nombre de semaine ou le user a de la datas
    // pour voir le calul de distance28j/nbSemaine voir la fonction CalculIndulgence()
    let nbSemaine = 4
    if (fisrtWorkoutRunning) {
        let dateFirstRunning = new Date(fisrtWorkoutRunning) // on créer un object date pour avoir les millisecondes

        let differenceMillisecondes = DateActuelle-dateFirstRunning
        // conversion des millisecondes en jours
        let differenceJ = Math.floor(differenceMillisecondes/(1000*60*60*24))

        nbSemaine = Math.ceil(differenceJ/7)
    }

    // 2 sécurités
    if (nbSemaine > 4) {nbSemaine = 4}
    else if (nbSemaine < 1) {nbSemaine = 1}

    // init pour la somme
    let Distance7J = 0
    let Distance14J = 0
    let Distance21J = 0
    let Distance28J = 0

    // passons a la somme
    Tableau7J.forEach(element => {
        Distance7J += element
    });
    Tableau14J.forEach(element => {
        Distance14J += element
    });
    Tableau21J.forEach(element => {
        Distance21J += element
    });
    Tableau28J.forEach(element => {
        Distance28J += element
    });

    genererGraphiqueLine(["S-4", "S-3", "S-2", "S-1"], [Math.floor(Distance28J), Math.floor(Distance21J), Math.floor(Distance14J), Math.floor(Distance7J)])

    // Affichage dans "Distance réel sur 7J"
    document.getElementById("reponse-algo-allure").textContent = Number(Distance7J).toFixed(1).replace(".", ",") + " km"

    // on aditionne toutes les variables pour avoir la distance sur 28j pour comparer la semaine actuelle a l'ancienne
    Distance28J = Distance7J+Distance14J+Distance21J+Distance28J
    // affichage de la somme des distances sur 28 derniers jours
    document.getElementById("somme-28J").innerHTML = `<strong>${Number(Distance28J).toFixed(2).replace(".", ",")} km</strong> sur 28 jours`

    return {Distance7J, Distance28J, nbSemaine}
}

async function CalculIndulgence() {
    // Initialisation coefficient
    const CoefFourchetteDebut = [1.16, 1.13, 1.10, 1.07, 1.04]
    const CoefFourchetteFin = [1.25, 1.2, 1.15, 1.12, 1.1]

    let IndulgenceDeCourseDebut = 0
    let IndulgenceDeCourseFin = 0

    // Calibration par semaine
    let {Distance7J, Distance28J, nbSemaine} = await RecupData()
    Distance28J = Number(Distance28J)/nbSemaine

    // affichage
    document.getElementById("km-par-semaine").innerHTML = `<strong>${Number(Distance28J).toFixed(2).replace(".", ",")} km</strong> par semaine`

    // Analyse pour avoir la fouchette de distance conseillée (les coef sont diférent en fonction de la distance)
    if (Distance28J <= 10) {
        IndulgenceDeCourseDebut = Distance28J*CoefFourchetteDebut[0]
        IndulgenceDeCourseFin = Distance28J*CoefFourchetteFin[0]
    } else if (Distance28J <= 20) {
        IndulgenceDeCourseDebut = Distance28J*CoefFourchetteDebut[1]
        IndulgenceDeCourseFin = Distance28J*CoefFourchetteFin[1]
    } else if (Distance28J <= 40) {
        IndulgenceDeCourseDebut = Distance28J*CoefFourchetteDebut[2]
        IndulgenceDeCourseFin = Distance28J*CoefFourchetteFin[2]
    } else if (Distance28J <= 60) {
        IndulgenceDeCourseDebut = Distance28J*CoefFourchetteDebut[3]
        IndulgenceDeCourseFin = Distance28J*CoefFourchetteFin[3]
    } else {
        IndulgenceDeCourseDebut = Distance28J*CoefFourchetteDebut[4]
        IndulgenceDeCourseFin = Distance28J*CoefFourchetteFin[4]
    }

    let ResultIndulgenceCourse = Number(IndulgenceDeCourseDebut).toFixed(1).replace(".", ",") + " - " + Number(IndulgenceDeCourseFin).toFixed(1).replace(".", ",") + " km"

    // Affichage du résultat
    document.getElementById("reponse-algo-indulgence").innerHTML = ResultIndulgenceCourse

    return {Distance7J, Distance28J, IndulgenceDeCourseFin}
}

async function InterpretationJRM(Distance7J, Distance28J, IndulgenceDeCourseFin) {
    // Recup du champs JRM
    let InterpretationParagraphe = document.getElementById("reponse-coach-indulgence")

    // Déterminer le coach choisis du user
    let CoachUserDB = await db.JRM_Coach.toArray()
    let Interpretation = InterpretationBienveillant // attribution du style de coach a utilisé
    if (CoachUserDB.length > 0) {  // si le user a enregistré qqch alors on met le style du coach qu'il a choisis
        let TableauStyleCoach = CoachUserDB.map(elementDB => elementDB.style) // recup du style
        // On check le style de coach que le user a choisi et on attribue le dico correspondant
        if (TableauStyleCoach[0] == "Bienveillant") {
            Interpretation = InterpretationBienveillant
        } else if (TableauStyleCoach[0] == "Strict-Motivant") {
            Interpretation = InterpretationStrictMotivant
        } else if (TableauStyleCoach[0] == "Copain") {
            Interpretation = InterpretationCopain
        } else {
            Interpretation = InterpretationGoMuscu
        }
    }

    // quand il y a pas de données
    if (Distance28J > 0) {
        // en fonction du résultat des calculs, attribution d'une interpretation
        if (Distance28J <= Distance7J && Distance7J <= IndulgenceDeCourseFin) {
            InterpretationParagraphe.innerHTML = Interpretation["3"]
        } else if (Distance7J > IndulgenceDeCourseFin) {
            InterpretationParagraphe.innerHTML = Interpretation["4"]
        } else {
            InterpretationParagraphe.innerHTML = Interpretation["2"]
        }
    } else {
        InterpretationParagraphe.innerHTML = Interpretation["1"]
    }

}

async function Initialisation() {
    let {Distance7J, Distance28J, IndulgenceDeCourseFin} = await CalculIndulgence()
    InterpretationJRM(Distance7J, Distance28J, IndulgenceDeCourseFin)

    return
}

window.addEventListener("DOMContentLoaded", () => {
    Initialisation()
}) 