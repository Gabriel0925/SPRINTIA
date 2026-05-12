// variable globale pour savoir si le user a mis une distance perso
let userAddDistance = false

function estimateTime(vmaUser, profilUser, distanceUser) {
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
    let timeSemiMarathon = 21.0975/(vmaUser*dicoCoef[profilUser][3])
    let timeMarathon = 42.195/(vmaUser*dicoCoef[profilUser][4])

    const tableauTime = [time400m*60, time800m*60, time1km*60, time5km*60, time10km*60, timeSemiMarathon*60, timeMarathon*60] // conversion des secondes en minutes
    if (distanceUser != undefined) {
        let indexCoef = 0
        if (distanceUser <= 2) {
            indexCoef=0
        } else if (distanceUser <= 5.0) {
            indexCoef=1
        } else if (distanceUser <= 10.0) {
            indexCoef=2
        } else if (distanceUser <= 22.0) {
            indexCoef=3
        } else {
            indexCoef=4
        }
        
        let timePersonaliser = distanceUser/(vmaUser*dicoCoef[profilUser][indexCoef])
        tableauTime.push(timePersonaliser*60)
    }
    
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
        alert("Erreur de saisie : le champ VMA doit être remplis.");
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
    
    // si le user a ajouté une distance personnaliser
    let tableauResultTime=undefined
    if (userAddDistance==true) {
        let distanceUser = parseFloat(document.getElementById("distance-user").value)
        
        if (isNaN(distanceUser)) {
            alert("Erreur de saisie : le champ Distance doit être remplis.");
            return
        }
        if (distanceUser <= 0) {
            alert("Valeur non valide, la distance doit être supérieur à 0.")
            return
        }
        if (distanceUser >= 50) {
            alert("Valeur non valide, la distance doit être inférieur à 50.")
            return
        }
        
        tableauResultTime = estimateTime(vmaUser, profilUser, distanceUser)
    } else {
        tableauResultTime = estimateTime(vmaUser, profilUser, undefined)
    }
    
    let blockData = document.querySelectorAll(".container-block-data-data")

    let compteur = 0
    tableauResultTime.forEach(timeElement => {
        blockData[compteur].innerHTML = timeElement
        compteur+=1
    });

    return
}

function distancePersonnaliser() {
    let buttonDistance = document.getElementById("button-distance")
    let inputDistance = document.getElementById("input-distance")
    let blockDistancePerso = document.getElementById("block-distance-personnaliser")
    
    if (buttonDistance.textContent == "Ajouter une distance") {
        buttonDistance.textContent = "Supprimer la distance"
        inputDistance.style.display = "block"
        blockDistancePerso.style.display = "block"
        userAddDistance = true
    } else {
        buttonDistance.textContent = "Ajouter une distance"
        inputDistance.style.display = "none"
        blockDistancePerso.style.display = "none"
        userAddDistance = false
    }
}

function forSelect() {
    // si le champs vma est remplit on lance la fonction
    if (!isNaN(parseFloat(document.getElementById("vma-user").value))) {predictorTimeRunning()}
}
