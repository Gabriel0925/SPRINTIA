# SPRINTIA
SPRINTIA est conçu pour vous aider avant et après vos entraînements grâce à des algorithmes 100% gratuits. 
Vous pouvez y accéder depuis ce lien : [Tester SPRINTIA](https://sprintia.vercel.app)

Vous ne savez pas comment installer l'application ? Ou encore vous ne savez pas comment configurer SPRINTIA ? Pas de panique, j'ai réalisé un tuto YouTube pour vous aider : [Guide de démarrage - Installation & Configuration](https://youtu.be/S3B5Tm9ssRQ?si=fC1sXdjjDnKKtwbz)

## Installable sur tous vos appareils
| Sur smartphone | Sur tablette | Sur ordinateur portable |
| :---: | :---: | :---: |
| ![SPRINTIA sur smartphone](/images-readme/smartphone.JPG) | ![SPRINTIA sur tablette](/images-readme/tablette.JPG) | ![SPRINTIA sur ordinateur portable](/images-readme/ordinateur_portable.JPG) |

## Aperçu visuel
| **Carte GPS** | **Import des données** |
| :---: | :---: |
| ![Interface du détail d'un entraînement](/images-readme/detail_entrainement.JPG) | ![Interface de l'import des données](/images-readme/import_donnees.JPG) |
| **Statistiques** | **Progression** |
| ![Interface de la page des statistiques](/images-readme/statistiques.JPG) | ![Interface de la page de progression](/images-readme/progression.JPG) |

## Philosophie
J'ai conçu SPRINTIA pour **aider les sportifs** (comme moi) à s'entraîner, c'est pour cela que l'application **vous accompagne avant et après vos entraînements, mais pas pendant !** Lorsque l'athlète pratique son sport, il doit être concentré sur sa performance, sur son effort ou encore sur son plaisir, et non sur son smartphone ou sur ses statistiques. Ce qui prime lors de vos entraînements, c'est de laisser parler votre instinct, vos sensations et non vos données ! C'est pour cela que SPRINTIA ne tracke aucune donnée en temps réel.

SPRINTIA se nourrit des données que votre montre (Garmin, COROS, Suunto,...) ou votre application (Strava, Nike Run Club,...) ont collectées lors de vos entraînements. À la fin de votre entraînement, vous n'avez plus qu'à exporter les données de votre entraînement via un fichier **TCX** ou **GPX** et à les importer dans SPRINTIA. Vous pouvez également saisir vos entraînements manuellement si vous n'avez pas de montre ou d'application pour les enregistrer.

Pour finir, j'ai conçu SPRINTIA pour rendre accessible des algorithmes disponibles sur des montres haut de gamme ou des applications payantes. Cela veut dire que vous pouvez utiliser SPRINTIA avec n'importe quelle montre (entrée de gamme, milieu de gamme, haut de gamme) et si vous n'avez pas de montre, vous pouvez utiliser Strava ou Nike Run Club pour enregistrer vos entraînements et ensuite les importer dans SPRINTIA **grâce à un fichier TCX ou GPX**. Cela veut dire que vous pouvez utiliser SPRINTIA **même si vous n'avez pas de montre connectée**.

## Fonctionnalités

### Algorithmes pour vous aider à progresser
* **Charge d'entraînement** : pour vous aider à optimiser l'intensité et le volume de vos entraînements futurs
    * Charge aiguë/chronique
    * Suivi de la charge d'entraînement sur 4 semaines
    * Interprétation et Statut (Désentraînement, Maintien, Productif, Surentraînement)
    * Basé sur la méthode calcul sRPE (prouvée scientifiquement)

* **Niveau de course** : découvrez ci-dessous toutes les statistiques dont vous avez besoin pour progresser en course à pied grâce à un test de seulement 12 minutes.
    * Estimation de la VMA, VO2max, Allure au seuil, rFTPw
    * Prédicteur de course sur 400m/800m/1000m/5km/10km/Semi-marathon/Marathon
    * Zone d'allure/puissance et suivi de l'évolution de votre niveau de course

* **Récupération** : découvrez si votre corps est prêt à faire un effort intense ou s'il a besoin de repos.
    * Fréquence cardiaque de repos (FC repos) du jour
    * Moyenne de votre FC repos sur les 30 derniers jours
    * Graphique de l'évolution de votre FC repos au cours du temps
    * Interprétation des données

* **Indulgence de course** : pour vous aider à ajuster votre kilométrage hebdomadaire des 7 prochains jours pour : progresser et surtout préserver vos articulations.
    * Distance hebdomadaire conseillée en fonction de votre historique des 4 dernières semaines et de votre type de coureur·euse (Occasionnel·le, Régulier·ère, Confirmé·ée)
    * Distance moyenne par semaine 
    * Distance totale parcourue sur les 28 derniers jours
    * Suivi de la distance parcourue chaque semaine sur les 4 dernières semaines

(Attention : ces algorithmes sont un guide, ils sont là pour vous aider à progresser mais vos sensations et votre instinct restent les plus importants !)

### Fonctionnalité d'analyse en profondeur (IA) & Génération intelligente
* **SPRINTIA Briefing** : Générateur de prompt (contenant vos données d'entraînement) pour votre IA préférée : Vibe, Gemini, ChatGPT,... Cette fonctionnalité vous permet **d'analyser vos données d'entraînement en profondeur pour vous améliorer**.
    * Analyser vos tendances d'entraînement
    * Analyser votre entraînement
    * Analyser votre récupération
    * Analyser votre charge d'entraînement
    * Posez une question sur vos données d'entraînement, par exemple :
        * "Créer un programme d'entraînement pour faire le 10 km à Dijon dans 8 semaines"
        * "Pourquoi je n'arrive pas à améliorer mon temps sur 10 km ?"
        * "Pourquoi je me sens fatigué aujourd'hui alors que j'ai bien dormi et que ma fréquence cardiaque de repos est bonne ?"
        * "Compare ma séance de course d'aujourd'hui avec celle de la semaine dernière. Est-ce que mon endurance s'améliore ?"
        * "Donne-moi 3 exercices de récupération active à faire aujourd'hui, adaptés à ma récupération."

    Pour en savoir plus sur cette fonctionnalité, vous pouvez visionner le tuto YouTube que j'ai réalisé : [Comment utiliser SPRINTIA Briefing ?](https://youtu.be/6dx8cqwIkbk?si=roJGDWf_lrA27re_)

    (Attention : en utilisant cette fonctionnalité, vous acceptez le transfert de vos données à l'IA que vous aurez choisie dans les paramètre de SPRINTIA Briefing (IA par défaut : Vibe))

* **Entraînement du jour** : vous n'avez pas d'idée d'entraînement pour aujourd'hui ? Ou alors vous n'avez pas eu le temps d'en préparer un ? La fonctionnalité "Entraînement du jour" est faite pour vous ! Vous pouvez générer un entraînement en fonction de :
    * L'intensité que vous souhaitez (Facile, Modéré, Difficile)
    * La durée que vous souhaitez (25min, 50min)
    * Le sport que vous souhaitez pratiquer (Course à pied, Vélo, Natation)
    * De plus, si vous avez une montre de la marque COROS, vous pouvez envoyer cet entraînement sur votre compte COROS en un seul clic ! Par la suite, vous n'avez plus qu'à l'envoyer sur votre montre et à le suivre.

    Pour apprendre à utiliser cette fonctionnalité, vous pouvez visionner ma vidéo Youtube : [Comment utiliser l'outil Entraînement du Jour ?](https://youtu.be/eu8c4BxBBlU?si=xMtSDKkeHsbAvQTv)

### Personnalisation & Coaching
* **JRM Coach** : c'est le coach intégré dans l'application. C'est lui qui va interpréter vos données dans les algorithmes. Vous pouvez le personnaliser pour avoir le coach qui vous correspond le mieux.
    * Choisissez son nom
    * Choisissez son style (Bienveillant, Strict & Motivant, Copain, Go muscu)
    * Choisissez son avatar (émoji)

### Autres fonctionnalités
* **Statistiques** : visualisez vos données d'entraînement sur une période sélectionnée (7J, 30J, 90J, 365J), vous pouvez consulter les statistiques suivantes sur cette période :
    * Durée totale d'entraînement
    * Nombre d'entraînement
    * Charge d'entraînement totale
    * Graphique en camembert des sports pratiqués en pourcentage
    * Temps, distance et nombre d'entraînement par sport (Course, Vélo, Natation)

* **Mode hors ligne** : vous êtes au sommet d'une montagne et vous n'avez pas de connexion ? Aucun problème, SPRINTIA fonctionne hors-connexion !

### Outils rapides
* **Zones Cardiaques** : Découvrez vos zones de fréquence cardiaque pour adapter l'intensité de vos entraînements.
* **Métabolisme de base** : Calculez l'énergie de base nécessaire à votre corps pour construire un plan d'entraînement.
* **Calculateur IMC** : Calculez votre IMC et obtenez une interprétation de votre résultat.
* **Estimation 1RM (One Repetition Maximum)** : Estimez la charge maximale que vous pouvez soulever en une seule répétition sur un exercice de musculation.
* **Protéines Quotidiennes** : Découvrez la quantité de protéines à consommer par jour en fonction de votre objectif.
* **Temps de Récupération** : Estimez le temps de récupération optimal pour récupérer de votre dernier entraînement.
* **Hydratation** : Calculez la quantité d'eau dont votre corps a besoin au quotidien.
* **Convertisseur km/miles** : Convertissez une distance des kilomètres en miles ou inversement.

## Partage d'entraînement
Si vous allez courir avec un ami et que vous utilisez tous les deux SPRINTIA, vous pouvez vous simplifier la vie. Au lieu de saisir chacun de votre côté votre entraînement, vous pouvez simplement le partager à votre ami. C'est relativement simple, une fois l'entraînement bouclé, l'un de vous importe le fichier TCX ou GPX dans SPRINTIA et ensuite en cliquant sur le détail de l'entraînement, puis "Plus" et enfin "Partager", vous pouvez partager le fichier de l'entraînement via Airdrop, Quick Share, WhatsApp,... et votre ami n'a plus qu'à l'importer dans SPRINTIA pour avoir le même entraînement que vous.

## Import des données
Vous pouvez importer vos données d'un entraînement, grâce à un fichier **TCX** ou **GPX**. De plus, vous pouvez importer votre historique d'entraînement grâce à un fichier **CSV** de Garmin ou de TrainingPeaks.

Si vous avez besoin d'aide pour importer votre entraînement dans SPRINTIA, vous pouvez visionner mes tutos : 
* [Importer un entraînement de Strava à SPRINTIA](https://youtu.be/q9cG8EUAMwE?si=GNQzX39XpZQvfL-2)
* [Importer un entraînement de COROS à SPRINTIA](https://youtu.be/OTOc0AO8TD8?si=CZBkTGLxH8IQzhvL)
* [Importer un entraînement de n'importe quelle plateforme à SPRINTIA](https://youtu.be/IvygdF1oLqQ?si=hREvlepVsqZEoyJk)

## Réseaux
* [Le compte Instagram](https://www.instagram.com/sprintia09?igsh=MXV5N2NiaHRvdTF1bQ%3D%3D)
* [La chaîne YouTube](https://www.youtube.com/@SPRINTIA-09)

## La sécurité, un principe à ne pas négliger

### Vos données vous appartiennent
**Je n'ai pas conçu SPRINTIA pour collecter vos données personnelles**, au contraire, pour moi j'essaie d'appliquer des principes du quotidien. Est-ce que dans la rue vous donneriez vos données personnelles à un inconnu pour qu'il les revende ? Pour la majorité des gens, la réponse est non. C'est pour cela que SPRINTIA enregistre vos **données en local**, c'est à dire dans votre navigateur, et non sur un serveur. C'est aussi pour cela qu'il n'y a **aucun cookie** dans l'application. Pour finir, ça veut dire que **même moi qui suis le développeur de SPRINTIA, je n'ai pas accès à vos données**.

### Gestion de vos données
Bien que vos données restent stockées sur votre appareil, vous gardez le contrôle sur vos données. Vous pouvez à tout moment télécharger un fichier (JSON) contenant l'ensemble de vos données enregistrées dans l'application. De plus, si vous voulez un jour changer de navigateur, ou même changer d'appareil, vous pouvez directement depuis SPRINTIA partager par AirDrop ou Quick Share le fichier contenant vos données pour restaurer vos données sur votre nouvel appareil/navigateur.

### Sécurité de l'application
Pour protéger l'application et vos données j'ai intégré à SPRINTIA :
* **Content Security Policy (CSP)** : j'ai autorisé l'application à uniquement exécuter les scripts, les ressources qui proviennent de l'application (self) ce qui bloque tout script tiers.
* **Protection contre les injections (XSS)** : dans tout le code de l'application il n'y a pas un seul ".innerHTML" ce qui bloque l'injection de code malveillant.

## Local-First
L'objectif du projet est de faire **uniquement du front-end**, pas de back-end ! Pourquoi ? Parce que **je ne veux pas payer l'hébergement de SPRINTIA**, je suis sur le plan hobby de Vercel et ce forfait impose une limite sur les requêtes au serveur. Moi je n'ai pas envie de me dire qu'il y a une limite, par conséquent, je fais mon maximum pour que tout reste en front-end et donc en local sur votre appareil.

## Licence
Ce projet est sous licence [PolyForm Noncommercial 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0).