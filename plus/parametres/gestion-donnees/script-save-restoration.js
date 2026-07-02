async function downloadDatas() {
    let buttonDownload = document.getElementById("download-button")
    buttonDownload.textContent = "Téléchargement..."
    buttonDownload.disabled = true 

    try {
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

        buttonDownload.textContent = "Téléchargé"
        await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))

    } catch(error) {
        console.log(error) // affichage de l'erreur en console
        buttonDownload.textContent = "Une erreur s'est produite"
        await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))
    } finally {
        buttonDownload.textContent = "Télécharger vos données"
        buttonDownload.disabled = false 
    }
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

            for (const table of db.tables) { // on parcourt chaque table de la bdd et on supprime
                await table.clear()

                const tableFileJSON = dataFileIndexedDB[table.name] // on récupère les datas de la table actuelle de la boucle for dans le fichier JSON

                if (tableFileJSON && tableFileJSON.length > 0) {  // on verifie qu'il y a des datas dans la table du JSON
                    for (let elt of tableFileJSON) { // on recupere les datas ligne par ligne de la table correspondante
                        if (table.name == "profil") {
                            // on le met à l'id 1 car il y a que cette ligne dans cette table
                            await table.put(elt, 1) // on utilise direct la var table qui est déjà co à db

                        } else {
                            await table.add(elt) // on utilise direct la var table qui est déjà co à db
                        }
                    }
                }
            }

            buttonRestoration.textContent = "Restauré"
            await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))
            logoDynamique("Vous revoilà 😇")
        } catch(error) {
            console.log(error)
            buttonRestoration.textContent = "Une erreur s'est produite"
            await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))
        } finally {
            buttonRestoration.textContent = "Restaurer vos données"
            buttonRestoration.disabled = false
        }
    }
}

async function nettoyerDatas(conserverDatas) { // conserverDatas vaut soit 30J/90J/365J
    if (confirm(`Êtes-vous sur de vouloir supprimer vos données qui sont plus vieilles que ${conserverDatas} jours ?`)) {
        let buttonNettoyer = document.getElementById("button-nettoyer")
        buttonNettoyer.textContent = "Nettoyage..."
        buttonNettoyer.disabled = true
        
        try {
            let dateMoinsJours = createObjetDate(conserverDatas)
            for (const tableElt of db.tables) { // on parcourt chaque table de la bdd et on supprime
                if (tableElt.name != "JRM_Coach" && tableElt.name != "profil") {
                    await tableElt.where('date').below(dateMoinsJours).delete()
                }
            }
            
            buttonNettoyer.textContent = "Nettoyé"
            await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))
            logoDynamique("🧹 Grand ménage !")
        } catch(error) {
            console.log(error)
            buttonNettoyer.textContent = "Une erreur s'est produite"
            await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))
        } finally {
            buttonNettoyer.textContent = "Nettoyer"
            buttonNettoyer.disabled = false
        }
    }
}

async function reinitialiserSPRINTIA() {
    if (confirm("Êtes-vous sur de vouloir supprimer toutes vos données ?")) {
        let buttonReinitialiser = document.getElementById("reinitialiser-SPRINTIA")
        buttonReinitialiser.textContent = "Réinitialisation..."
        buttonReinitialiser.disabled = true
        
        try {
            localStorage.clear()
            sessionStorage.clear()
            for (const elt of db.tables) { // on parcourt chaque table de la bdd et on supprime
                await elt.clear()
            }
            
            buttonReinitialiser.textContent = "Réinitialisé"
            await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))
            window.location.href = "../../../index.html"
        } catch(error) {
            console.log(error)
            buttonReinitialiser.textContent = "Une erreur s'est produite"
            await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))
        } finally {
            buttonReinitialiser.textContent = "Réinitialiser SPRINTIA"
            buttonReinitialiser.disabled = false
        }
    }
}