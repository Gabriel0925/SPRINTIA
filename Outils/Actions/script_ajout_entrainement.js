const SportIdChamps = { // sport avec les id correspondant aux champs de datas spécifique aux sports
    "Libre": ["distance-entrainement-user"],

    "Course": ["distance-entrainement-user", "denivele-entrainement-user", "allure-moy-entrainement-user", "vitesse-max-entrainement-user", "cadence-moy-entrainement-user", "nb-pas-entrainement-user"],
    "Marche": ["distance-entrainement-user", "denivele-entrainement-user", "allure-moy-entrainement-user", "nb-pas-entrainement-user"],
    "Randonnée": ["distance-entrainement-user", "denivele-entrainement-user", "altitude-max-entrainement-user", "allure-moy-entrainement-user", "nb-pas-entrainement-user"],
    "Vélo": ["distance-entrainement-user", "denivele-entrainement-user", "vitesse-moy-entrainement-user", "vitesse-max-entrainement-user", "cadence-moy-entrainement-user"],

    "Badminton": ["nb-coups-entrainement-user", "nb-sets-entrainement-user", "vitesse-smash-entrainement-user", "nb-points-entrainement-user", "nb-pas-entrainement-user"],
    "Tennis": ["nb-coups-entrainement-user", "nb-sets-entrainement-user", "vitesse-smash-entrainement-user", "nb-points-entrainement-user", "nb-pas-entrainement-user"],
    "Tennis de table": ["nb-coups-entrainement-user", "nb-sets-entrainement-user", "vitesse-smash-entrainement-user", "nb-points-entrainement-user", "nb-pas-entrainement-user"],

    "Boxe": ["nb-coups-entrainement-user", "nb-combats-entrainement-user", "nb-victoires-entrainement-user", "nb-defaites-entrainement-user"],
    "Judo": ["nb-combats-entrainement-user", "nb-victoires-entrainement-user", "nb-chutes-entrainement-user"],

    "Basketball": ["distance-entrainement-user", "score-entrainement-user", "nb-pas-entrainement-user"],
    "Football": ["distance-entrainement-user", "score-entrainement-user", "nb-pas-entrainement-user"],
    "Handball": ["distance-entrainement-user", "score-entrainement-user", "nb-pas-entrainement-user"],
    "Rugby": ["distance-entrainement-user", "score-entrainement-user", "nb-pas-entrainement-user"],
    "Volley": ["nb-services-entrainement-user", "nb-smash-entrainement-user", "nb-sets-entrainement-user", "score-entrainement-user"],

    "CrossFit": ["muscles-travailles-entrainement-user", "nb-reps-entrainement-user", "nb-series-entrainement-user", "poids-total-entrainement-user"],
    "HIIT": ["muscles-travailles-entrainement-user", "nb-reps-entrainement-user", "nb-series-entrainement-user"],
    "Musculation": ["muscles-travailles-entrainement-user", "nb-reps-entrainement-user", "nb-series-entrainement-user", "poids-total-entrainement-user"],
    "Rameur d'intérieur": ["distance-entrainement-user", "coups-rame-entrainement-user", "allure-moy-entrainement-user", "cadence-moy-entrainement-user"],

    "Aviron": ["distance-entrainement-user", "allure-moy-entrainement-user", "cadence-moy-entrainement-user", "coups-rame-entrainement-user"],
    "Natation": ["distance-entrainement-user", "allure-moy-entrainement-user", "nb-longueurs-entrainement-user", "longueur-bassin-entrainement-user"],
    "Paddle": ["distance-entrainement-user", "allure-moy-entrainement-user", "cadence-moy-entrainement-user", "coups-rame-entrainement-user"],

    "Ski": ["distance-entrainement-user", "denivele-entrainement-user", "altitude-max-entrainement-user", "nb-descentes-entrainement-user", "vitesse-moy-entrainement-user", "vitesse-max-entrainement-user"],
    "Ski de fond": ["distance-entrainement-user", "denivele-entrainement-user", "altitude-max-entrainement-user", "vitesse-moy-entrainement-user", "vitesse-max-entrainement-user"],
    "Snowboard": ["distance-entrainement-user", "denivele-entrainement-user", "altitude-max-entrainement-user", "nb-descentes-entrainement-user", "vitesse-moy-entrainement-user", "vitesse-max-entrainement-user"],

    "Corde à sauter": ["nb-tours-entrainement-user", "cadence-moy-entrainement-user", "serie-max-entrainement-user"],
    "Escalade": ["voies-effectuees-entrainement-user", "difficulte-max-entrainement-user", "nb-chutes-entrainement-user"],
}

let IdEditWorkout = null // init variable globale
let noteEntrainement = undefined

async function MessagePrevention() {
    // Check du statut du user
    let HistoriqueDB = await db.statut_analyse.toArray()

    let StatutData = HistoriqueDB.map(statutBDD => statutBDD.statut).reverse() // reverse pour inverser la liste pour l'ordre

    // Unit 
    let LastStatutUser = ""
    if (StatutData.length > 0) {
        // on prend l'index 0 pour avoir son dernier statut
        LastStatutUser = StatutData[0]
    } else {
        // si il n'y a pas de statut on le met sur actif
        LastStatutUser = "Actif·ve"
    }
    
    // Vérif + message de prévention
    if (LastStatutUser == "Vacances") {
        alert("Tu es en vacances et tu t'entraînes quand même ! Tu es très discipliné·e mais va y tranquille les vacances c'est fait pour ça aussi.")
    } else if (LastStatutUser == "Blessure") {
        alert("Attention ! Tu as signalé une blessure. Faire un entraînement va aggraver ta blessure, privilégie la récupération pour pouvoir revenir plus fort·e.")
    } else if (LastStatutUser == "Malade") {
        alert("Tu as signalé que tu étais malade, ce n'est pas très mature de faire un entraînement, ton organisme a besoin de repos pour guérir. Si tu tiens à ton entraînement, essaie de faire un entraînement léger en intensité.")
    } 
            
    return
}

async function VerificationParam() {
    const ParametreURL = window.location.search // on recherche si il y a un param dans l'URL (ex : ?edit=7)
    let TableauSeparation = ParametreURL.split("=") // exemple ['?edit', '7']

    if (TableauSeparation.length == 2) { // vérification si il y a bien 2 partie
        // conversion de l'id en int
        const ID = parseInt(TableauSeparation[1])

        // Recup des datas du workout
        if (ID) { 
            // on change la variable globale
            IdEditWorkout = ID
            const WorkoutDB = await db.entrainement.get(ID) // la méthode .get permet de recup direct les datas de l'id coresspondant

            if (WorkoutDB) { // on vérifie si il y a des données au cas ou le user a supprimer son workout
                // on commence par changer le H1 de la page
                document.getElementById("title-page").textContent = "Modification de l'entraînement"
                document.getElementById("coach-ajoute-entrainement").style.display = "none"

                // Remettre les champs adaptée au sport
                dataSpecifique(WorkoutDB.sport, false)

                // remplissage des champs qu'on ne peut pas remplir dans la boucle foreach
                document.getElementById("profil-sport").value = WorkoutDB.sport
                document.getElementById("duree-entrainement-user").value = dureeFormatee(WorkoutDB.duree, "hh:mm:ss") // on exige le format "hh:mm:ss"
                // remettre le RPE sur bonne position
                document.querySelector(".slider input").value = WorkoutDB.rpe
                document.querySelector(".slider progress").value = WorkoutDB.rpe
                document.querySelector(".slider-value").textContent = WorkoutDB.rpe

                // ajout d'une data a la variable globale
                if (WorkoutDB.note != undefined || WorkoutDB.note != "") {
                    noteEntrainement = WorkoutDB.note
                }

                // tableau des datas à ne pas rentrer dans un input
                const tableauDataNotInInput = ["sport", "duree", "rpe", "charge_entrainement", "id"]

                // .entries c'est pour récupérer la clé et valeur d'un dico/object
                Object.entries(WorkoutDB).forEach(([cle, valeur]) => {
                    if (tableauDataNotInInput.includes(cle)) {
                        // pass
                    } else {
                        const idData = cle.replace("_", "-") + "-entrainement-user"
                        
                        let input = document.getElementById(idData)
                        if (input && valeur != null && valeur != undefined) {
                            if (WorkoutDB.sport == "Natation" || WorkoutDB.sport == "Rameur d'intérieur" || WorkoutDB.sport == "Aviron" || WorkoutDB.sport == "Paddle") {
                                if (cle == "distance") {
                                    valeur = valeur*1000
                                }
                            }
                            input.value = valeur // on affiche la valeur de la bdd dans le input correspondant à l'id de la donnée
                        }
                    }
                });

                // --- Pour mettre à jour les champs en fonction de l'unité du sport
 
                // partie pour gérer la distance entre m et km
                let inputDistance = document.getElementById("distance-entrainement-user")
                if (WorkoutDB.sport == "Natation" || WorkoutDB.sport == "Rameur d'intérieur" || WorkoutDB.sport == "Aviron" || WorkoutDB.sport == "Paddle") { 
                    if (inputDistance) {
                        inputDistance.placeholder = "Distance (m)"
                        inputDistance.nextElementSibling.textContent = "Distance (m)"
                    }

                } else { // si le sport n'est pas la natation ou le rameur alors, on affiche la distance en km
                    if (inputDistance) {
                        inputDistance.placeholder = "Distance (km)"
                        inputDistance.nextElementSibling.textContent = "Distance (km)"
                    }

                }

                // partie pour gérer l'allure entre /km, /500m, /100m
                let inputAllureMoy = document.getElementById("allure-moy-entrainement-user")
                if (WorkoutDB.sport == "Natation") { 
                    if (inputAllureMoy) {
                        inputAllureMoy.placeholder = "Allure moy. (/100m)"
                        inputAllureMoy.nextElementSibling.textContent = "Allure moy. (/100m)"
                    }

                } else if (WorkoutDB.sport == "Rameur d'intérieur" || WorkoutDB.sport == "Aviron" || WorkoutDB.sport == "Paddle") {
                    if (inputAllureMoy) {
                        inputAllureMoy.placeholder = "Allure moy. (/500m)"
                        inputAllureMoy.nextElementSibling.textContent = "Allure moy. (/500m)"
                    }

                } else { // si le sport n'est pas la natation ou le rameur alors, on affiche la distance en km
                    if (inputAllureMoy) {
                        inputAllureMoy.placeholder = "Allure moy. (/km)"
                        inputAllureMoy.nextElementSibling.textContent = "Allure moy. (/km)"
                    }

                }

                // partie pour gérer la cadence moy entre ppm, tpm, cpm
                let inputCadenceMoy = document.getElementById("cadence-moy-entrainement-user")
                if (WorkoutDB.sport == "Vélo" || WorkoutDB.sport == "Corde à sauter") { 
                    if (inputCadenceMoy) {
                        inputCadenceMoy.placeholder = "Cadence moy (tpm)"
                        inputCadenceMoy.nextElementSibling.textContent = "Cadence moy (tpm)"
                    }

                } else if (WorkoutDB.sport == "Course") {
                    if (inputCadenceMoy) {
                        inputCadenceMoy.placeholder = "Cadence moy (ppm)"
                        inputCadenceMoy.nextElementSibling.textContent = "Cadence moy (ppm)"
                    }

                } else { // pr tout les autres sports
                    if (inputCadenceMoy) {
                        inputCadenceMoy.placeholder = "Cadence moy (cpm)"
                        inputCadenceMoy.nextElementSibling.textContent = "Cadence moy (cpm)"
                    }

                }

            } else {  // si il y a rien dans la bdd par rapport à l'id correspond alors on demarre le mode normal 
                dataSpecifique("Libre", true) // pour éviter que la fonction mettent une alert comme quoi il n'y a pas plus de données à afficher
                await JrmCoach()
                await MessagePrevention()
            }

        } else {
            dataSpecifique("Libre", true) // pour éviter que la fonction mettent une alert comme quoi il n'y a pas plus de données à afficher
            await JrmCoach()
            await MessagePrevention()
        }
    } else {        
        dataSpecifique("Libre", true) // pour éviter que la fonction mettent une alert comme quoi il n'y a pas plus de données à afficher
        await JrmCoach()
        await MessagePrevention()
    }

    return
}

function dataSpecifique(sportChoisi, firstChargement) {
    // recup du texte de la div : 'Plus de données'
    let textButtonDataSpe = document.querySelector(".button-more-data-text")
    let typeDisplay = "block"
    // variable qui changerai en fonction de si les champs spécifique sont dépliés ou non

    // recupération du tableau (tableau présent dans un dico) des id des input en fonction du sport
    const tableauIdChampsSpecifique = SportIdChamps[sportChoisi]
    
    if (textButtonDataSpe && firstChargement != true) {
        // si le text de la div est "plus de données" alors on met "moins de données" et inversement
        if (textButtonDataSpe.textContent == "Plus de données") {
            textButtonDataSpe.textContent = "Moins de données"
        } else { // ça veut dire que le user a cliqué sur moins de data
            textButtonDataSpe.textContent = "Plus de données"
            typeDisplay = "none" // on change le contenu de la variable pour pouvoir cacher les input
        }

        tableauIdChampsSpecifique.forEach(element => {
            let input = document.getElementById(element)
            if (input) {
                // on prend le parent de l'input cest a dire le conteneur de linput
                input.parentElement.style.display = typeDisplay // on le cache ou on l'affiche suivant laction du user
            }
        });

    } 
}

function GenererNbAleatoire() {
    // Nb aléatoire
    let NombreAleatoire = Math.random() // renvoie aléatoirement entre 0 et 1 (ex : 0.5890953759539541)
    NombreAleatoire = Math.floor(NombreAleatoire*10) //fois 10 et nb arrondi pour avoir par exemple 5.8 puis 5 grace a l'arrondi

    return NombreAleatoire
}

async function JrmCoach() {
    // Recup du champs coach
    let SectionCoach = document.getElementById("reponse-coach")

    // Phrase JRM
    const CoachBienveillant = {
        0: [
            "Alors cette séance ? Tout s'est bien passé ?",
            "Bravo ! Tu as assuré aujourd'hui ! J'espère que cette séance t'a fais du bien mentalement et physiquement.",
            "Une séance de plus, un pas de plus !",
            "La séance de sport était bonne ? Bonnes sensations ?",
            "T'as kiffé ou souffert ?",
            "Tu as gagné ton dodo/ton repas ?",
            "Ça t'a boosté ou vidé ?",
            "Tu viens de te défouler ! T'es content de ta séance ?",
            "Tu es content·e de ta séance ou tu es déçu·e ?",
            "Tu as cru que tu allais lâcher ?"
        ],
        1: [
            "Chaque effort compte. Ne lâche rien ! La discipline est la clé des plus grands objectifs !",
            "Si tu veux un conseil, la régularité est toujours meilleure que l'intensité. Il vaut mieux faire 3 petites séances qu'une grosse séance par semaine.",
            "Peu importe les chiffres, ce qui compte, c’est que tu as pris du temps pour faire ton sport !",
            "Top la séance, mais il faut continuer à se perfectionner pour continuer à progresser !",
            "Sans nos rêves nous sommes morts·es ! Alors crois en tes rêves.",
            "Tu sais où tu es et tu sais où tu veux aller donc continue à travailler !",
            "C'est ton mental qui doit guider ton corps et non l'inverse !",
            "Parfois, pendant le sport on peut galérer mais pense toujours à l'après effort !",
            "Apprends du passé et concentre-toi sur le futur !",
            "Ne te compare pas aux autres, compare-toi à la version que tu étais hier !"
        ],
        2: [
            "Peu importe le sport, le renforcement musculaire peut te permettre de prévenir les blessures,...",
            "Après une séance de sport, le mieux pour ton corps c'est de boire de l'eau. Ça permet à ton corps de récupérer plus rapidement.",
            "Sache qu'il ne faut pas négliger les baskets que tu utilises quand tu fais du sport !",
            "Après un entraînement comme celui-ci je te conseille de prendre une banane ou des amandes !",
            "C'est quand tu es dans le dur que tu progresses vraiment !",
            "Si tu as une douleur, ça sert à rien de forcer dessus ! Repose-toi et reviens plus fort·e !",
            "Fais des étirements légers avant de te coucher, ça permettra à ton corps de récupérer plus vite !",
            "Quand tu as la flemme de faire du sport, met-toi en tenue dès que tu te lèves. Ça serait bête de l'enlever le soir sans avoir fait son sport.",
            "Donne l'exemple sans rien attendre en retour ! Motive tes amis·es à faire du sport, c'est super important pour eux.",
            "Les progrès ça se construit séance après séance et aujourd'hui tu viens d'en ajouter une de plus à ton parcours ! Félicitations !"
        ]
    }

    const CoachStrictMotivant = {
        0: [
            "Enfin, tu as terminé ta séance ! J'espère que tu en es satisfait.",
            "J'espère que tu t'es donné·e à fond pendant cet entraînement !",
            "Alors, d'après toi, tu trouves que tu as fait un bon entraînement ?",
            "Bien joué pour cette séance, mais garde cette même régularité dans tes entraînements.",
            "Tu penses avoir réussi ton entraînement ? Le plus important, c'est d'avoir pris du plaisir à faire cette séance.",
            "Cette séance ne t'a pas trop posé problème ?",
            "J'espère que cette séance t'a fait du bien physiquement et mentalement.",
            "Tu as tout donné ? J'espère parce que si je pouvais je te ferais cracher tes poumons lors du prochain entraînement.",
            "Tu ne t'es pas trop endormi·e pendant cette séance ? Je rigole bien sûr !",
            "J'adore ta régularité, j'espère que tu resteras sur cette voie."
        ],
        1: [
            "Tu sais qu'il vaut mieux faire des erreurs à l'entraînement plutôt qu'en compétition. Les erreurs font partie de la réussite.",
            "Tu sais que faire des erreurs, c'est une chance et c'est souvent ça qui mène des athlètes à la réussite.",
            "Ne regrette jamais tes dernières performances ? Sache que tu es allé·e t'entraîner, et rien que ça, ce n'est pas une habitude pour tout le monde, donc crois en toi ! Les résultats arriveront...",
            "Regarde tout ce que tu as accompli dans le passé et pense à ce que tu pourrais faire dans le futur !",
            "C'est dans le dur que tu progresses vraiment et c'est à ce moment là qu'on voit qui on est.",
            "Ne te compare pas aux autres ! Compare-toi à la personne que tu étais hier !",
            "Si c’était facile, tout le monde ferait du sport. Mais toi, tu n'es pas tout le monde.",
            "Ne regrette jamais une séance, regrette seulement celles que tu as zappées.",
            "La douleur est temporaire, mais la fierté de t'être dépassé·e, elle, reste à vie.",
            "Quand tu crois que tu n'as plus rien à donner, en réalité tu as encore 20% de réserve. C’est là que tout se joue. Alors, essaie de toujours puiser dans cette réserve lors de tes séances intensives."
        ],
        2: [
            "Avoir un objectif en tête permet de gagner en régularité et en discipline, si tu manques de régularité tu sais ce qui te reste à faire.",
            "Ton corps s’ennuie vite, essaie de changer de séance toutes les semaines pour continuer à progresser.",
            "Mange des repas équilibrés, protéinés avec des glucides sains et des légumes et trust the process.",
            "Si tu as des courbatures, c'est bien, mais si tu as une douleur fais une pause ! Par contre, si c'est juste la flemme, bouge-toi.",
            "1 répétition de plus ? C’est une victoire. Fête ça, mais reste focus sur tes objectifs.",
            "Avant de commencer une séance, saute, bouge, fais monter ton cardio pour éviter de te blesser bêtement !",
            "Bois avant d’avoir soif, sinon c’est déjà trop tard. Ton corps est une machine, tu dois lui donner de l'essence pour la faire fonctionner.",
            "Quand ton cerveau te dit d'arrêter, c’est là qu’il faut pousser. La différence entre toi et les autres ? Eux écoutent cette voix, mais toi, tu la domptes.",
            "Tu n'as pas besoin d’être le/la plus fort·e ou le/la plus rapide aujourd’hui. Mais si tu es le/la plus régulier·e, tu finiras par tous les écraser. N'oublie jamais que les performances ça se construit.",
            "Rappelle-toi toujours où tu es et regarde où tu veux aller."
        ]
    }

    const CoachCopain = {
        0: [
            "Tu t'es bien entraîné·e ?",
            "Alors cet entraînement ? Tu as encore cartonné ?",
            "Tu t'es donné à fond j'espère !",
            "Hey, ça va ?! Pas trop fatigué·e !",
            "Mais non !! Ça va toi ? Alors cette séance pas trop compliquée ?",
            "Aujourd'hui, c'était entraînement pour toi et pour moi c'est analyse.",
            "Hello, encore un entraînement ! Bravo ! ",
            "Je suis sûr que tu as assuré !",
            "Comment ça va ? Pas trop dur cette séance ?",
            "Tu t'es épuisé·e ou alors tu t'es juste reposé·e sur tes acquis ?"
        ],
        1: [
            "Pendant une séance si tu galères, pense à une personne que tu aimes bien ou à ton idole, ça t'aidera à dépasser tes limites.",
            "Pense toujours à l'après entraînement quand tu galères ! Imagine-toi en train de bouffer un gros tacos ou faire quelque chose qui te fait plaisir.",
            "J'espère que tu as tout donné sur le terrain ! Tu es cap de faire 10 pompes après cette sortie ?",
            "Tous les soirs au lieu d'être sur ton tel, fais 10 pompes, 10 abdos et 10 squats ! Tu verras tes performances vont nettement s'améliorer.",
            "Tu as foiré ta séance ? Pas grave ! Après tout tu es quand même allé·e t'entraîner, bien joué.",
            "En vrai, une séance de sport c'est quoi dans votre vie ? C'est pas grand chose donc prenez toujours ce temps.",
            "Continue à travailler, concentre-toi et tu vas tous les choquer ! Dont moi !",
            "Pour toujours être motivé et progresser, fais évoluer tes séances pour ne pas rentrer dans l'habitude.",
            "La clé de la réussite c'est la concentration, la discipline et le dépassement de soi.",
            "Compare-toi toujours à la personne que tu étais hier ! Ça doit être ton plus grand rival !"
        ],
        2: [
            "Le plus important dans le sport, c'est la régularité; la motivation c'est juste cool pour les premières semaines.",
            "Après une séance comme celle-ci, tu as le droit à une récompense, tu le mérites, par contre je te laisse choisir ta récompense. ",
            "Si tu ne t'es pas donné·e à fond lors de cet entraînement, bah pense à te donner à fond la prochaine fois !",
            "Tu connais le 80/20 ? Pour une prépa c'est le top. Tu dois faire 80% du temps de ton entraînement à faible intensité et 20% du temps en effort intense.",
            "Je te donne un défi pour ton prochain entraînement : teste la séance pyramide en course à pied. Renseigne-toi sur cette séance et test si tu es cap.",
            "La nutrition ça joue aussi dans tes performances. Donc, essaie toujours de manger des aliments non transformés.",
            "Essaie de boire 2 à 3 verres d'eau après cet entraînement, ça permettra à ton corps de récupérer plus vite.",
            "J'espère qu'avant cet entraînement tu t'es échauffé·e, parce que l'échauffement c'est crucial !",
            "Gére ton effort dès le début de ton entraînement : ne pars pas à fond sur les premières répétitions pour éviter de te cramer dès le départ.",
            "Laisse du temps à ton corps pour récupérer, ça lui fera du bien et tu seras moins fatigué·e."
        ]
    }

    const CoachGoMuscu = {
        0: [
            "Tu as senti une douleur quelque part ? Si oui, parle-en à un médecin, ça sert à rien de forcer comme un·e bourrin·ne.",
            "Tu es allé·e à l'échec ou alors tu t'es aidé de l'élan pour finir ta répétition ?",
            "Tu as battu ton PR ? Si oui : tu es une machine ! Si non : ne t'inquiète pas, la prochaine fois, tu vas tout péter !",
            "Tu as bu assez d’eau pendant ta séance ? J'espère que oui sinon, va boire maintenant !",
            "Tu as écouté de la musique pendant ta séance ? Parce que moi, je sais qu'une bonne playlist, ça fait +20% de performance.",
            "Tu as fait tes étirements ? Non ? Tu es en train de préparer tes courbatures pour demain. Va t'étirer, ça prend 5 minutes.",
            "Demain, n'oublie pas, c'est le Leg Day. Pour les nuls en anglais, ça veut dire : 'la séance consacrée aux jambes'",
            "Tu as fait un échauffement avant ou tu as fait ta séance directement comme un·e bourrin·ne ? Parce que moi, je sais que l’échauffement, c’est +50% de performance !",
            "Tu es content·e de ta séance ou tu es déçu·e ? Si tu es déçu·e n'oublie jamais que le plus important c'est d'avoir fait sa séance et d'avoir pris du plaisir.",
            "Tu as mangé des protéines après ta séance ? J'espère parce que c'est pas comme ça que tu vas devenir énorme et sec·he !"
        ],
        1: [
            "La discipline, c’est la clé. Et toi, tu as cette clé qui va te permettre de tout exploser !",
            "Le mental est plus important que les muscles, j'espère que tu n'écoutes pas cette voix dans ta tête qui te dit d'arrêter.",
            "Un effort de plus, c’est un pas de plus vers tes objectifs. Continue comme ça !",
            "100% d’efforts, 0% de regrets. Tu es sur la bonne voie, champion·ne !",
            "La souffrance, c’est temporaire. Les résultats, eux, restent. Tu es très fort·e. Pour continuer d'être au sommet, va pousser de la fonte demain.",
            "Tu fais de la muscu, alors prouve-le ! Fais 20 pompes là maintenant ! Non, je ne rigole pas allez bouge-toi.",
            "Je vous lance un petit défi : ce soir avant d'aller te coucher tu feras 10 pompes, 10 squats et 10 dips et seulement après tu pourras aller dormir !",
            "Chaque goutte de sueur perdue, c’est un pas de plus vers la version de toi énorme et sec·he.",
            "Tu connais le '7-7-7' ? Non ? C'est un circuit à faire après une séance : 7 Burpees, 7 Pompes, 7 Squats sautés, je te mets au défi de réussir ce circuit.",
            "Ne compare jamais ton physique aux autres, compare-le à la version de ton corps d'hier !"
        ],
        2: [
            "Tu sais ce que c'est d'avoir le pump ? C'est quand tu ressens la congestion de ton muscle pendant une séance.",
            "Tu connais le programme : 'Push, Pull, Legs' ? Non ? Bah demande à Gemini peut-être que tu vas comprendre.",
            "Les protéines après l’entraînement, c'est le top ! Oeufs, poulet, fromage blanc... Tu as l’embarras du choix !",
            "Après un entraînement comme celui-ci, je te conseille de prendre une banane ou des amandes !",
            "Les glucides, c’est ton carburant pour ta séance de muscu tu as le choix entre : des pâtes complètes, du riz,...",
            "La récupération c’est sacré. Dors 7 à 8h par nuit, tes muscles te diront merci.",
            "Évite les sucres rapides avant le sport, privilégie les sucres lents. En gros, ça veut dire que tu ne dois pas prendre un soda par contre, prends un fruit.",
            "Respire bien pendant l’effort. Inspire par le nez, expire par la bouche. Tu es une machine !",
            "Hydrate-toi avant, pendant et après l’effort. L’eau, c’est ton meilleur allié !",
            "Les muscles ça se construit séance après séance, et aujourd'hui tu viens d'en ajouter une de plus à ton parcours ! Félicitations !"
        ]
    }
    
    // Déterminer le coach choisis du user
    let CoachUserDB = await db.JRM_Coach.toArray()
    let StyleCoachUser = CoachBienveillant // attribution du style de coach a utilisé
    if (CoachUserDB.length > 0) {  // si le user a enregistré qqch alors on met le style du coach qu'il a choisis
        let TableauStyleCoach = CoachUserDB.map(elementDB => elementDB.style) // recup du style
        // On check le style de coach que le user a choisi et on attribue le dico correspondant
        if (TableauStyleCoach[0] == "Bienveillant") {
            StyleCoachUser = CoachBienveillant
        } else if (TableauStyleCoach[0] == "Strict-Motivant") {
            StyleCoachUser = CoachStrictMotivant
        } else if (TableauStyleCoach[0] == "Copain") {
            StyleCoachUser = CoachCopain
        } else {
            StyleCoachUser = CoachGoMuscu
        }
    }

    // générer le paragraphe
    let NombreAleatoire = 0
    let PhraseDico = ""
    let ParagrapheCoach = ""

    for (let i = 0; i <= 2; i++) {
        NombreAleatoire = GenererNbAleatoire() // nb aléatoire
        PhraseDico = StyleCoachUser[i][NombreAleatoire] // recherche dans le dico

        ParagrapheCoach += PhraseDico + " "
    }

    SectionCoach.textContent = ParagrapheCoach

    return
}

async function saveWorkout() {
    // Recup du bouton
    let BoutonSauvegarde = document.getElementById("button-sauvegarder")

    // Recup valeur des champs de base d'un entraînement
    let SportWorkoutUser = document.getElementById("profil-sport").value.trim()
    let DateWorkoutUser = document.getElementById("date-entrainement-user").value
    let NameWorkoutUser = document.getElementById("nom-entrainement-user").value.trim()
    let DureeWorkoutUser = document.getElementById("duree-entrainement-user").value.trim()
    let ValueRpeUser = parseInt(document.querySelector(".slider progress").value)
    let FcMoyUser = parseInt(document.getElementById("fc-moy-entrainement-user").value.trim())
    let FcMaxUser = parseInt(document.getElementById("fc-max-entrainement-user").value.trim())


    // Vérification des champs de base
    if (!DateWorkoutUser || !DureeWorkoutUser || !NameWorkoutUser) {
        alert("Les champs avec '*' sont obligatoire, vous devez les remplir.")
        return
    }

    // Prépa date pour les comparer ensuite
    const DateUserFormatee = new Date(DateWorkoutUser)
    const DateActuelle = new Date()
    if (DateUserFormatee > DateActuelle) { // Comparaison de 2 dates
        alert("La date ne peut pas être dans le future.")
        return
    }

    DureeWorkoutUser = conversionMinutes(DureeWorkoutUser)
    if (DureeWorkoutUser == null) {
        return
    }
    if (DureeWorkoutUser <= 0) {
        alert("Valeur non valide, la durée doit être un nombre supérieur à 0.")
        return
    }
    if (DureeWorkoutUser >= 1440) {
        alert("La durée de votre entraînement doit être inférieur à 24h00m.")
        return
    }

    // si pas de datas alors on met sur undefined
    if (!FcMoyUser) {FcMoyUser = undefined} else {
        if (FcMoyUser >= 220) {
            alert("Votre fréquence cardiaque moyenne doit être inférieur à 220 bpm.")
            return
        } else if (FcMoyUser <= 50) {
            alert("Votre fréquence cardiaque moyenne doit être supérieur à 50 bpm.")
            return
        }
    }
    if (!FcMaxUser) {FcMaxUser = undefined} else {
        if (FcMaxUser >= 220) {
            alert("Votre fréquence cardiaque maximum doit être inférieur à 220 bpm.")
            return
        } else if (FcMaxUser <= 50) {
            alert("Votre fréquence cardiaque maximum doit être supérieur à 50 bpm.")
            return
        }
    }

    // init
    let chargeWorkout = 0
    // Calcul Charge
    chargeWorkout = Math.floor(DureeWorkoutUser*ValueRpeUser)
    // si la charge est inférieur à 1 alors on la met a 1
    if (chargeWorkout < 1) {chargeWorkout = 1}
    
    // base du dico qu'on enregistrera
    let workoutData = {
        sport: SportWorkoutUser,
        date: DateWorkoutUser,
        nom: NameWorkoutUser,
        duree: DureeWorkoutUser,
        rpe: ValueRpeUser,
        fc_moy: FcMoyUser,
        fc_max: FcMaxUser,
        charge_entrainement: chargeWorkout
    }

    // on regarde qu'elle champs on doit sauvegarde en stockant dans un tableau
    const tableauIdChampsSpe = SportIdChamps[SportWorkoutUser]

    // si il y a un tableau
    if (tableauIdChampsSpe.length > 0) {
        for (const element of tableauIdChampsSpe) {
            const input = document.getElementById(element) // on recup l'input

            if (input) { // si il y en a un alors
                // on enleve -entrainement-user et on remplace '-' en "_" pour avoir le nom de la clé dans la BDD
                const cleData = element.replace("-entrainement-user", "").replace("-", "_")

                let data = input.value.trim() // on recup ce que le user a saisi
                if (input.type == "number") { // si c'est un input number on convertit en nombre floatant
                    data = parseFloat(data)
                }

                if (data != "") {
                    // si le sport est natation, la distance est en metre donc on la convertit en km
                    if (SportWorkoutUser == "Natation" || SportWorkoutUser == "Rameur d'intérieur" || SportWorkoutUser == "Aviron" || SportWorkoutUser == "Paddle") {
                        if (cleData == "distance") {
                            if (!isNaN(Number(data))) { // on regarde si il y a du contenu dans le input, la data
                                data = data/1000 // on remet en kilomètres
                            }
                        }
                    }

                    // --- Vérification des champs spécifique ---   
                    if (cleData == "distance") { // vérification pour le champs distance
                        if (data) { // si il y a des datas dans le input

                            // vérification
                            if (data <= 0) {
                                alert("Valeur non valide, la distance doit être un nombre supérieur à 0.")
                                return
                            }
                            if (data >= 1000) {
                                alert("La distance de votre entraînement ne doit pas dépasser 1000 kilomètres.")
                                return
                            }
                        }
                    } else if (cleData == "denivele") { // vérification pour le champs denivele
                        if (data) { // si il y a des datas dans le input

                            // vérification
                            if (data <= 0) {
                                alert("Valeur non valide, le denivele doit être un nombre supérieur à 0.")
                                return
                            }
                            if (data >= 10000) {
                                alert("Le denivele de votre entraînement ne doit pas dépasser 10 000 m.")
                                return
                            }
                        }
                    } else if (cleData == "vitesse_max" || cleData == "vitesse_smash") { // vérification pour le champs vitesse_max
                        if (data) { // si il y a des datas dans le input

                            // vérification
                            if (data <= 0) {
                                alert("Valeur non valide, la vitesse doit être un nombre supérieur à 0.")
                                return
                            }
                            if (data >= 200) {
                                alert("La vitesse de votre entraînement ne doit pas dépasser 200 km/h.")
                                return
                            }
                        }
                    } else if (cleData == "cadence_moy") { // vérification pour le champs cadence_moy
                        if (data) { // si il y a des datas dans le input

                            // vérification
                            if (data <= 0) {
                                alert("Valeur non valide, la cadence moyenne doit être un nombre supérieur à 0.")
                                return
                            }
                            if (data >= 600) {
                                alert("La cadence moyenne de votre entraînement doit être un nombre inférieur à 600.")
                                return
                            }
                        }
                    } else if (cleData == "nb_pas") { // vérification pour le champs nb_pas
                        if (data) { // si il y a des datas dans le input

                            // vérification
                            if (data <= 0) {
                                alert("Valeur non valide, le nombre de pas doit être un nombre supérieur à 0.")
                                return
                            }
                            if (data >= 800000) {
                                alert("Le nombre de pas de votre entraînement doit être un nombre inférieur à 800000.")
                                return
                            }
                        }
                    } else if (cleData == "altitude_max") { // vérification pour le champs altitude_max
                        if (data) { // si il y a des datas dans le input

                            // vérification
                            if (data <= 0) {
                                alert("Valeur non valide, l'altitude maximum doit être un nombre supérieur à 0.")
                                return
                            }
                            if (data >= 10000) {
                                alert("L'altitude maximum de votre entraînement doit être un nombre inférieur à 10000.")
                                return
                            }
                        }
                    } else if (cleData == "vitesse_moy") { // vérification pour le champs vitesse_moy
                        if (data) { // si il y a des datas dans le input

                            // vérification
                            if (data <= 0) {
                                alert("Valeur non valide, la vitesse moyenne doit être un nombre supérieur à 0.")
                                return
                            }
                            if (data >= 200) {
                                alert("La vitesse moyenne de votre entraînement doit être un nombre inférieur à 200.")
                                return
                            }
                        }
                    } else if (cleData == "nb_coups" || cleData == "nb_sets" || cleData == "nb_defaites" || cleData == "nb_chutes" || cleData == "nb_victoires" || cleData == "nb_combats" || cleData == "nb_points" || cleData == "nb_services" || cleData == "nb_smash" || cleData == "nb_reps" || cleData == "nb_series" || cleData == "nb_longueurs" || cleData == "nb_descentes" || cleData == "serie_max" || cleData == "nb_tours") { 
                        if (data) { // si il y a des datas dans le input

                            // vérification
                            if (data <= 0) {
                                alert(`Valeur non valide, le champs nommé : '${cleData}' doit être un nombre supérieur à 0.`)
                                return
                            }
                            if (data >= 1000000) {
                                alert(`Le champs nommé : '${cleData}' doit être un nombre inférieur à 1000000.`)
                                return
                            }
                        }
                    } else if (cleData == "coups_rame") { // vérification pour le champs coups_rame
                        if (data) { // si il y a des datas dans le input

                            // vérification
                            if (data <= 0) {
                                alert("Valeur non valide, les coups de rame doivent être un nombre supérieur à 0.")
                                return
                            }
                            if (data >= 10000) {
                                alert("Les coups de rame de votre entraînement doit être un nombre inférieur à 10000.")
                                return
                            }
                        }
                    }
                    
                    // on ajoute au dico la nouvelle valeur si elle n'est pas vide
                    workoutData[cleData] = data 
                }
            }
                
        }
    }
    // desactivation du bouton
    BoutonSauvegarde.disabled = true 
    BoutonSauvegarde.textContent = "Sauvegarde..."
    
    // variable pour gérer vers ou renvoyer
    let modificationEntrainement = false

    // enregistrement ou modification
    if (IdEditWorkout && IdEditWorkout != null) {
        workoutData["id"] = IdEditWorkout
        workoutData["note"] = noteEntrainement
        await db.entrainement.put(workoutData)
        // mise sur true pour renvoyer vers lentrainement directement
        modificationEntrainement = true
    } else {
        await db.entrainement.add(workoutData)
    }

    // Pause
    setTimeout(() => {
        // Remise bouton etat normal
        BoutonSauvegarde.textContent = "Sauvegarder"
        BoutonSauvegarde.disabled = false

        if (modificationEntrainement == true) {
            // Renvoie vers historique d'entraînement
            window.location.href = `entrainement.html?workout=${IdEditWorkout}` // on met un param dans l'URL
        } else {
            // Renvoie vers historique d'entraînement
            window.location.href = "historique_entrainement.html?workoutregister" // on met un param dans l'URL
        }
    }, 800)

    return
}

function cacherInput(value) { // pour cacher tout les champs de datas spécifique
    let inputAdvanced = document.querySelectorAll(".input-advanced") // on recup tout les input

    inputAdvanced.forEach(element => {
        let input = element.querySelector("input")

        if (input) {input.value = ""} // on les réinitialise donc on vide le champs input 

        element.style.display = 'none' // on les mets en display none
    });

    // partie pour gérer la distance entre m et km
    let inputDistance = document.getElementById("distance-entrainement-user")
    if (value == "Natation" || value == "Rameur d'intérieur" || value == "Aviron" || value == "Paddle") { // value c'est le sport du combobox
        if (inputDistance) {
            inputDistance.placeholder = "Distance (m)"
            inputDistance.nextElementSibling.textContent = "Distance (m)"
        }

    } else { // si le sport n'est pas la natation ou le rameur alors, on affiche la distance en km
        if (inputDistance) {
            inputDistance.placeholder = "Distance (km)"
            inputDistance.nextElementSibling.textContent = "Distance (km)"
        }

    }

    // partie pour gérer l'allure entre /km, /500m, /100m
    let inputAllureMoy = document.getElementById("allure-moy-entrainement-user")
    if (value == "Natation") { // value c'est le sport du combobox
        if (inputAllureMoy) {
            inputAllureMoy.placeholder = "Allure moy. (/100m)"
            inputAllureMoy.nextElementSibling.textContent = "Allure moy. (/100m)"
        }

    } else if (value == "Rameur d'intérieur" || value == "Aviron" || value == "Paddle") { // value c'est le sport du combobox
        if (inputAllureMoy) {
            inputAllureMoy.placeholder = "Allure moy. (/500m)"
            inputAllureMoy.nextElementSibling.textContent = "Allure moy. (/500m)"
        }

    } else { // si le sport n'est pas la natation ou le rameur alors, on affiche la distance en km
        if (inputAllureMoy) {
            inputAllureMoy.placeholder = "Allure moy. (/km)"
            inputAllureMoy.nextElementSibling.textContent = "Allure moy. (/km)"
        }

    }

    // partie pour gérer la cadence moy entre ppm, tpm, cpm
    let inputCadenceMoy = document.getElementById("cadence-moy-entrainement-user")
    if (value == "Vélo" || value == "Corde à sauter") { 
        if (inputCadenceMoy) {
            inputCadenceMoy.placeholder = "Cadence moy (tpm)"
            inputCadenceMoy.nextElementSibling.textContent = "Cadence moy (tpm)"
        }

    } else if (value == "Course") {
        if (inputCadenceMoy) {
            inputCadenceMoy.placeholder = "Cadence moy (ppm)"
            inputCadenceMoy.nextElementSibling.textContent = "Cadence moy (ppm)"
        }

    } else { // pr tout les autres sports
        if (inputCadenceMoy) {
            inputCadenceMoy.placeholder = "Cadence moy (cpm)"
            inputCadenceMoy.nextElementSibling.textContent = "Cadence moy (cpm)"
        }

    }
    
    let textButtonDataSpe = document.querySelector(".button-more-data-text")
    if (textButtonDataSpe) { 
        if (textButtonDataSpe.textContent != "Plus de données") {
            // on remet le text plus de données si ce nest pas deja le cas
            textButtonDataSpe.textContent = "Plus de données"
        }
    }
}

window.addEventListener("DOMContentLoaded", () => {
    cacherInput("") // pour cacher tout les champs de datas spécifique
    VerificationParam()
})