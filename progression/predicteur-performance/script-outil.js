function estimateTime(vmaUser, profilUser) {
    // init
    const dicoCoef = {
        "sprint":[1, 0.88, 0.78, 0.71, 0.64],
        "equilibre":[0.97, 0.84, 0.80, 0.74, 0.68],
        "endurant":[0.9, 0.87, 0.85, 0.79, 0.75]
    }

    // calcul
    let time400m = 0.4/(vmaUser*dicoCoef[profilUser][0]) // "(vmaUser*dicoCoef[profilUser][0])" pour calculer la vitesse moyenne
    let time800m = 0.8/(vmaUser*dicoCoef[profilUser][0])
    let time1km = 1/(vmaUser*dicoCoef[profilUser][0])
    let time5km = 5/(vmaUser*dicoCoef[profilUser][1])
    let time10km = 10/(vmaUser*dicoCoef[profilUser][2])
    let timeSemiMarathon = 21/(vmaUser*dicoCoef[profilUser][3])
    let timeMarathon = 42/(vmaUser*dicoCoef[profilUser][4])

    const tableauTime = [time400m*60, time800m*60, time1km*60, time5km*60, time10km*60, timeSemiMarathon*60, timeMarathon*60] // conversion des secondes en minutes
    let tableauTimePredict = []

    tableauTime.forEach(element => {
        tableauTimePredict.push(dureeFormatee(element, null))
    });

    return tableauTimePredict
}

function predictorTimeRunning() {
    // recup input
    let vmaUser = parseFloat(document.getElementById("vma-user").value)
    let profilUser = document.getElementById("profil-user").value

    // vérification des champs
    if (isNaN(vmaUser)) {
        alert("Erreur de saisie : tous les champs doivent être remplis.");
        return
    }
    if (vmaUser <= 0) {
        alert("Valeur non valide, la vma doit être supérieur à 0.")
        return
    }
    if (vmaUser >= 50) {
        alert("Valeur non valide, la vma doit être inférieur à 50.")
        return
    }

    let tableauResultTime = estimateTime(vmaUser, profilUser)
    let blockData = document.querySelectorAll(".container-block-data-data")

    let compteur = 0
    tableauResultTime.forEach(timeElement => {
        blockData[compteur].innerHTML = timeElement
        compteur+=1
    });

    return
}

function forSelect() {
    // si le champs vma est remplit on lance la fonction
    if (!isNaN(parseFloat(document.getElementById("vma-user").value))) {predictorTimeRunning()}
}
