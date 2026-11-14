function dureeHeure(dureeMin) {
    return dureeMin/60
}

function coefficientRpe(rpe) {
    const dicoCoef = {
        1: 0.4, 2: 0.4, 3: 0.4,
        4: 0.8, 5: 0.8, 6: 0.8,
        7: 1.2, 8: 1.2,
        9:1.6, 10:1.6
    }

    return dicoCoef[rpe]
}
function calculTranspiration(dureeEnHeure, coef, poidsUser) {
    return Math.round((dureeEnHeure*coef*(poidsUser/70))*1000)
}
function calculHydratation(transpiration) {
    return Math.round(transpiration*1.2)
}

async function getProfil() {
   return await db.profil.get(1)
}

async function dataProfil(duree, rpe) {
    const dataProfil = await getProfil()
    
    // si ya pas de données
    if (dataProfil == undefined) {return}

    // data que nous avons besoin pour lancer le calcul de l'hydratation et de la transpiration
    const poidsUser = Number(dataProfil.poids)
    const coef = coefficientRpe(rpe)

    const transpiration = calculTranspiration(dureeHeure(duree), coef, poidsUser)
    const hydratation = calculHydratation(transpiration)

    return {
        "transpiration": transpiration,
        "hydratation": hydratation
    }
}