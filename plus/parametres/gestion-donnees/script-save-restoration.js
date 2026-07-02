// bien faire attention au : "(!!!--- Modifier si ajout de table ---!!!)" c'est partout dans les tables

async function downloadDatas() {
    let buttonDownload = document.getElementById("download-button")
    buttonDownload.textContent = "Téléchargement..."
    buttonDownload.disabled = true 

    // init
    let dicoDataLocalStorage = {} // ex structure dico : 'personnaliteCoachBriefing': 'true',...

    // boucle qui parcout tous ce qu'il y a d'enregistrer dans le local storage
    for (let i=0; i < localStorage.length; i++) {
        // on récup la clé de l'element du local storage et on l'ajoute au dico en recherchant la valeur de cette clé
        dicoDataLocalStorage[localStorage.key(i)] = localStorage.getItem(localStorage.key(i))
    }

    // (!!!--- Modifier si ajout de table ---!!!)
    // recup des datas de chaque table de l'indexedDB 
    let workoutDB = await db.entrainement.toArray()
    let niveauCourseDB = await db.niveau_course.toArray()
    let jrmCoachDB = await db.JRM_Coach.toArray()
    let profilDB = await db.profil.toArray()
    let recupDB = await db.recuperation.toArray()

    // (!!!--- Modifier si ajout de table ---!!!)
    const dataTelecharger = {
        DataLocalStorage: dicoDataLocalStorage,

        DataIndexedDB: {
            entrainement: workoutDB,
            niveau_course: niveauCourseDB,
            JRM_Coach: jrmCoachDB,
            profil: profilDB,
            recuperation:recupDB
        }
    }

    // transformation du dico en txt JSON, avec 2 tab comme identation et null pr appliquer aucun filtre
    let txtDataUser = JSON.stringify(dataTelecharger, null, 2)

    // création d'un objet nommé blob (=en gros on créer une URL temporaire)
    // au moins la navigateur c'est ou télécharger le "fichier"
    let urlBlob = URL.createObjectURL(new Blob([txtDataUser], {type: "application/json"})) // par ex : 'blob:http://127.0.0.1:5500/414b2c61-e902-4b86-84fb-61ad6afea08c'
    let baliseHTML = document.createElement("a")

    baliseHTML.href = urlBlob // on attribue l'URL du blob à la balise a
    baliseHTML.download = "Sauvegarde-SPRINTIA.json" // nom du "fichier"
    baliseHTML.click() // on simule un click pour download

    setTimeout(() => {
        // transimission du message
        buttonDownload.textContent = "Téléchargé"
    }, 650);

    setTimeout(() => {
        // remise etat normal
        buttonDownload.textContent = "Télécharger vos données"
        buttonDownload.disabled = false 
    }, 1300);
}

async function restaurationDatas(event) {
    const file = event.target.files[0] // récup du fichier

    if (file) { // si ya un fichier on change l'état du bouton
        let buttonRestoration = document.getElementById("restoration-button")
        buttonRestoration.textContent = "Restauration..."
        buttonRestoration.disabled = true

        try {
            const textFile = await file.text() // on lis le contenu du fichier sous la forme d'un texte
            const dataFile = JSON.parse(textFile) // conversion en objet js
            const dataFileLocalStorage = dataFile.DataLocalStorage // recup du dico des datas du localstorage

            localStorage.clear() // réinitialisation du localStorage
            for (var key in dataFileLocalStorage) {
                localStorage.setItem(key, dataFileLocalStorage[key]) // enregistrement
            }
            sessionStorage.clear() // on clear le sessionStorage au passage

            const dataFileIndexedDB = dataFile.DataIndexedDB // recup du dico des datas de l'indexedDB

            // (!!!--- Modifier si ajout de table ---!!!)
            // isolation des datas de chaque table
            const tableEntrainement = dataFileIndexedDB.entrainement
            const tableNiveauCOurse = dataFileIndexedDB.niveau_course
            const tableJRMCoach = dataFileIndexedDB.JRM_Coach
            const tableProfil = dataFileIndexedDB.profil
            const tableRecuperation = dataFileIndexedDB.recuperation

            // (!!!--- Modifier si ajout de table ---!!!)
            // on vide chaque table de l'indexedDB avant d'ajouter les datas du fichier importer par le user
            await db.entrainement.clear()
            await db.niveau_course.clear()
            await db.JRM_Coach.clear()
            await db.profil.clear()
            await db.recuperation.clear()

            // (!!!--- Modifier si ajout de table ---!!!)
            if (tableEntrainement.length > 0) { // on verifie que le tableau n'est pas vide sinon ça me met une erreur
                for (let element of tableEntrainement) { // on recupere les datas ligne par ligne de la table correspondante
                    await db.entrainement.add(element)
                }
            }
            if (tableNiveauCOurse.length > 0) {
                for (let element of tableNiveauCOurse) {
                    await db.niveau_course.add(element)
                }
            }
            if (tableJRMCoach.length > 0) {
                for (let element of tableJRMCoach) {
                    await db.JRM_Coach.add(element)
                }
            }
            // vérification si la table profil existe parce que cette table a été ajouté avec SPRINTIA-4.2 
            if (tableProfil != undefined && tableProfil.length > 0) {     
                for (let element of tableProfil) {
                    // on le met à l'id 1 car il y a que cette ligne dans la bdd
                    await db.profil.put(element, 1) 
                }
            }
            // vérification si la table profil existe parce que cette table a été ajouté avec SPRINTIA-4.2 
            if (tableRecuperation != undefined && tableRecuperation.length > 0) {     
                for (let element of tableRecuperation) {
                    await db.recuperation.add(element)
                }
            }
    
            setTimeout( () => {
                // transimission du message
                buttonRestoration.textContent = "Restauré"
                logoDynamique("Vous revoilà 😇") // petite animation pour le user
            }, 650);

            setTimeout(() => {
                // remise etat normal
                buttonRestoration.textContent = "Restaurer vos données"
                buttonRestoration.disabled = false 
            }, 1300);

        } catch {
            alert("Une erreur est survenue, veuillez réessayer !")
            buttonRestoration.textContent = "Restaurer vos données"
            buttonRestoration.disabled = false 
            return
        }
    }
}

async function reinitialiserSPRINTIA() {
    if (confirm("Êtes-vous sur de vouloir supprimer toutes vos données ?")) {
        let buttonReinitialiser = document.getElementById("reinitialiser-SPRINTIA")
        buttonReinitialiser.textContent = "Réinitialisation..."
        buttonReinitialiser.disabled = true
       
        localStorage.clear()
        sessionStorage.clear()
        
        // (!!!--- Modifier si ajout de table ---!!!)
        await db.entrainement.clear()
        await db.niveau_course.clear()
        await db.JRM_Coach.clear()
        await db.profil.clear()
        await db.recuperation.clear()

        setTimeout(() => {
            buttonReinitialiser.textContent = "Réinitialisé"
        }, 650);

        setTimeout(() => {
            // remise etat normal
            buttonReinitialiser.textContent = "Réinitialiser SPRINTIA"
            buttonReinitialiser.disabled = false 
            window.location.href = "../../../index.html"
        }, 1300);
    }
}