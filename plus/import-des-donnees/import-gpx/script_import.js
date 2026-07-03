async function uploadFileGPX(event) {
    const fileGPX = event.target.files[0]
    let button = document.getElementById("button-import-gpx")

    if (fileGPX) {
        button.disabled = true
        button.textContent = "Importation..."

        try {
            let textFile = await fileGPX.text() // on récup le contenu du fichier en texte
            
            const parser = new DOMParser() // création d'un objet pr transformer le txt en DOM
            const xmlDoc = parser.parseFromString(textFile, "text/xml") // transformation du texte en document XML c'est un langage équivalent à HTML

            console.log(xmlDoc)

        } catch(error) {
            console.log(error)
            button.textContent = "Une erreur s'est produite"
            await new Promise(transmissionInfoUser => setTimeout(transmissionInfoUser, 650))
        } finally {
            button.textContent = "Importer TCX"
            button.disabled = false
        }
    }
}