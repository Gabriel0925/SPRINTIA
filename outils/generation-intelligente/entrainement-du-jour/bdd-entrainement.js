const bddSeancesCourseFacile = {
    "25": [
        {
            "title": `6 x 30"/30"`,
            "description": `Une séance très accessible pour s'initier au fractionné court et dynamiser sa foulée en douceur sans accumuler de fatigue.`,
            "informations": {
                "duree_totale": "26:00",
                "rpe": "3-4",
                "charge_entrainement": 91
            },
            "structure": {
                "echauffement": {
                    "volume": [10, "min"]
                },
                "fractionne": {
                    "plusieurs_blocs": false,
                    "nombre_repetitions": 6,
                    "volume_effort": [30, "sec"],
                    "volume_recuperation": [30, "sec"]
                },
                "retour_au_calme": {
                    "volume": [10, "min"]
                }
            },
            "lien": "https://trainingeu.coros.com/workout-program?programId=479080058817004138&region=3"
        }
    ],
    "50": [
        {
            "title": `Endurance fondamentale (50 min)`,
            "description": `Le but de cet entraînement est de développer votre aisance respiratoire. Je sais que c'est dur mais veuillez rester en zone 2 de fréquence cardiaque.`,
            "informations": {
                "duree_totale": "50:00",
                "rpe": "2-3",
                "charge_entrainement": 125
            },
            "structure": {
                "effort": {
                    "volume_effort": [50, "min"]
                },
            },
            "lien": "https://trainingeu.coros.com/workout-program?programId=479080218267664483&region=3"
        }
    ]
}
const bddSeancesCourseModere = {
    "25": [
        {
            "title": `10 x 30"/30"`,
            "description": `Cet entraînement est un classique en course à pied. Le but de cet entraînement est de développer votre VMA et votre
                            capacité à répéter des efforts intenses.`,
            "informations": {
                "duree_totale": "26:00",
                "rpe": 6,
                "charge_entrainement": 156
            },
            "structure": {
                "echauffement": {
                    "volume": [8, "min"]
                },
                "fractionne": {
                    "plusieurs_blocs": false,
                    "nombre_repetitions": 10,
                    "volume_effort": [30, "sec"],
                    "volume_recuperation": [30, "sec"]
                },
                "retour_au_calme": {
                    "volume": [8, "min"]
                }
            },
            "lien": "https://trainingeu.coros.com/workout-program?programId=479079963520319787&region=3"
        }
    ],
    "50": [
        {
            "title": `Pyramide 1-2-3-4-3-2-1 min`,
            "description": `Une séance dynamique où la durée des efforts varie. Parfait pour faire travailler le coeur et casser la routine d'un footing classique.`,
            "informations": {
                "duree_totale": "46:00",
                "rpe": 6,
                "charge_entrainement": 276
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
                        "nombre_repetitions": 1,
                        "volume_effort": [1, "min"],
                        "volume_recuperation": [1, "min"]
                        },
                        {
                        "type": "effort",
                        "nombre_repetitions": 1,
                        "volume_effort": [2, "min"],
                        "volume_recuperation": [1, "min"]
                        },
                        {
                        "type": "effort",
                        "nombre_repetitions": 1,
                        "volume_effort": [3, "min"],
                        "volume_recuperation": [2, "min"]
                        },
                        {
                        "type": "effort",
                        "nombre_repetitions": 1,
                        "volume_effort": [4, "min"],
                        "volume_recuperation": [2, "min"]
                        },
                        {
                        "type": "effort",
                        "nombre_repetitions": 1,
                        "volume_effort": [3, "min"],
                        "volume_recuperation": [2, "min"]
                        },
                        {
                        "type": "effort",
                        "nombre_repetitions": 1,
                        "volume_effort": [2, "min"],
                        "volume_recuperation": [1, "min"]
                        },
                        {
                        "type": "effort",
                        "nombre_repetitions": 1,
                        "volume_effort": [1, "min"],
                        "volume_recuperation": [1, "min"]
                        },
                    ]
                },
                "retour_au_calme": {
                    "volume": [10, "min"]
                }
            },
            "lien": "https://trainingeu.coros.com/workout-program?programId=479080429524271405&region=3"
        }
    ]
}
const bddSeancesCourseDifficile = {
    "25": [
        {
            "title": `12 x 40"/20"`,
            "description": `Une séance à haute intensité où la récupération très courte maintient la fréquence cardiaque au sommet. Idéal pour repousser tes limites en un minimum de temps.`,
            "informations": {
                "duree_totale": "26:00",
                "rpe": 8,
                "charge_entrainement": 208
            },
            "structure": {
                "echauffement": {
                    "volume": [7, "min"]
                },
                "fractionne": {
                    "plusieurs_blocs": false,       
                    "nombre_repetitions": 12,
                    "volume_effort": [40, "sec"],
                    "volume_recuperation": [20, "sec"]
                },
                "retour_au_calme": {
                    "volume": [7, "min"]
                }
            },
            "lien": "https://trainingeu.coros.com/workout-program?programId=479080503075586048&region=3"
        },
    ],
    "50": [
        {
            "title": `2 blocs de 10 x 30"/30"`,
            "description": `Cet entraînement est un classique en course à pied. Le but de cet entraînement est de développer votre VMA et votre
                            capacité à répéter des efforts intenses.`,
            "informations": {
                "duree_totale": "43:00",
                "rpe": 7,
                "charge_entrainement": 301
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
                        "volume_recuperation": [3, "min"]
                        },
                        {
                        "type": "effort",        
                        "nombre_repetitions": 10,
                        "volume_effort": [30, "sec"],
                        "volume_recuperation": [30, "sec"]
                        }
                    ]
                },
                "retour_au_calme": {
                    "volume": [10, "min"]
                }
            },
            "lien": "https://trainingeu.coros.com/workout-program?programId=479079830646866019&region=3"
        },
    ]
}


const bddSeancesVeloFacile = {
    "25": [
        {
            "title": `Récupération (25 min)`,
            "description": `L'objectif de cet entraînement est de faire tourner les jambes pour activer la circulation et récupérer sans solliciter les muscles. Le mieux est de rester en zone 2 de fréquence cardiaque.`,
            "informations": {
                "duree_totale": "25:00",
                "rpe": 2,
                "charge_entrainement": 50
            },
            "structure": {
                "effort": {
                    "volume_effort": [25, "min"]
                }
            },
            "lien": "https://trainingeu.coros.com/workout-program?programId=479081584602038471&region=3"
        }
    ],
    "50": [
        {
            "title": `Endurance fondamentale (50 min)`,
            "description": `Le but de cet entraînement est de développer votre aisance respiratoire. Je sais que c'est dur mais veuillez rester en zone 2 de fréquence cardiaque.`,
            "informations": {
                "duree_totale": "50:00",
                "rpe": 3,
                "charge_entrainement": 150
            },
            "structure": {
                "effort": {
                    "volume_effort": [50, "min"]
                }
            },
            "lien": "https://trainingeu.coros.com/workout-program?programId=479081584602038471&region=3"
        }
    ]
}
const bddSeancesVeloModere = {
    "25": [
        {
            "title": `10 x 15"/45"`,
            "description": `C'est un entraînement dynamique composé de petites accélérations très courtes pour se faire plaisir et pour travailler la vitesse sans accumuler d'acide lactique.`,
            "informations": {
                "duree_totale": "26:00",
                "rpe": 5,
                "charge_entrainement": 130
            },
            "structure": {
                "echauffement": {
                    "volume": [8, "min"]
                },
                "fractionne": {
                    "plusieurs_blocs": false,
                    "nombre_repetitions": 10,
                    "volume_effort": [15, "sec"],
                    "volume_recuperation": [45, "sec"]
                },
                "retour_au_calme": {
                    "volume": [8, "min"]
                }
            },
            "lien": "https://trainingeu.coros.com/workout-program?programId=479081686607511652&region=3"
        }
    ],
    "50": [
        {
            "title": `Travail de la force - 3 x 8'`,
            "description": `Cet entraînement vous permet de travailler au seuil, ce qui vous permettra d'améliorer vos performances par la suite.`,
            "informations": {
                "duree_totale": "50:00",
                "rpe": 6,
                "charge_entrainement": 300
            },
            "structure": {
                "echauffement": {
                    "volume": [10, "min"]
                },
                "fractionne": {
                    "plusieurs_blocs": false,
                    "nombre_repetitions": 3,
                    "volume_effort": [8, "min"],
                    "volume_recuperation": [2, "min"]
                },
                "retour_au_calme": {
                    "volume": [10, "min"]
                }
            },
            "lien": "https://trainingeu.coros.com/workout-program?programId=479081706740171152&region=3"
        }
    ]
}
const bddSeancesVeloDifficile = {
    "25": [
        {
            "title": `10 x 40"/20"`,
            "description": `Cet entraînement est un grand classique en vélo, c'est l'un des formats les plus efficaces pour progresser rapidement. Votre VO2max va être boostée par cet entraînement.`,
            "informations": {
                "duree_totale": "26:00",
                "rpe": 8,
                "charge_entrainement": 208
            },
            "structure": {
                "echauffement": {
                    "volume": [8, "min"]
                },
                "fractionne": {
                    "plusieurs_blocs": false,
                    "nombre_repetitions": 10,
                    "volume_effort": [40, "sec"],
                    "volume_recuperation": [20, "sec"]
                },
                "retour_au_calme": {
                    "volume": [8, "min"]
                }
            },
            "lien": "https://trainingeu.coros.com/workout-program?programId=479081797471355279&region=3"
        }
    ],
    "50": [
        {
            "title": `2 blocs de 8 x 1'/1'`,
            "description": `Cet entraînement vise à développer votre VO2max et votre résistance à l'effort donc votre mental.`,
            "informations": {
                "duree_totale": "56:00",
                "rpe": 9,
                "charge_entrainement": 504
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
                            "nombre_repetitions": 8,
                            "volume_effort": [1, "min"],
                            "volume_recuperation": [1, "min"]
                        },
                        {
                            "type": "recuperation",
                            "volume_recuperation": [4, "min"]
                        },
                        {
                            "type": "effort",
                            "nombre_repetitions": 8,
                            "volume_effort": [1, "min"],
                            "volume_recuperation": [1, "min"]
                        }
                    ]
                },
                "retour_au_calme": {
                    "volume": [10, "min"]
                }
            },
            "lien": "https://trainingeu.coros.com/workout-program?programId=479081883639136655&region=3"
        }
    ]
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