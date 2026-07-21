const bddSeancesCourseFacile = {
    "25": [
        {
            "title": `2 blocs de 10 x 30"/30"`,
            "description": `Cet entraînement est un classique en course à pied. Le but de cet entraînement est de développer votre VMA et votre
                            capacité à répéter des efforts intenses.`,
            "informations": {
                "duree_totale": "42:00",
                "rpe": 5,
                "charge_entrainement": 210
            },
            "structure": {
                "echauffement": {
                    "volume": [10, "min"]
                },
                "fractionne": {
                    "plusieurs_blocs": true,
                    "structure_blocs": [
                        {
                        "type": "effort",
                        "nombre_repetitions": 10,
                        "volume_effort": [30, "sec"],
                        "volume_recuperation": [30, "sec"]
                        },
                        {
                        "type": "recuperation",
                        "volume_recuperation": [2, "min"]
                        },
                        {
                        "type": "effort",        
                        "nombre_repetitions": 10,
                        "volume_effort": [30, "sec"],
                        "volume_recuperation": [30, "sec"]
                        }
                    ]
                },
                // "effort": {
                //     "volume_effort": [10, "min"]
                // },
                // "recuperation": {
                //     "volume_recuperation": [10, "min"]
                // },
                "retour_au_calme": {
                    "volume": [10, "min"]
                }
            },
            "lien": "https://sharepageeu.coros.com/share/training/program/479033908856537487/region-3-time-1784540445"
        },
        {
            "title": `8 x 400m`,
            "description": `Cet entraînement a pour but d'améliorer ta vitesse au 5 km et au 10 km`,
            "informations": {
                "duree_totale": "--:--",
                "rpe": 5,
                "charge_entrainement": 210
            },
            "structure": {
                "echauffement": {
                    "volume": [10, "min"]
                },
                "fractionne": {
                    "plusieurs_blocs": false,
                    "nombre_repetitions": 8,
                    "volume_effort": [400, "m"],
                    "volume_recuperation": [2, "min"]
                },
                "retour_au_calme": {
                    "volume": [10, "min"]
                }
            },
            "lien": "https://sharepageeu.coros.com/share/training/program/479063262271553736/region-3-time-1784649723"
        }
    ],
    "50": ""
}
const bddSeancesCourseModere = {
    "25": "",
    "50": ""
}
const bddSeancesCourseDifficile = {
    "25": "",
    "50": ""
}

const bddSeancesVeloFacile = {
    "25": "",
    "50": ""
}
const bddSeancesVeloModere = {
    "25": "",
    "50": ""
}
const bddSeancesVeloDifficile = {
    "25": "",
    "50": ""
}

const bddSeancesNatationFacile = {
    "25": "",
    "50": ""
}
const bddSeancesNatationModere = {
    "25": "",
    "50": ""
}
const bddSeancesNatationDifficile = {
    "25": "",
    "50": ""
}