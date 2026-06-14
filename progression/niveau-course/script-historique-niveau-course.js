function ReturnDate(DateNiveauCourse) {
    let DateEuropeen = ""

    DateNiveauCourse = DateNiveauCourse.split("-")
    // Inversion de la date de "2026-01-12" à "12-01-2026"
    DateEuropeen = DateNiveauCourse[2] + "-" + DateNiveauCourse[1] + "-" + DateNiveauCourse[0]
    return DateEuropeen
}
async function RecupValueNiveauCourseGraphique() {
    // Initialisation 
    let TailleHardware = window.innerWidth
    let NbValeurRecup = -13

    // Logique de nb datas en fonction du devices
    if (TailleHardware <= 520) {
        NbValeurRecup = -4
    } else if (TailleHardware <= 640) {
        NbValeurRecup = -6
    } else if (TailleHardware <= 720) {
        NbValeurRecup = -7
    } else if (TailleHardware <= 790) {
        NbValeurRecup = -8
    } else if (TailleHardware <= 1000) {
        NbValeurRecup = -10
    }

    // Recup value Data
    const ValeurDB = await db.niveau_course.toArray()    
    
    // Trier par date 
    ValeurDB.sort((element1, element2) => { // En js on peut comparer 2 dates comme des maths
        if (element1.date < element2.date) return -1
        if (element1.date > element2.date) return 1
    })

    // map permet de retourner une nouvelle liste a partir d'une premiere liste et de prendre qu'une seule clé d'un objet
    // slice permet de découper un tableau pour en garder qu'une partie grace aux indices
    const NiveauDatas = ValeurDB.slice(NbValeurRecup).map(dataBDD => dataBDD.niveau_course_user) // -10 pr prendre les 1à dernieres valeur
    const DateDatas = ValeurDB.slice(NbValeurRecup).map(dataBDD => dataBDD.date)

    // Initialisation d'une liste de date avec le format européen
    let ListeDate = []
    let DateEuropeen = ""

    DateDatas.forEach(element => { // Parcours des dates
        DateEuropeen = ReturnDate(element)
        ListeDate.push(DateEuropeen) // Ajout à la liste des dates format européen
    });
    
    return {NiveauDatas, ListeDate}
}
async function graph() {
    // attendre la recup des datas
    let {NiveauDatas, ListeDate} = await RecupValueNiveauCourseGraphique()

    if (NiveauDatas.length <= 0) {
        NiveauDatas = [0, 0, 0]
        ListeDate = ["Janvier", "Février", "Mars"]
    }
    
    genererGraphiqueLine(ListeDate, NiveauDatas)
}

function ReturnDate(DateNiveauCourse) {
    let DateEuropeen = ""

    DateNiveauCourse = DateNiveauCourse.split("-")
    // Inversion de la date de "2026-01-12" à "12-01-2026"
    DateEuropeen = DateNiveauCourse[2] + "-" + DateNiveauCourse[1] + "-" + DateNiveauCourse[0]
    return DateEuropeen
}

async function RecupValueNiveauCourse() {
    // Recup value Data
    const ValeurDB = await db.niveau_course.toArray()

    // Trier par date 
    ValeurDB.sort((element1, element2) => { // En js on peut comparer 2 dates comme des maths
        if (element1.date < element2.date) return -1
        if (element1.date > element2.date) return 1
    })

    // map permet de retourner une nouvelle liste a partir d'une premiere liste et de prendre qu'une seule clé d'un objet
    let DateDatas = ValeurDB.map(dataBDD => dataBDD.date)
    // Reverse pour mettre a lenvers les données pour que ds le tableau plus on descend plus c'est des valeurs ancienne
    DateDatas = DateDatas.reverse()

    // Initialisation d'une liste de date avec le format européen
    let ListeDate = []
    let DateEuropeen = ""

    DateDatas.forEach(element => { // Parcours des dates
        DateEuropeen = ReturnDate(element)
        ListeDate.push(DateEuropeen) // Ajout à la liste des dates format européen
    });

    let NiveauDatas = ValeurDB.map(dataBDD => dataBDD.niveau_course_user)
    NiveauDatas = NiveauDatas.reverse()

    let DistanceDatas = ValeurDB.map(dataBDD => dataBDD.distance)
    DistanceDatas = DistanceDatas.reverse()

    let idDatas = ValeurDB.map(dataBDD => dataBDD.id)
    idDatas = idDatas.reverse()
    
    return {idDatas, NiveauDatas, DistanceDatas, ListeDate}
}

async function RemplirTableau() {
    // Recup des valeur dans bdd
    let {idDatas, NiveauDatas, DistanceDatas, ListeDate} = await RecupValueNiveauCourse()

    // Recup du tableau
    let TableauHistorique = document.getElementById("tableau-historique")

    if (NiveauDatas.length > 0) {
        document.getElementById("text-informatif").style.display = "none"
    } else {
        TableauHistorique.style.display = 'none'
    }

    let compteur = 0
    ListeDate.forEach(Date => {
        // Créer nouvelle ligne
        let NouvelleLigne = TableauHistorique.insertRow()

        // Créer une nouvelle ligne
        let ColonneDate = NouvelleLigne.insertCell(0)
        let ColonneNiveau = NouvelleLigne.insertCell(1)
        let ColonneDistance = NouvelleLigne.insertCell(2)
        let colonneAction = NouvelleLigne.insertCell(3)

        // Remplir ligne
        ColonneDate.textContent = Date
        ColonneNiveau.textContent = NiveauDatas[compteur].toString().replace(".", ",") // ne pas oublier de le mettre en str avant le replace
        if (DistanceDatas[compteur] != undefined) {
            ColonneDistance.textContent = DistanceDatas[compteur].toString().replace(".", ",")
        } else {
            ColonneDistance.textContent = "-"
        }

        // Create button
        let btnModifier = document.createElement("button")
        btnModifier.textContent = "Modifier"
        colonneAction.appendChild(btnModifier)
        // Ajout de la class
        btnModifier.classList.add("table")
        
        let BoutonSupprTableau = document.createElement("button")
        BoutonSupprTableau.textContent = "Supprimer"
        colonneAction.appendChild(BoutonSupprTableau)

        // Ajout de la class
        BoutonSupprTableau.classList.add("table")

        const EtapeBoucle = compteur // Grâce a const la variable ne change jamais donc chaque bouton enregistre sa ligne en fonction de letape de la bouclz
        // Ajout de la logique pour la suppresion
        BoutonSupprTableau.addEventListener("click", async () => { // Ajout d'une "action" au bouton
            // confirmation avant suppression
            if (confirm("Supprimer ce niveau de course ?")) {
                await db.niveau_course.delete(idDatas[EtapeBoucle]) // supprimer la data de la bdd
                await NouvelleLigne.remove() // supprimer la ligne

                graph()

                let DataTableau = document.querySelectorAll("td") // Recup des lignes pour savoir quand il faut cacher le tableau
                let Tableau = document.getElementById("tableau-historique") // recup du tableau

                if (DataTableau.length <= 0) {
                    // On cache tout
                    Tableau.style.display = "none"
                    // on fais apparaitre le message comme quoi SPRINTIA n'a pas encore assez de données
                    document.getElementById("text-informatif").style.display = "block"
                } 
                
                logoDynamique("Supprimé 🗑️")
            }
        })

        compteur+=1
    });

    return
}
