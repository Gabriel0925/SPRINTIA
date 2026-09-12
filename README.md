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
| **Statisques** | **Progression** |
| ![Interface de la page des statistiques](/images-readme/statistiques.JPG) | ![Interface de la page de progression](/images-readme/progression.JPG) |

## Philosophie
J'ai conçu SPRINTIA pour **aider les sportifs** (comme moi) à s'entraîner, c'est pour cela que l'application **vous accompagne avant et après vos entraînements, mais pas pendant !** Lorsque l'athlète pratique son sport, il doit être concentré sur sa performance, sur son effort ou encore sur son plaisir, et non sur son smartphone ou sur ses statistiques. Ce qui prime lors de vos entraînements, c'est de laisser parler votre instinct, vos sensations et non vos données ! C'est pour cela que SPRINTIA ne tracke aucunes données en temps réel, **SPRINTIA préfère se nourrir de vos données après vos entraînements** grâce à des fichiers **TCX**, **GPX** ou même grâce à la **saisie manuelle** intégrée à l'application. SPRINTIA est donc **un outil d'analyse et de suivi**, **pas un outil de tracking en temps réel**.

## Fonctionnalités clés
* SPRINTIA Briefing : exportez vos données d'entraînement vers votre IA préférée et obtenez des analyses précises et pertinentes en quelques clics.
* Créez votre propre coach : choisissez son nom, son style et même son avatar.
* Entraînement du jour : Générez un entraînement en fonction de l'intensité et de la durée que vous souhaitez puis envoyez directement cet entraînement sur votre compte COROS (compatible avec la course à pied, le vélo et la natation).
* Statistiques : Durée totale d'entraînement, Nb entraînement, Charge d'entraînement totale sur la période sélectionnée (7J, 30J, 90J, 365J), Sports pratiqués en pourcentage, Statistiques par sport (Course, Vélo, Natation).

## Analyse
* Charge d'entraînement (Charge aiguë/chronique, Suivi de la charge d'entraînement sur 4 semaines, Interprétation et Statut)
* Indulgence de course (Distance hebdomadaire conseillée en fonction de votre historique des 4 dernières semaines et de votre type de coureur·euse, Distance moy. par semaine, Distance 28J et Suivi de la distance sur 4 semaines)
* Niveau de course (estimation de la VMA, VO2max, Allure au seuil, rFTPw, Prédicteur de course sur 400m/800m/1000m/5km/10km/Semi-marathon/Marathon, Zone d'allure/puissance et Évolution de votre niveau de course au cours du temps)
* Récupération (FC repos du jour, Moyenne 30J, Graphique de FC repos au cours du temps et Interprétation des données)
* Des outils rapides (Zones Cardiaques, Métabolisme de base, IMC, Estimation 1RM, Protéines Quotidiennes, Temps de Récupération, Hydratation, Convertisseur km/miles,...)

## Confidentialité
**Je n'ai pas conçu SPRINTIA pour collecter vos donnnées personnelles**, au contraire, pour moi j'essaie d'appliquer des principes du quotidien. Est-ce que dans la rue vous donneriez vos données personnelles à un inconnu pour qu'il les revende ? Pour la majorité des gens, la réponse est non. C'est pour cela que SPRINTIA enregistre vos **données en local**, c'est à dire dans votre navigateur, et non sur un serveur. C'est aussi pour cela qu'il n'y a **aucun cookie** intégrée dans la PWA (Progressive Web App) (=site web installable en tant qu'appli). Pour finir, ça veut dire que **même moi qui suis le développeur de SPRINTIA, je n'ai pas accès à vos données**.

## Local-First
L'objectif du projet est de faire **uniquement du front-end**, pas de back-end ! Pourquoi ? Parce que **je ne veux pas payer l'hébergement de SPRINTIA**, pour moi SPRINTIA c'est un projet à temps perdu, ça veut dire que ce n'est pas ma priorité et donc par conséquent je ne veux pas payer un abonnement par mois pour héberger l'application. De plus, je suis sur le plan hobby de Vercel et ce forfait impose une limite sur les requêtes au serveur. Moi je n'ai pas envie de me dire qu'il y a une limite, par conséquent, je fais mon maximum pour que tout reste en front-end et donc en local sur votre appareil.

## Licence
Ce projet est sous licence [PolyForm Noncommercial 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0).