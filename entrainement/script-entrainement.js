const BddNomData = { // sport avec les id correspondant aux champs de datas spécifique aux sports
    "id": ["id", ""],
    "sport": ["Sport", ""],
    "date": ["Date", ""],
    "nom": ["Nom", ""],
    "duree": ["Durée", ""],
    "rpe": ["RPE", "/10"],
    "fc_moy": ["FC moyenne", "bpm"],
    "fc_max": ["FC maximum", "bpm"],
    "distance": ["Distance", ["km", "m"]],
    "denivele": ["Dénivelé", "m"],
    "allure_moy": ["Allure moyenne", ["/km", "/500m", "/100m"]],
    "vitesse_moy": ["Vitesse moyenne", "km/h"],
    "vitesse_max": ["Vitesse maximum", "km/h"],
    "cadence_moy": ["Cadence moyenne", ["ppm", "tpm", "cpm"]], 
    "nb_pas": ["Pas", ""],
    "altitude_max": ["Altitude maximum", "m"],
    "nb_coups": ["Nombre de coups", ""],
    "nb_sets": ["Nombre de sets", ""],
    "vitesse_smash": ["Vitesse de smash", "km/h"],
    "nb_points": ["Nombre de points", ""],
    "nb_combats": ["Nombre de combats", ""],
    "nb_victoires": ["Nombre de victoires", ""],
    "nb_defaites": ["Nombre de défaites", ""],
    "nb_chutes": ["Nombre de chutes", ""],
    "score": ["Score", ""],
    "nb_services": ["Nombre de services", ""],
    "nb_smash": ["Nombre de smash", ""],
    "nb_reps": ["Nombre de reps", ""],
    "nb_series": ["Nombre de séries", ""],
    "poids_total": ["Poids total", "kg"],
    "coups_rame": ["Coups de rame", ""],
    "nb_longueurs": ["Nombre de longueurs", ""],
    "nb_positions": ["Nombre de positions", ""],
    "longueur_bassin": ["Longueur du bassin", "m"],
    "nb_tours": ["Nombre de tours", ""],
    "serie_max": ["Séries maximum", ""],
    "nb_descentes": ["Nombre de descentes", ""],
    "voies_effectuees": ["Voies effectuées", ""],
    "difficulte_max": ["Difficulté maximum", ""],
    "muscles_travailles": ["Muscles travaillés", ""],
    "charge_entrainement": ["Charge d'entraînement", "CE"],
    "transpiration_estimee": ["Transpiration estimée", "mL"],
    "hydratation_estimee": ["Réhydratation conseillée", "mL"]
}
let idWorkout = undefined

function afficherData(dataWorkout) {
    // Structure de base de la page entrainement
    let structureHTML = `
        <h1>${dataWorkout.nom}</h1>

        <div class="toolbar">
            <p class="text-toolbar"><strong>${dataWorkout.sport}</strong><br>${formatEuropeenDate(dataWorkout.date)}</p>
            <i class="fs-icon_plus" id="button-group-button"></i>
        </div>

        <div class="menu-many-action">
            <li id="button-partager">
                <i class="fs-icon_file_json"></i>
                Exporter
            </li>
            <li id="button-modifier">
                <i class="fs-icon_modifier"></i>
                Modifier
            </li>
            <li id="button-supprimer">
                <i class="fs-icon_supprimer"></i>
                Supprimer
            </li>
        </div>
    
        <div class="zone-coach" id="coach-ajoute-entrainement" style="margin: var(--SPACE_M) 0;">
            <p class="zone-coach-name" id="nom-coach">JRM Coach :</p>
            <p class="zone-coach-interpretation" id="reponse-coach">
                Chargement...
            </p> 
        </div>

        <section class="container-block"> 

            <div class="container-block-data">
                <p class="container-block-data-header">Durée</p>
                <p class="container-block-data-data">${dureeFormatee(dataWorkout.duree)}</p>
            </div>
            <div class="container-block-data">
                <p class="container-block-data-header">RPE</p>
                <p class="container-block-data-data">${dataWorkout.rpe} <small>/10</small></p>
            </div>

        </section>
            
        <section class="container-block"> 

            <div class="container-block-data">
                <p class="container-block-data-header">Charge d'entraînement</p>
                <p class="container-block-data-data">
                    ${dataWorkout.charge_entrainement} 
                    <small>CE</small>
                </p>
            </div>

        </section>

        <section class="container-block"> 
    `
    
    // initialisation de 2 tableaux
    const tableauDataNotDisplay = ["id", "Nom", "Sport", "Date", "Durée", "RPE", "Charge d'entraînement"]
    const tableauDataSeule = ["Muscles travaillés", "Score", "Voies effectuées"]
    let sixSeven = false

    // on parcourt les datas de l'entraînement (c un dico donc on recup la cle et la valeur)
    Object.entries(dataWorkout).forEach(([cle, valeur]) => {
        if (cle=="note") {
            // si c'est la note on ne fais rien on le fera plus tard
        } else {
            const nomUniteData = BddNomData[cle] // on récupère le nom et l'unité de la data 
            const nomData = nomUniteData[0] // on récupère le nom de la data ex: muscles_travailles => Muscles travaillés

            let typeValeur = typeof(valeur) // on recup le type de la valeur
            if (typeValeur == "number") { // si c'est un number alors
                valeur = Number(valeur) // on convertit en nombre
                if (isNaN(valeur)) { // et si la valeur est NaN (=quand le user met rien dans le champs lors de l'enregistrement de datas)
                    valeur = null // on met sur null pour que la condition ci-dessous n'affiche pas cette data
                }
                if (valeur != null && valeur == 67) {sixSeven=true}
            }
            
            // initialisation
            let uniteData = ""
            if (cle == "cadence_moy") { // si la datas c'est cadence moy on prend ppm ou tpm ou cpm en fonction du sport
                if (dataWorkout.sport == "Course") {
                    uniteData = nomUniteData[1][0] // on récupère l'unité de la data  => ppm
                } else if (dataWorkout.sport == "Vélo" || dataWorkout.sport == "Corde à sauter") {
                    uniteData = nomUniteData[1][1] // on récupère l'unité de la data => tpm
                } else { // si c'est du rameur, aviron,...
                    uniteData = nomUniteData[1][2] // on récupère l'unité de la data => cpm
                }

            } else if (cle == "distance") {
                if (dataWorkout.sport == "Natation" || dataWorkout.sport == "Rameur d'intérieur" || dataWorkout.sport == "Aviron" || dataWorkout.sport == "Paddle") {
                    uniteData = nomUniteData[1][1] // on récupère l'unité de la data  => m
                    if (valeur != null) { // on passe des kilomètres en metres
                        valeur = Number(valeur) // on convertit en nombre pour etre sur
                        valeur = valeur*1000
                        valeur= valeur.toFixed(1).toString().replace(".", ",")
                    }
                } else {
                    uniteData = nomUniteData[1][0] // on récupère l'unité de la data  => km
                    if (valeur != null) { // on passe des kilomètres en metres
                        valeur = Number(valeur) // on convertit en nombre pour etre sur
                        valeur = valeur.toFixed(2).toString().replace(".", ",")
                    }
                }

            } else if (cle == "allure_moy") {
                if (dataWorkout.sport == "Natation") {
                    uniteData = nomUniteData[1][2] // on récupère l'unité de la data  => /100m 
                } else if (dataWorkout.sport == "Rameur d'intérieur" || dataWorkout.sport == "Aviron" || dataWorkout.sport == "Paddle") {
                    uniteData = nomUniteData[1][1] // on récupère l'unité de la data  => /500m 
                } else {
                    uniteData = nomUniteData[1][0] // on récupère l'unité de la data  => /km 
                }

            } else if (cle=="vitesse_max" || cle=="vitesse_moy" || cle=="poids_total") {
                uniteData = nomUniteData[1]
                if (valeur!=null) {
                    valeur = Number(valeur).toFixed(2).toString().replace(".", ",")
                } 

            } else {
                uniteData = nomUniteData[1] // on récupère l'unité de la data ex: distance => km
            }

            if (valeur != null || valeur != undefined) { // si il y a une datas en undefined ou null alors on n'affiche pas cette datas
                // on regarde si le nom de la data n'est pas dans le tableau car le nom, la date, le sport est dans la structure de base de la page html
                if (tableauDataNotDisplay.includes(nomData)) { 
                    // pass
                } else {
                    if (tableauDataSeule.includes(nomData)) { // on check si c'est une data qu'on doit afficher seul ou pas 
                        // on referme d'abord la section container-block on la rouvre puis on la referme
                        structureHTML += `
                            </section>

                            <section class="container-block">
                                <div class="container-block-data">
                                    <p class="container-block-data-header">${nomData}</p>
                                    <p class="container-block-data-data">${valeur} <small>${uniteData}</small></p>
                                </div>
                            </section>

                            <section class="container-block">
                        `

                    } else {
                        // si c'est un data normal alors on met la div correspondante
                        structureHTML += `
                            <div class="container-block-data">
                                <p class="container-block-data-header">${nomData}</p>
                                <p class="container-block-data-data">${valeur} <small>${uniteData}</small></p>
                            </div>
                        `
                    }
                }

            }
        }

    });

    structureHTML += `
        </section>

        <!-- Pour la note -->
        <h2>Note</h2>
        <textarea id="note-entrainement" oninput="apparitionButton()" maxlength=500 placeholder="Note de l'entraînement"></textarea>
        <button class="size-block" id="button-sauvegarder-note-workout" style="display: none;" onclick="saveDescription()">Sauvegarder la note</button>
    `

    // on ajoute au conteneur
    document.querySelector(".page-entrainement").innerHTML = structureHTML

    // on remplit le champs note entrainement si il y a du contenu dans la BDD
    if (dataWorkout.note != undefined && dataWorkout.note) {
        if (document.getElementById("note-entrainement")) { // on check si il y a un champs note sur la page
            document.getElementById("note-entrainement").value = dataWorkout.note
        }
    }

    if (dataWorkout.sport == "Sport de chambre") {logoDynamique("Quel athlète 😏")}
    else if (sixSeven==true) {logoDynamique("SIX-SEVEN")}

    return
}

function apparitionButton() {
    // on recup et affiche le bouton sauvegarder
    let buttonSave = document.getElementById("button-sauvegarder-note-workout")
    buttonSave.style.display = "block"
}

async function saveDescription() {
    let noteWorkout = document.getElementById("note-entrainement").value.trim()
    let buttonSave = document.getElementById("button-sauvegarder-note-workout")

    // message au user
    buttonSave.disabled = true
    buttonSave.textContent = "Sauvegarde..."
    
    // ne pas faire put sinon ça remplace update va rajouter cette data
    await db.entrainement.update(idWorkout, {
        note:noteWorkout
    })

    setTimeout(() => {
        buttonSave.textContent = "Sauvegardé"
    }, 650);

    setTimeout(() => {
        // remise à l'état d'origine
        buttonSave.disabled = false
        buttonSave.textContent = "Sauvegarder la note"
        buttonSave.style.display = "none"
    }, 1300);

    return
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
    let SectionNomCoach = document.getElementById("nom-coach")

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
            "Peu importe les chiffres, ce qui compte, c'est que tu as pris du temps pour faire ton sport !",
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
            "Si c'était facile, tout le monde ferait du sport. Mais toi, tu n'es pas tout le monde.",
            "Ne regrette jamais une séance, regrette seulement celles que tu as zappées.",
            "La douleur est temporaire, mais la fierté de t'être dépassé·e, elle, reste à vie.",
            "Quand tu crois que tu n'as plus rien à donner, en réalité tu as encore 20% de réserve. C'est là que tout se joue. Alors, essaie de toujours puiser dans cette réserve lors de tes séances intensives."
        ],
        2: [
            "Avoir un objectif en tête permet de gagner en régularité et en discipline, si tu manques de régularité tu sais ce qui te reste à faire.",
            "Ton corps s'ennuie vite, essaie de changer de séance toutes les semaines pour continuer à progresser.",
            "Mange des repas équilibrés, protéinés avec des glucides sains et des légumes et trust the process.",
            "Si tu as des courbatures, c'est bien, mais si tu as une douleur fais une pause ! Par contre, si c'est juste la flemme, bouge-toi.",
            "1 répétition de plus ? C'est une victoire. Fête ça, mais reste focus sur tes objectifs.",
            "Avant de commencer une séance, saute, bouge, fais monter ton cardio pour éviter de te blesser bêtement !",
            "Bois avant d'avoir soif, sinon c'est déjà trop tard. Ton corps est une machine, tu dois lui donner de l'essence pour la faire fonctionner.",
            "Quand ton cerveau te dit d'arrêter, c'est là qu'il faut pousser. La différence entre toi et les autres ? Eux écoutent cette voix, mais toi, tu la domptes.",
            "Tu n'as pas besoin d'être le/la plus fort·e ou le/la plus rapide aujourd'hui. Mais si tu es le/la plus régulier·e, tu finiras par tous les écraser. N'oublie jamais que les performances ça se construit.",
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
            "Tu as bu assez d'eau pendant ta séance ? J'espère que oui sinon, va boire maintenant !",
            "Tu as écouté de la musique pendant ta séance ? Parce que moi, je sais qu'une bonne playlist, ça fait +20% de performance.",
            "Tu as fait tes étirements ? Non ? Tu es en train de préparer tes courbatures pour demain. Va t'étirer, ça prend 5 minutes.",
            "Demain, n'oublie pas, c'est le Leg Day. Pour les nuls en anglais, ça veut dire : 'la séance consacrée aux jambes'",
            "Tu as fait un échauffement avant ou tu as fait ta séance directement comme un·e bourrin·ne ? Parce que moi, je sais que l'échauffement, c'est +50% de performance !",
            "Tu es content·e de ta séance ou tu es déçu·e ? Si tu es déçu·e n'oublie jamais que le plus important c'est d'avoir fait sa séance et d'avoir pris du plaisir.",
            "Tu as mangé des protéines après ta séance ? J'espère parce que c'est pas comme ça que tu vas devenir énorme et sec·he !"
        ],
        1: [
            "La discipline, c'est la clé. Et toi, tu as cette clé qui va te permettre de tout exploser !",
            "Le mental est plus important que les muscles, j'espère que tu n'écoutes pas cette voix dans ta tête qui te dit d'arrêter.",
            "Un effort de plus, c'est un pas de plus vers tes objectifs. Continue comme ça !",
            "100% d'efforts, 0% de regrets. Tu es sur la bonne voie, champion·ne !",
            "La souffrance, c'est temporaire. Les résultats, eux, restent. Tu es très fort·e. Pour continuer d'être au sommet, va pousser de la fonte demain.",
            "Tu fais de la muscu, alors prouve-le ! Fais 20 pompes là maintenant ! Non, je ne rigole pas allez bouge-toi.",
            "Je vous lance un petit défi : ce soir avant d'aller te coucher tu feras 10 pompes, 10 squats et 10 dips et seulement après tu pourras aller dormir !",
            "Chaque goutte de sueur perdue, c'est un pas de plus vers la version de toi énorme et sec·he.",
            "Tu connais le '7-7-7' ? Non ? C'est un circuit à faire après une séance : 7 Burpees, 7 Pompes, 7 Squats sautés, je te mets au défi de réussir ce circuit.",
            "Ne compare jamais ton physique aux autres, compare-le à la version de ton corps d'hier !"
        ],
        2: [
            "Tu sais ce que c'est d'avoir le pump ? C'est quand tu ressens la congestion de ton muscle pendant une séance.",
            "Tu connais le programme : 'Push, Pull, Legs' ? Non ? Bah demande à Gemini peut-être que tu vas comprendre.",
            "Les protéines après l'entraînement, c'est le top ! Oeufs, poulet, fromage blanc... Tu as l'embarras du choix !",
            "Après un entraînement comme celui-ci, je te conseille de prendre une banane ou des amandes !",
            "Les glucides, c'est ton carburant pour ta séance de muscu tu as le choix entre : des pâtes complètes, du riz,...",
            "La récupération c'est sacré. Dors 7 à 8h par nuit, tes muscles te diront merci.",
            "Évite les sucres rapides avant le sport, privilégie les sucres lents. En gros, ça veut dire que tu ne dois pas prendre un soda par contre, prends un fruit.",
            "Respire bien pendant l'effort. Inspire par le nez, expire par la bouche. Tu es une machine !",
            "Hydrate-toi avant, pendant et après l'effort. L'eau, c'est ton meilleur allié !",
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

        let TableauNomCoach = CoachUserDB.map(elementDB => elementDB.nom)
        let TableauAvatarCoach = CoachUserDB.map(elementDB => elementDB.avatar)
        // on affiche le nom du coach choisi par le user
        if (TableauNomCoach[0].length > 0) {
            if (TableauAvatarCoach[0].length > 0) { // si il y a un avatar alors on met le nom du coach à coté de l'avatar
                SectionNomCoach.textContent = TableauAvatarCoach[0] + " " + TableauNomCoach[0]
            }
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

async function initialisation() {
    // ?workout=id
    const settingURL = window.location.search // recup des parametres de l'URL de la page 

    if (settingURL) { // on vérifie qu'il y a un setting avant de faire un split
        const tableauSeparation = settingURL.split("=") // ["?workout", "id"]
        
        if (tableauSeparation.length == 2) { // vérification pour éviter d'essayer de prendre l'index 1 alors qu'il y a que l'index 0 ou alors qu'il 5 index
            idWorkout = parseInt(tableauSeparation[1]) // on recup l'id

            // recup des datas de l'entraînement
            if (idWorkout != undefined) {
                let dataWorkout = await db.entrainement.get(idWorkout) // ça renvoie un dico avec toutes les datas date, durée,...
            
                if (dataWorkout == null) { // si il n'y a pas d'entrainement avec l'id dans l'URL alors on renvoie à la page historique dentrainement pour éviter d'afficher une page vide
                    location.href = "../index.html"
                    return
                }

                // ajout de la structure html
                afficherData(dataWorkout)
                
                // jrm coach
                await JrmCoach()

                // on donne un role au bouton
                let buttonModifier = document.getElementById("button-modifier")
                let buttonSupprimer = document.getElementById("button-supprimer") 

                let connectCSS = document.documentElement
                let recupVar = getComputedStyle(connectCSS)
                // on donne une couleur au bouton supprimer
                buttonSupprimer.style.color = recupVar.getPropertyValue("--COLOR_ACCENT_TEXT")

                buttonSupprimer.addEventListener("click", async () => { // Ajout d'une "action" au bouton
                    // Demande de confirmation avant
                    if (confirm(`Supprimer l'entraînement "${dataWorkout.nom}" ?`)) {
                        await db.entrainement.delete(dataWorkout.id) // supprimer la data de la bdd
                        // retour à l'historique d'entraînement
                        window.location.href = `../index.html`       
                    }
                })

                buttonModifier.addEventListener("click", async () => { // Ajout d'une "action" au bouton edit
                    window.location.href = `ajouter-entrainement.html?edit=${dataWorkout.id}` // mettre un parametre dans l'URL
                })
            }
            
        }
    }
    else { // si il y a pas de parametres dans l'URL on renvoie vers l'historique pour éviter d'afficher une page vide
        location.href = "../index.html"
    }
    
    return
}

window.addEventListener("DOMContentLoaded", () => {
    initialisation()
}) 