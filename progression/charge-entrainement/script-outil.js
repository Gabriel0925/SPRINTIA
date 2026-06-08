const dateActuelle = new Date()
let dateMoins28J = createObjetDate(28)

function ReturnDate(DateWorkout) {
    let DateEuropeen = ""

    DateWorkout = DateWorkout.split("-")
    // Inversion de la date de "2026-01-12" à "12-01-2026"
    DateEuropeen = DateWorkout[2] + "-" + DateWorkout[1] + "-" + DateWorkout[0]
    return DateEuropeen
}

async function RecupValueGraphique() {
    // Recup value Data
    const valeurDB = await db.entrainement.where("date").aboveOrEqual(dateMoins28J).toArray()
    valeurDB.reverse() // pour trier de la plus récente à la plus ancienne

    let DateMoins7J = createObjetDate(7)
    let DateMoins14J = createObjetDate(14)
    let DateMoins21J = createObjetDate(21)
    let DateMoins28J = createObjetDate(28)

    // init pour la boucle
    let tableau7J = []
    let tableau14J = []
    let tableau21J = []
    let tableau28J = []

    valeurDB.forEach(element => {
        if (element.date >= DateMoins7J) {
            tableau7J.push(element.charge_entrainement)
        } else if (element.date >= DateMoins14J) {
            tableau14J.push(element.charge_entrainement)
        } else if (element.date >= DateMoins21J) {
            tableau21J.push(element.charge_entrainement)
        } else if (element.date >= DateMoins28J) {
            tableau28J.push(element.charge_entrainement)
        }
    });

    // init pour la somme
    let chargeWeek7J = 0
    let chargeWeek14J = 0
    let chargeWeek21J = 0
    let chargeWeek28J = 0

    // passons a la somme
    tableau7J.forEach(element => {
        chargeWeek7J += element
    });
    tableau14J.forEach(element => {
        chargeWeek14J += element
    });
    tableau21J.forEach(element => {
        chargeWeek21J += element
    });
    tableau28J.forEach(element => {
        chargeWeek28J += element
    });
    
    return [Math.floor(chargeWeek28J), Math.floor(chargeWeek21J), Math.floor(chargeWeek14J), Math.floor(chargeWeek7J)]
}

async function InterpretationJRM(Ratio, AnalysePossible) {
    // Initialisation 
    let Interpretation = "Je n'ai <strong>pas assez de données</strong> pour analyser ta charge d'entraînement. Tu as juste besoin d'ajouter au moins <strong>3 entraînements sur les 28 derniers jours</strong>. J'attends avec impatience tes premiers entraînements."
    
    // Si l'utilisateur a fait moins de 3 entrainements sur les 28 derniers jours on analyse pas
    if (AnalysePossible == false) {
        document.getElementById("cible-charge-7j").textContent = "Charge aiguë"
        return Interpretation // on return l'analyse par défaut
    }

    // Dico des phrases
    const PhraseJRMBienveillant = [
        "Statut : <strong>Désentraînement</strong><br>Ta condition physique semble décliner ! Essaie d'augmenter l'intensité de tes entraînements pour basculer en statut productif et améliorer tes performances.",
        "Statut : <strong>Productif</strong><br>Tu es en train de progresser, bravo ! Tes entraînements portent leurs fruits, garde cette régularité et cette discipline pour continuer de booster tes performances.",
        "Statut : <strong>Surentraînement</strong><br>Ta charge d'entraînement est significativement plus élevée que d'habitude, ton corps a du mal à suivre, il a besoin de quelques jours de repos pour récupérer."
    ]
    const PhraseJRMStrictMotivant = [
        "Statut : <strong>Désentraînement</strong><br>Ta condition physique est en train de diminuer ! Si tu souhaites améliorer tes performances, il est plus que temps d'augmenter l'intensité de tes futurs entraînements.",
        "Statut : <strong>Productif</strong><br>Tu progresses, félicitations ! Tes entraînements portent leurs fruits, continue à mettre autant d'intensité qu'actuellement lors de tes futurs entraînements.",
        "Statut : <strong>Surentraînement</strong><br>Tu risques la blessure et blessure égale perte de niveau donc arrête de jouer avec le feu et repose-toi pendant quelques jours."
    ]
    const PhraseJRMCopain = [
        "Statut : <strong>Désentraînement</strong><br>Je suis désolé mais là tu abuses, tu devrais augmenter l'intensité de tes entraînements sinon tous tes efforts passés vont disparaître en quelques semaines.",
        "Statut : <strong>Productif</strong><br>Bravo, tu progresses ! Tous tes efforts sont en train de payer, continue de t'entraîner de cette façon, ça semble être positif pour ta progression.",
        "Statut : <strong>Surentraînement</strong><br>Tu t'entraînes plus que d'habitude, ton corps semble galérer à se régénérer. Petit conseil, fais une pause de quelques jours."
    ]
    const PhraseJRGoMuscu = [
        "Statut : <strong>Désentraînement</strong><br>Tu régresses là ! Il ne faut pas hésiter à faire 1 ou 2 répétitions en plus sur tes séries pour pouvoir augmenter ton RPE et par conséquent ta charge d'entraînement.",
        "Statut : <strong>Productif</strong><br>GG, tu progresses, je vois que tu mets une bonne intensité pendant tes séances, continue comme ça. Tu n'as presque plus besoin de moi.",
        "Statut : <strong>Surentraînement</strong><br>Ton corps n'arrive pas à bien récupérer de tes entraînements récents, n'oublie jamais que le muscle se construit au repos, pas à la salle, repose-toi un peu avant d'aller à la salle."
    ]
    
    // Déterminer le coach choisis du user
    let CoachUserDB = await db.JRM_Coach.toArray()
    let StyleCoachUser = PhraseJRMBienveillant // attribution du style de coach a utilisé pour l'interpretation
    if (CoachUserDB.length > 0) {  // si le user a enregistré qqch alors on met le style du coach qu'il a choisis
        let TableauStyleCoach = CoachUserDB.map(elementDB => elementDB.style) // recup du style
        // On check le style de coach que le user a choisi et on attribue le tableau correspondant
        if (TableauStyleCoach[0] == "Bienveillant") {
            StyleCoachUser = PhraseJRMBienveillant
        } else if (TableauStyleCoach[0] == "Strict-Motivant") {
            StyleCoachUser = PhraseJRMStrictMotivant
        } else if (TableauStyleCoach[0] == "Copain") {
            StyleCoachUser = PhraseJRMCopain
        } else {
            StyleCoachUser = PhraseJRGoMuscu
        }
    }

    if (Ratio <= 0.8) { // Interpretation en fonction du ratio
        Interpretation = StyleCoachUser[0]
    } else if (Ratio <= 1.35) {
        Interpretation = StyleCoachUser[1]
    } else if (Ratio >= 1.35) {
        Interpretation = StyleCoachUser[2]
    }

    return Interpretation
}

async function CalculCharge() {
    // Initialisation 
    let ChargeAigue = 0
    let ChargeChronique = 0
    let compteur = 0
    let compteur2 = 0
    let Charge = []
    let DateCharge = []

    // Date recup
    let DateMoins7J = createObjetDate(7)
    let DateMoins28J = createObjetDate(28)

    // initialisation avt boucle
    let DateBoucle = ""

    // Recup data BDD
    let HistoriqueDB = await db.entrainement.toArray() // recup de toutes les datas

    // Trier par date 
    HistoriqueDB.sort((element1, element2) => { // En js on peut comparer 2 dates comme des maths
        if (element1.date < element2.date) return -1
        if (element1.date > element2.date) return 1
    })

    // on regarde c'était quand le premier entrainement du user enregistré sur SPRINTIA
    let fistWorkout = HistoriqueDB[0]

    // initialisation avant le if
    let jourEcouler = 28

    if (fistWorkout) {
        let dateFirstWorkout = fistWorkout.date // on a la date exemple "2026-02-18"
        let dateFirstObject = new Date(dateFirstWorkout) // on crée un object date avec la date du premier entrainement pour pouvoir faire la différence ensuite
    
        // calcul de la différence en milliseconde
        const differenceMillisecondes = dateActuelle - dateFirstObject
        // conversion en jours
        jourEcouler = Math.floor(differenceMillisecondes/(1000*60*60*24)) // dans 1 secondes il y a 1000 ms, dans 1min il y a 60sec, dans 1heure il y a 60m et dans une journée il y a 24h
        // ---- algorithme de lissage ----
        // si le user a moins de 28 jours de datas sur SPRINTIA alors au lieu de diviser par 4 la charge chronique on divise par le nombre de semaine ou le user a de la datas
        // exemple : le premier entrainement du user est il y a 21 jours, 21j = 3 semaines donc charge_chronique/3 ou lieu de charge_chronique/4 ce qui permet d'avoir une bonne fiabilité si le user a tres peu de data dans SPRINTIA
    }
    let nbSemaine = Math.ceil(jourEcouler/7)
    if (nbSemaine<1) { // petite sécurité pour que le nombre de semaine ne soit pas inférieur à 1 semaine
        nbSemaine = 1
    }
    if (nbSemaine>4) { // petite sécurité pour que le nombre de semaine ne soit pas supérieur à 4 semaine (=28j)
        nbSemaine = 4
    }

    // recup des datas sous forme de liste
    let ChargeAigueLi = HistoriqueDB.map(data => data.charge_entrainement)
    let DateLi = HistoriqueDB.map(data => data.date)

    ChargeAigueLi.forEach(DataCharge => { // parcour des datas de charge
        DateBoucle = DateLi[compteur]

        if (DateBoucle >= DateMoins28J) { // on ajoute la charge et la date de la charge entrai. dans la liste (les 28 derniers jours)
            Charge.push(DataCharge)
            DateCharge.push(DateBoucle)
        }

        compteur += 1 // maj compteur pr l'index
    });
    
    // ajout d'une condition pour éviter que SPRINTIA analyse la charge alors que l'utilisateur n'a pas assez d'entraînement sur les 28 derniers j
    // donc prepa de variable pour la fonction l'interpretationJRM()
    let AnalysePossible = true // initialisation
    if (Charge.length<3) { // si il y a moins de 3 entrainements sur les 28 derniers jours, on analyse pas
        AnalysePossible = false
    }

    // parcours des dates pour faire une liste avec la charge des 7 derniers jours et une autre li avec la charge des 28 derniers jours
    DateCharge.forEach(DateEntrainement => {
        if (DateEntrainement >= DateMoins7J) { 
            ChargeAigue = ChargeAigue + parseFloat(Charge[compteur2])
            ChargeChronique = ChargeChronique + parseFloat(Charge[compteur2])

        } else if (DateEntrainement >= DateMoins28J) {
            ChargeChronique = ChargeChronique + parseFloat(Charge[compteur2])
        }

        compteur2 += 1
    }); 

    // Arrondi
    ChargeAigue = Math.floor(ChargeAigue)
    ChargeChronique = Math.floor(ChargeChronique)

    // calcul du ratio
    let Ratio = ChargeAigue/(ChargeChronique/nbSemaine) // on met charge chronique par semaine pr le ratio
    
    // calcul pour la cible
    let cibleCe7Jmin = 0.8*(ChargeChronique/nbSemaine)
    let cibleCe7Jmax = 1.35*(ChargeChronique/nbSemaine)

    return {Ratio, ChargeAigue, ChargeChronique, AnalysePossible, cibleCe7Jmin, cibleCe7Jmax}
}

async function Initialisation() {
    // recup zone html ou il y a linterpretation JR%
    let HTMLInterpretationJRM  = document.getElementById("reponse-coach-indulgence")

    // recup des charges plus interpretation et affichage
    let ChargeDatas = await RecupValueGraphique()
    
    let {Ratio, ChargeAigue, ChargeChronique, AnalysePossible, cibleCe7Jmin, cibleCe7Jmax} = await CalculCharge()

    if (ChargeAigue) {
        document.getElementById("charge-7j").textContent = ChargeAigue

        if (cibleCe7Jmin && cibleCe7Jmax) {
            // affichage de la cible
            document.getElementById("cible-charge-7j").textContent = "Cible : " + parseInt(cibleCe7Jmin) + " - " + parseInt(cibleCe7Jmax)
        }
    }
    if (ChargeChronique) {
        document.getElementById("charge-28j").textContent = ChargeChronique
    }

    // recup de l'interpretation et affichage
    let Interpretation = await InterpretationJRM(Ratio, AnalysePossible)
    if (Interpretation && HTMLInterpretationJRM) {
        HTMLInterpretationJRM.innerHTML = Interpretation
    }

    // Generation Graphique
    if (ChargeDatas.length <= 0) {
        ChargeDatas = [0, 0, 0]
    }
    
    genererGraphiqueLine(["S-4", "S-3", "S-2", "S-1"], ChargeDatas)
}


window.addEventListener("DOMContentLoaded", () => {
    Initialisation()
})

// Pour recharger le graphique si c'est dans le BFCache
window.addEventListener("pageshow", (event) => {
    if (event.persisted) { // Si la page est dans le BFCache alors on relance le graphique
        Initialisation()
    }
})