// bien faire attention au : "(!!!--- Modifier si ajout de table ---!!!)" c'est partout dans les tables

async function DownloadDatas() {
    let BoutonDownload = document.getElementById("download-button")
    BoutonDownload.textContent = "Téléchargement..."
    BoutonDownload.disabled = true // désactivation du bouton

    // Initialisation
    let ClefLocalStorage = "" // prepa pr la boucle
    let DicoDataLocalStorage = {} // ex structure dico : ColorActuelleUse: "theme_azur",...

    for (let i=0; i < localStorage.length; i++) { // on parcour la longueur du localstorage
        ClefLocalStorage = localStorage.key(i) // on recupere la clé de elt du local storage, ça marche de la meme meniere qu'une liste avec les index par exemple ça renvoie : "ToggleThemeComplet"
        DicoDataLocalStorage[ClefLocalStorage] = localStorage.getItem(ClefLocalStorage) // ajout dans le dico
    }

    // (!!!--- Modifier si ajout de table ---!!!)
    // recup des datas de chaque table de l'indexedDB 
    let WorkoutDB = await db.entrainement.toArray()
    let NiveauCourseDB = await db.niveau_course.toArray()
    let JrmCoachDB = await db.JRM_Coach.toArray()
    let ProfilDB = await db.profil.toArray()
    let recupDB = await db.recuperation.toArray()

    // (!!!--- Modifier si ajout de table ---!!!)
    // Dictionnaire avec les datas du local storage et les tables de l'indexed DB
    const DataTelecharger = {
        DataLocalStorage: DicoDataLocalStorage,
        DataIndexedDB: {
            entrainement: WorkoutDB,
            niveau_course: NiveauCourseDB,
            JRM_Coach: JrmCoachDB,
            profil: ProfilDB,
            recuperation:recupDB
        }
    }

    // Transformation des objets (le dico avec toutes les datas) en txt JSON
    let TxtDataUser = JSON.stringify(DataTelecharger)

    // création d'un blob
    // l'utilité du blod est de contourner le back-end en gros on créer une URL temporaire
    // juste pour que lors du clic sur le bouton, au moins le navigateur c'est quoi aller chercher ici le fichiers JSON
    const VarBlob = new Blob([TxtDataUser], {type: "application/json"})

    // Création d'un lien pour le blob (c un objet)
    let UrlBlob = URL.createObjectURL(VarBlob)
    let LienURL = document.createElement("a") // on créer la balise a dans le html

    LienURL.href = UrlBlob // on créer le lien a href
    LienURL.download = "Sauvegarde-Sprintia.json" // pour enregistrer le fichier dans l'appareil d'un user
    LienURL.click() // on simmule le click pour lancer le download

    setTimeout(() => {
        // transimission du message
        BoutonDownload.textContent = "Téléchargé"
    }, 650);

    setTimeout(() => {
        // remise etat normal
        BoutonDownload.textContent = "Télécharger mes données"
        BoutonDownload.disabled = false // Réactivation du bouton
    }, 1300); // 1300 car si je met 650 logique mais ça le fais en meme temps que le précédent setTimeout

    return
}

async function ReadFile(event) {
    const File = event.target.files[0]

    if (File) {
        let BoutonRestoration = document.getElementById("restoration-button")
        BoutonRestoration.textContent = "Restauration..."
        BoutonRestoration.disabled = true // désactivation du bouton

        try {
            // ne pas utiliser fetch car fetch attend une url vers un serveur
            const TextFile = await File.text() // on liis le contenu du fichier sous format text
            const DataFile = JSON.parse(TextFile) // "conversion" en objet javascript
            const DataFileLocalStorage = DataFile.DataLocalStorage // dico des datas localstorage uniquement

            // on vide le local storage avant d'entrer les datas du fichier user
            localStorage.clear()
            for (var key in DataFileLocalStorage) { // on enregistre les datas du localstorage
                localStorage.setItem(key, DataFileLocalStorage[key])
            }

            const DataFileIndexedDB = DataFile.DataIndexedDB // dico des datas indexedDB uniquement

            // (!!!--- Modifier si ajout de table ---!!!)
            // on isole les datas de chaque table
            const TableEntrainement = DataFileIndexedDB.entrainement
            const TableNiveauCOurse = DataFileIndexedDB.niveau_course
            const TableJRMCoach = DataFileIndexedDB.JRM_Coach
            const TableProfil = DataFileIndexedDB.profil
            const TableRecuperation = DataFileIndexedDB.recuperation

            // (!!!--- Modifier si ajout de table ---!!!)
            // on vide chaque table de l'indexedDB avant d'ajouter les datas
            await db.entrainement.clear()
            await db.niveau_course.clear()
            await db.JRM_Coach.clear()
            await db.profil.clear()
            await db.recuperation.clear()

            // (!!!--- Modifier si ajout de table ---!!!)
            if (TableEntrainement.length > 0) { // on verifie que le tableau n'est pas vide sinon ça me met une erreur
                for (let element of TableEntrainement) { // on recupere les datas ligne par ligne de la table correspondante
                    await db.entrainement.add(element)
                }
            }
            if (TableNiveauCOurse.length > 0) { // on verifie que le tableau n'est pas vide sinon ça me met une erreur
                for (let element of TableNiveauCOurse) { // on recupere les datas ligne par ligne de la table correspondante
                    await db.niveau_course.add(element)
                }
            }
            if (TableJRMCoach.length > 0) { // on verifie que le tableau n'est pas vide sinon ça me met une erreur
                for (let element of TableJRMCoach) { // on recupere les datas ligne par ligne de la table correspondante
                    await db.JRM_Coach.add(element)
                }
            }
            // vérification si la table profil existe parce que cette table a été ajouté avec Sprintia 4.2 
            if (TableProfil != undefined && TableProfil.length > 0) {     
                for (let element of TableProfil) { // on recupere les datas ligne par ligne de la table correspondante
                    // on le met à l'id 1 car il y a que cette ligne dans la bdd
                    await db.profil.put(element, 1) 
                }
            }
            // vérification si la table profil existe parce que cette table a été ajouté avec Sprintia 4.2 
            if (TableRecuperation != undefined && TableRecuperation.length > 0) {     
                for (let element of TableRecuperation) { // on recupere les datas ligne par ligne de la table correspondante
                    // on le met à l'id 1 car il y a que cette ligne dans la bdd
                    await db.recuperation.put(element, 1) 
                }
            }
            
            // Pause
            await new Promise(r => setTimeout(r, 650))
            // remise etat normal
            BoutonRestoration.textContent = "Restaurer mes données"
            BoutonRestoration.disabled = false // Réactivation du bouton

            // et remplit le tableau si il y a des datas
            await remplirTableau()
            
            logoDynamique("Vous revoilà 😇")
            // rechargement du theme
            Preference()

        } catch {
            alert("Une erreur est survenue, veuillez réessayer !")
        }
    }

    return
}

async function SupprimerDatas() {
    // Demande de confirmation avant de continuer
    if (confirm("Êtes-vous sur de vouloir supprimer toutes vos données ?")) {
        let ButtonReinitialiser = document.getElementById("reinitialiser-sprintia")
        ButtonReinitialiser.textContent = "Réinitialisation..."
        ButtonReinitialiser.disabled = true // désactivation du bouton
       
        localStorage.clear()
        sessionStorage.clear()

        
        // (!!!--- Modifier si ajout de table ---!!!)
        // on vide chaque table de l'indexedDB avant d'ajouter les datas
        await db.entrainement.clear()
        await db.niveau_course.clear()
        await db.JRM_Coach.clear()
        await db.profil.clear()
        await db.recuperation.clear()

        setTimeout(() => {
            // transimission du message
            ButtonReinitialiser.textContent = "Réinitialisé"
        }, 650);

        setTimeout(() => {
            // remise etat normal
            ButtonReinitialiser.textContent = "Réinitialiser Sprintia"
            ButtonReinitialiser.disabled = false // Réactivation du bouton
            window.location.href = "../../index.html"
        }, 1300); // 1300 car si je met 650 logique mais ça le fais en meme temps que le précédent setTimeout
        
    }

    return
}