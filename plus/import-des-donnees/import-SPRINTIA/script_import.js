async function uploadFileSPRINTIA(event) {
    const fileSPRINTIA = event.target.files[0]
    let button = document.getElementById("button-import-SPRINTIA")

    if (fileSPRINTIA) {
        button.disabled = true
        button.textContent = "Importation..."

        try {
            let textFile = await fileSPRINTIA.text() // on récup le contenu du fichier en texte
            let dicoDataWorkout = JSON.parse(textFile)
            
            const dicoDataClean = removeValueUndefined(dicoDataWorkout) // toutes les valeurs en undefined sont enlever du dico

            // on recup l'id direct au moment de l'enregistrement grâce à add qui renvoie l'id
            const idWorkout = await db.entrainement.add(dicoDataClean)

            button.textContent = "Importé"
            await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 500))
            window.location.href = `../../../entrainement/entrainement.html?workout=${idWorkout}`
        } catch(error) {
            console.log(error)
            button.textContent = "Une erreur s'est produite"
            await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))
        } finally {
            button.textContent = "Importer fichier SPRINTIA"
            button.disabled = false
        }
    }
}