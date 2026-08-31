async function saveProfil() {
    let button = document.getElementById("button-save")

    // recup des champs
    let sexeUser = document.getElementById("sexe-user").value
    let ageUser = parseInt(document.getElementById("age-user").value)
    let tailleUser = parseInt(document.getElementById("taille-user").value)
    let poidsUser = Number(document.getElementById("poids-user").value)
    let fcReposUser = parseInt(document.getElementById("fc-repos-user").value)

    // vérification des champs pour voir si ils sont vides 
    if (isNaN(ageUser) || isNaN(tailleUser) || isNaN(poidsUser) || isNaN(fcReposUser)) {
        alert("Erreur de saisie : tous les champs doivent être remplis.")
        return
    }
    // vérif des valeurs saisies
    if (ageUser <= 0 || tailleUser <= 0 || poidsUser <= 0 || fcReposUser <= 0) {
        alert("Valeur non valide, les champs doivent être un nombre supérieur à 0.")
        return
    }
    if (ageUser >= 120) {
        alert("Valeur non valide, l'âge doit être un nombre inférieur à 120.")
        return
    }
    if (tailleUser >= 350) {
        alert("Valeur non valide, la taille doit être un nombre inférieur à 350.")
        return
    }
    if (poidsUser >= 1000) {
        alert("Valeur non valide, le poids doit être un nombre inférieur à 1000.")
        return
    }
    if (fcReposUser < 20 || fcReposUser > 140) {
        alert("Valeur non valide, la fréquence cardiaque de repos doit être un nombre compris entre 20 et 140 bpm.")
        return
    }

    // conversion
    poidsUser = Number(poidsUser).toFixed(1)

    // desactivation
    button.textContent = "Sauvegarde..."
    button.disabled = true

    // sauvegarde dans indexed db
    await db.profil.put({
        id: 1,
        sexe: sexeUser,
        age: ageUser,
        taille: tailleUser,
        poids: poidsUser,
        fc_repos: fcReposUser
    })

    let majAutoUser = localStorage.getItem("majAutoProfil")
    if (majAutoUser != "False") {
        // sauvegarde local storage pour la maj auto du profil
        localStorage.setItem("majAutoProfil", "True")
    }

    setTimeout(() => {
        button.textContent = "Sauvegardé"
    }, 650);

    setTimeout(() => {
        button.textContent = "Sauvegarder"
        button.disabled = false
        window.location.href = "profil.html"
    }, 1300);

    return
}

async function remplirChamps() {
    // recup des datas
    let profil = await db.profil.toArray()

    if (profil.length > 0) {
        profil = profil[0] // Prendre le premier element donc profil est un dico désormais
        document.getElementById("sexe-user").value = profil.sexe
        document.getElementById("age-user").value = profil.age
        document.getElementById("taille-user").value = profil.taille
        document.getElementById("poids-user").value = profil.poids
        document.getElementById("fc-repos-user").value = profil.fc_repos
    }
}

async function supprimerProfil() {
    if (confirm("Êtes-vous sûr de vouloir supprimer votre profil ?")) {
        await db.profil.clear() // suppression du profil dans indexed db
        localStorage.removeItem("majAutoProfil")

        document.getElementById("button-supprimer").textContent = "Suppression..."

        setTimeout(() => {
            document.getElementById("button-supprimer").textContent = "Supprimé"
        }, 650);
    
        setTimeout(() => {
            document.getElementById("button-supprimer").textContent = "Supprimer mon profil"
            window.location.href = "profil.html"
        }, 1300);
    }
}

async function init() {
    const dataProfilUser = await db.profil.toArray()

    if (dataProfilUser.length <= 0) {
        document.querySelector("h1").textContent = "Configuration profil"
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const buttonSupprimerProfil = document.getElementById("button-supprimer")
    if (buttonSupprimerProfil) {buttonSupprimerProfil.addEventListener("click", () => {supprimerProfil()})}
    
    const buttonpProfilSave = document.getElementById("button-save")
    if (buttonpProfilSave) {buttonpProfilSave.addEventListener("click", () => {saveProfil()})}

    init()
    remplirChamps()

    // pour détecter si lorsqu'on est dans le formulaire il y a un appuie sur la touche entrée
    let formKeyEntry = document.querySelector(".form")
    formKeyEntry.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            saveProfil()
        }
    })
})