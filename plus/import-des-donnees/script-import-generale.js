function removeValueUndefined(dicoData) {
    const cleanDico = {}
    for (const key in dicoData) { // on parcourt les clé du dico
        if (dicoData[key] != undefined) { // si la valeur n'est pas en undefined donc exploitable alors on l'ajoute au dico clean qui renvoie ensuite
            cleanDico[key] = dicoData[key]
        }
    }
    return cleanDico
}