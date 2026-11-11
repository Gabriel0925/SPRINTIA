const containerLineHistorique = document.querySelector("section.container-historique-line")
let dataRecuperation = undefined
let historiqueComplet = []
let nbCardsAfficher = 0

function deleteButtonCard() {
    let buttonSupprimerClose = document.getElementById("supprimer")
    if (buttonSupprimerClose) {
        buttonSupprimerClose.remove()
    }
    let buttonModifierClose = document.getElementById("modifier")
    if (buttonModifierClose) {
        buttonModifierClose.remove()
    }
}
function createButtonCard(card, data) {
    // si la card n'est pas open on l'ouvre
    if (!card.classList.contains("open")) {
        // si ya une card qui est open on la referme et on supprime les boutons
        let carOpen = document.querySelector("section.container-historique-line div.card-historique-line.open")
        if (carOpen) {
            carOpen.classList.remove("open")
        }
        deleteButtonCard()

        // on ouvre la card et on créer les boutons
        card.classList.add("open")

        let buttonModifier = document.createElement("button")
        buttonModifier.classList.add("button-card-open")
        buttonModifier.id = "modifier"
        buttonModifier.textContent = "Modifier"

        let buttonSupprimer = document.createElement("button")
        buttonSupprimer.classList.add("button-card-open")
        buttonSupprimer.id = "supprimer"
        buttonSupprimer.textContent = "Supprimer"

        //  on leur donne un role
        buttonModifier.addEventListener("click", () => {
            window.location.href = `ajouter-recuperation.html?edit=${data.id}`
        })
        buttonSupprimer.addEventListener("click", async() => {
            if (confirm("Supprimer votre récupération du " + formatEuropeenDate(data.date) + " ?")) {
                await db.recuperation.delete(data.id)
                card.remove()
            }
        })

        // ajout dans la card
        card.appendChild(buttonModifier)
        card.appendChild(buttonSupprimer)
    } else { // si la card est open on la referme et on supprime les boutons
        card.classList.remove("open")

        deleteButtonCard()
    }
}
function createCard(data) {
    if (containerLineHistorique) {
        let divCard = document.createElement("div")
        divCard.classList.add("card-historique-line")

        let spanDate = document.createElement("span")
        spanDate.classList.add("data")
        spanDate.id = "date"
        spanDate.textContent = formatEuropeenDate(data.date)

        let divContainerData = document.createElement("div")
        divContainerData.classList.add("container-data")

        let spanFcRepos = document.createElement("span")
        spanFcRepos.classList.add("data")
        spanFcRepos.id = "fc-repos"
        spanFcRepos.textContent = data.fc_repos
        divContainerData.appendChild(spanFcRepos)

        let smallUnit = document.createElement("small")
        smallUnit.textContent = "bpm"
        divContainerData.appendChild(smallUnit)

        divCard.appendChild(spanDate)
        divCard.appendChild(divContainerData)

        // on lui donne un role
        divCard.addEventListener("click", (e) => {
            // si le click n'est pas sur un bouton on ouvre/ferme la card
            if (e.target.tagName !== "BUTTON") {
                createButtonCard(divCard, data)
            }
        })
        
        // on l'ajoute au container-principale
        containerLineHistorique.appendChild(divCard)

    } else {
        return undefined
    }
}

function affichageCard(debutSlice, finSlice) {
    // si ya moins de 12 discussions on affiche pas le button plus
    if (historiqueComplet.length <= 12) {
        document.getElementById("button_afficher_plus").style.display = "none"
    }
    // si il n'y a plus de cartes a ajouter on fais disparaitre le bouton voir plus
    if (historiqueComplet.length <= finSlice) {
        document.getElementById("button_afficher_plus").style.display = "none"
    } else {
        document.getElementById("button_afficher_plus").style.display = "block"
    }

    let historiqueSaveForAfficher = historiqueComplet.slice(debutSlice, finSlice)
    historiqueSaveForAfficher.forEach(element => {
        createCard(element)
        
        if (containerLineHistorique.classList.contains("skeleton")) {
            containerLineHistorique.classList.remove("skeleton")
        }
    })

    if (nbCardsAfficher+12 > 12) {
        sessionStorage.setItem("nbCardRecuperation", nbCardsAfficher+12)
    }
}

async function findDataRecuperation(inputSearch) {
    let rechercheUser = inputSearch.value.toLowerCase()

    if (rechercheUser.trim() == "") {
        await init()
    } else {
        let rechercheUserClean = rechercheUser.replaceAll(" ", "-").replaceAll("/", "-")
        let tableauMotRechercheUser = rechercheUserClean.split("-")
        const dicoMois = {
            "janvier": "01", "janv.": "01",
            "février": "02", "fevrier": "02", "fév.": "02",
            "mars": "03",
            "avril": "04", "avr.": "04",
            "mai": "05",
            "juin": "06", "juillet": "07", "juil.": "07",
            "août": "08", "aout": "08",
            "septembre": "09", "sept.": "09",
            "octobre": "10", "oct.": "10",
            "novembre": "11", "nov.": "11",
            "décembre": "12", "dec.": "12"
        }
        console.log(tableauMotRechercheUser)

        let compteur = 0
        tableauMotRechercheUser.forEach(element => {
            if (dicoMois[element]) {
                tableauMotRechercheUser[compteur] = dicoMois[element]
            }

            compteur+=1
        });

        
        let filteredHistoriqueComplet = historiqueComplet.filter(recuperation => {
            let dateRecup = recuperation.date.toLowerCase() // on met lla discussion de l'historique en minuscule

            let correspondance = true
            for (const elt of tableauMotRechercheUser) {
                // si le mot n'est pas présent dans l'historique de discussion enfin dans la discussion alors on arrete la boucle
                if (!dateRecup.includes(elt)) {
                    correspondance = false
                    break
                }
            }
            return correspondance // on return si ya une correspondance ou non
        })

        document.getElementById("list-recup").textContent = ""
        document.getElementById("button_afficher_plus").style.display = "none"
        
        if (filteredHistoriqueComplet.length <= 0) {
            document.getElementById("aucun-resultat").style.display = "flex"
        } else {
            document.getElementById("aucun-resultat").style.display = "none"

            filteredHistoriqueComplet.forEach(element => {
                createCard(element)
            });
        }

    }
}

async function init() {
    // réinitialisation des variables
    historiqueComplet = []
    nbCardsAfficher = 0
    document.getElementById("list-recup").textContent = ""

    const historiqueRecuperation = await db.recuperation.orderBy("date").toArray()

    if (historiqueRecuperation.length > 0) { // si ya des datas
        historiqueRecuperation.reverse() // on met du plus récent au plus ancien

        historiqueRecuperation.forEach(elt => {
            historiqueComplet.push(elt) // on ajoute tout dans un tableau pour éviter de faire trop de requete à la bdd
        });

        let nbCardAuDebut = parseInt(sessionStorage.getItem("nbCardRecuperation")) || 12
        affichageCard(0, nbCardAuDebut)
        nbCardsAfficher+=nbCardAuDebut
        
    } else {
        let visuelInformation = document.getElementById("aucune-data")
        if (visuelInformation) {visuelInformation.style.display = "flex"}

        let divInputSearch = document.querySelector("div.input-search")
        if (divInputSearch) {divInputSearch.style.display="none"}

        if (containerLineHistorique) {containerLineHistorique.style.display = "none"}
    }
}

document.addEventListener("DOMContentLoaded", async() => {
    const segmentedButtonAnalyse = document.getElementById("segmented-button-analyse")
    if (segmentedButtonAnalyse) {segmentedButtonAnalyse.addEventListener("click", () =>{window.location.href = 'recuperation-analyse.html'})}

    let inputSearch = document.getElementById("input-search")
    if (inputSearch) {inputSearch.addEventListener("input", async() => {await findDataRecuperation(inputSearch)})}

    let iconRecherche = document.querySelector("i.icon_search")
    if (iconRecherche) {iconRecherche.addEventListener("click", () => {document.getElementById('input-search').focus()})}

    const buttonAfficherPlus = document.getElementById("button_afficher_plus")
    if (buttonAfficherPlus) {
        buttonAfficherPlus.addEventListener("click", () => {
            affichageCard(nbCardsAfficher, nbCardsAfficher+12)
            nbCardsAfficher += 12
        })
    }

    await init()
})