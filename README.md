# SPRINTIA
SPRINTIA est conçu pour vous aider avant et après vos entraînements grâce à des algorithmes 100% gratuits. 
Vous pouvez y accéder depuis ce lien : [Tester SPRINTIA](https://sprintia.vercel.app)

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
J'ai conçu SPRINTIA pour **aider les sportifs** (comme moi) à s'entraîner, c'est pour cela que l'application **vous accompagne avant et après vos entraînements, mais pas pendant !** Lorsque l'athlète pratique son sport, il doit être concentré sur sa performance, sur son effort ou encore sur son plaisir, et non sur son smartphone ou sur ses statistiques. Ce qui prime lors de vos entraînements, c'est de laisser parler votre instinct, vos sensations et non vos données ! C'est pour cela que SPRINTIA ne tracke aucunes données en temps réel, **SPRINTIA préfère se nourrir de vos données après vos entraînements** grâce à des fichiers **TCX**, **GPX** ou même grâce à la **saisie manuelle** intégrée à l'application. SPRINTIA est donc **un outil d'analyse et de suivi**, **pas un outil de tracking en temps réel**.

## Fonctionnalités

### Algorithmes pour vous aider à progresser
* **Charge d'entraînement** : pour vous aider à optimiser l'intensité et le volume de vos entraînements futurs
    * Charge aiguë/chronique
    * Suivi de la charge d'entraînement sur 4 semaines
    * Interprétation et Statut (Désentraînement, Maintien, Productif, Surentraînement)

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

    (Attention : en utilisant cette fonctionnalité, vous acceptez le transfert de vos données à l'IA que vous aurez choisie dans les paramètre de SPRINTIA Briefing (IA par défaut : Vibe))

## Fonctionnalités clés
* Créez votre propre coach : choisissez son nom, son style et même son avatar.
* Entraînement du jour : Générez un entraînement en fonction de l'intensité et de la durée que vous souhaitez puis envoyez directement cet entraînement sur votre compte COROS (compatible avec la course à pied, le vélo et la natation).
* Statistiques : Durée totale d'entraînement, Nb entraînement, Charge d'entraînement totale sur la période sélectionnée (7J, 30J, 90J, 365J), Sports pratiqués en pourcentage, Statistiques par sport (Course, Vélo, Natation).

## Analyse
* Des outils rapides (Zones Cardiaques, Métabolisme de base, IMC, Estimation 1RM, Protéines Quotidiennes, Temps de Récupération, Hydratation, Convertisseur km/miles,...)

## Confidentialité
**Je n'ai pas conçu SPRINTIA pour collecter vos donnnées personnelles**, au contraire, pour moi j'essaie d'appliquer des principes du quotidien. Est-ce que dans la rue vous donneriez vos données personnelles à un inconnu pour qu'il les revende ? Pour la majorité des gens, la réponse est non. C'est pour cela que SPRINTIA enregistre vos **données en local**, c'est à dire dans votre navigateur, et non sur un serveur. C'est aussi pour cela qu'il n'y a **aucun cookie** intégrée dans la PWA (Progressive Web App) (=site web installable en tant qu'appli). Pour finir, ça veut dire que **même moi qui suis le développeur de SPRINTIA, je n'ai pas accès à vos données**.

## Local-First
L'objectif du projet est de faire **uniquement du front-end**, pas de back-end ! Pourquoi ? Parce que **je ne veux pas payer l'hébergement de SPRINTIA**, pour moi SPRINTIA c'est un projet à temps perdu, ça veut dire que ce n'est pas ma priorité et donc par conséquent je ne veux pas payer un abonnement par mois pour héberger l'application. De plus, je suis sur le plan hobby de Vercel et ce forfait impose une limite sur les requêtes au serveur. Moi je n'ai pas envie de me dire qu'il y a une limite, par conséquent, je fais mon maximum pour que tout reste en front-end et donc en local sur votre appareil.

## Licence
Ce projet est sous licence [PolyForm Noncommercial 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0).