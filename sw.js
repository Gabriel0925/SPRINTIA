const VERSION_CACHE = "1.0.2"
// tous les fichiers qu'on glisse dans le cache pour le mode hors ligne
const fileInCache = [
    // BASE DE L'APP
    "/assets/base-js/base.js", "/assets/base-js/db-config.js", "/assets/base-js/SPRINTIA-briefing.js",

    // BIBLIOTHEQUES
    "/assets/bibliotheques/chart.min.js", "/assets/bibliotheques/dexie.js", "/assets/bibliotheques/email.min.js",  "/assets/bibliotheques/GPXParser.min.js",
    "/assets/bibliotheques/leaflet.css", "/assets/bibliotheques/leaflet.js", "/assets/bibliotheques/papaparse.min.js", "/assets/bibliotheques/simplify.js",
    "/assets/bibliotheques/images/marker-icon-2x.png", "/assets/bibliotheques/images/marker-icon.png","/assets/bibliotheques/images/marker-shadow.png",

    // FONTS
    "/assets/fonts/zalando-sans-semiexpanded-v3-latin-500.woff2", "/assets/fonts/zalando-sans-semiexpanded-v3-latin-600.woff2", 
    "/assets/fonts/zalando-sans-semiexpanded-v3-latin-700.woff2", "/assets/fonts/zalando-sans-semiexpanded-v3-latin-regular.woff2",

    // ICONS
    "/assets/icons/Font-SPRINTIA.eot", "/assets/icons/Font-SPRINTIA.svg", "/assets/icons/Font-SPRINTIA.ttf", "/assets/icons/Font-SPRINTIA.woff",
    "/assets/icons/icon-fleche.svg",

    // ICONS MANIFEST
    "/assets/icons-manifest/icon-add.png", "/assets/icons-manifest/icon-entrainement-jour.png", "/assets/icons-manifest/icon-import-file.png",

    // ICONS SPRINTIA
    "/assets/icons-SPRINTIA/icon-192.png", "/assets/icons-SPRINTIA/icon-512.png", "/assets/icons-SPRINTIA/icon-navigateur.png",
    
    // CSS
    "/css/style.css",



    // ENTRAINEMENT
    "/entrainement/a-propos-rehydratation.html", "/entrainement/ajouter-entrainement.html", "/entrainement/entrainement.html", 
    "/entrainement/script-ajout-entrainement.js", "/entrainement/script-entrainement.js", "/entrainement/statistiques.html", 



    // OUTILS
    "/outils/outils.html",

    "/outils/calculateur-imc/a-propos.html", "/outils/calculateur-imc/calculateur-imc.html", "/outils/calculateur-imc/script-outil.js",
    "/outils/convertisseur/a-propos.html", "/outils/convertisseur/convertisseur.html", "/outils/convertisseur/script-outil.js",
    "/outils/estimation-1rm/a-propos.html", "/outils/estimation-1rm/estimation-1RM.html", "/outils/estimation-1rm/script-outil.js",

    "/outils/generation-intelligente/entrainement-du-jour/bdd-entrainement.js", "/outils/generation-intelligente/entrainement-du-jour/entrainement-du-jour.html", "/outils/generation-intelligente/entrainement-du-jour/script-entrainement-du-jour.js",
    
    "/outils/hydratation/a-propos.html", "/outils/hydratation/hydratation.html", "/outils/hydratation/script-outil.js",
    "/outils/metabolisme-base/a-propos.html", "/outils/metabolisme-base/metabolisme-base.html", "/outils/metabolisme-base/script-outil.js",
    "/outils/proteines-quotidiennes/a-propos.html", "/outils/proteines-quotidiennes/proteines-quotidienne.html", "/outils/proteines-quotidiennes/script-outil.js",
    "/outils/temps-recuperation/a-propos.html", "/outils/temps-recuperation/temps-recuperation.html", "/outils/temps-recuperation/script-outil.js",
    "/outils/zones-cardiaques/a-propos.html", "/outils/zones-cardiaques/zones-cardiaques.html", "/outils/zones-cardiaques/script-outil.js",



    // PLUS
    "/plus/plus.html",

    "/plus/discussion-jrm-coach/discussion.html", "/plus/discussion-jrm-coach/parametres.html",

    // HISTORIQUE VERSIONS
    "/plus/historique-versions/historique-versions.html",
    // gen1
    "/plus/historique-versions/generation-1/SPRINTIA-1.html", "/plus/historique-versions/generation-1/SPRINTIA-1.1.html", 
    "/plus/historique-versions/generation-1/SPRINTIA-1.2.html", "/plus/historique-versions/generation-1/SPRINTIA-1.3.html", 
    "/plus/historique-versions/generation-1/images-gen-1/1-charge-entrainement.png", "/plus/historique-versions/generation-1/images-gen-1/1-connexion.png",
    "/plus/historique-versions/generation-1/images-gen-1/1-menu-accueil.png",
    // gen 2
    "/plus/historique-versions/generation-2/SPRINTIA-2.html", "/plus/historique-versions/generation-2/images-gen-2/2-charge-entrainement.png",
    "/plus/historique-versions/generation-2/images-gen-2/2-connexion.png", "/plus/historique-versions/generation-2/images-gen-2/2-menu-accueil.png",
    // gen 3
    "/plus/historique-versions/generation-3/SPRINTIA-3.html", "/plus/historique-versions/generation-3/SPRINTIA-3.1.html",
    "/plus/historique-versions/generation-3/SPRINTIA-3.1.1.html", "/plus/historique-versions/generation-3/SPRINTIA-3.1.2.html",
    "/plus/historique-versions/generation-3/SPRINTIA-3.1.3.html", "/plus/historique-versions/generation-3/SPRINTIA-3.1.4.html",
    "/plus/historique-versions/generation-3/SPRINTIA-3.1.5.html", "/plus/historique-versions/generation-3/SPRINTIA-3.2.html",
    "/plus/historique-versions/generation-3/SPRINTIA-3.2.1.html", "/plus/historique-versions/generation-3/images-gen-3/3-ajout-entrainement.png", 
    "/plus/historique-versions/generation-3/images-gen-3/3-connexion.png", "/plus/historique-versions/generation-3/images-gen-3/3-menu-accueil.png",
    // gen 4
    "/plus/historique-versions/generation-4/SPRINTIA-4.html", "/plus/historique-versions/generation-4/SPRINTIA-4.0.1.html",
    "/plus/historique-versions/generation-4/SPRINTIA-4.0.2.html", "/plus/historique-versions/generation-4/SPRINTIA-4.0.3.html",
    "/plus/historique-versions/generation-4/SPRINTIA-4.1.html", "/plus/historique-versions/generation-4/SPRINTIA-4.2.html",
    "/plus/historique-versions/generation-4/SPRINTIA-4.2.1.html", "/plus/historique-versions/generation-4/SPRINTIA-4.3.html",
    "/plus/historique-versions/generation-4/SPRINTIA-4.3.1.html", "/plus/historique-versions/generation-4/SPRINTIA-4.3.2.html",
    "/plus/historique-versions/generation-4/images-gen-4/4-charge-entrainement.jpg", "/plus/historique-versions/generation-4/images-gen-4/4-logo-dynamique.jpg", 
    "/plus/historique-versions/generation-4/images-gen-4/4-themes.jpg",
    // gen 5
    "/plus/historique-versions/generation-5/SPRINTIA-5.html", "/plus/historique-versions/generation-5/SPRINTIA-5.1.html",
    "/plus/historique-versions/generation-5/SPRINTIA-5.2.html", "/plus/historique-versions/generation-5/images-gen-5/v5-page-entrainement.png", 
    "/plus/historique-versions/generation-5/images-gen-5/v5-page-niveau-course.png", "/plus/historique-versions/generation-5/images-gen-5/v5-page-progression.png",
    // gen 26
    "/plus/historique-versions/generation-26/v26.09.html",

    "/plus/import-des-donnees/importer-donnees.html", "/plus/import-des-donnees/script-import-generale.js",
    "/plus/import-des-donnees/import-garmin/import-garmin.html", "/plus/import-des-donnees/import-garmin/script_import.js",
    "/plus/import-des-donnees/import-gpx/import-gpx.html", "/plus/import-des-donnees/import-gpx/script_import_gpx.js",
    "/plus/import-des-donnees/import-SPRINTIA/import-SPRINTIA.html", "/plus/import-des-donnees/import-SPRINTIA/script_import.js",
    "/plus/import-des-donnees/import-tcx/import-tcx.html", "/plus/import-des-donnees/import-tcx/script_import_tcx.js",
    "/plus/import-des-donnees/import-tp/import-trainingpeaks.html", "/plus/import-des-donnees/import-tp/script_import.js",    
    
    // PARAMETRES
    "/plus/parametres/parametres.html",

    "/plus/parametres/a-propos/a-propos.html",
    "/plus/parametres/ameliorer-SPRINTIA/ameliorer-SPRINTIA.html", "/plus/parametres/ameliorer-SPRINTIA/script-feeback.js",
    "/plus/parametres/confidentialite/confidentialite.html",

    "/plus/parametres/gestion-donnees/exporter-donnees.html", "/plus/parametres/gestion-donnees/nettoyage-donnees.html",
    "/plus/parametres/gestion-donnees/restaurer-donnees.html", "/plus/parametres/gestion-donnees/supprimer-donnees.html",
    "/plus/parametres/gestion-donnees/script-save-restoration.js",

    "/plus/parametres/jrm-coach/jrm-coach.html", "/plus/parametres/jrm-coach/script-jrm.js",
    "/plus/parametres/licence/licence.html",
    "/plus/parametres/SPRINTIA-briefing/SPRINTIA-briefing.html", "/plus/parametres/SPRINTIA-briefing/script-ia-preferee.js","/plus/parametres/SPRINTIA-briefing/a-propos.html",

    "/plus/profil/modification-profil.html", "/plus/profil/profil.html",

    "/plus/tutoriels/tutoriels.html",


    // PROGRESSION
    "/progression/progression.html",

    "/progression/charge-entrainement/a-propos.html", "/progression/charge-entrainement/charge-entrainement.html", "/progression/charge-entrainement/script-charge-entrainement.js",
    
    "/progression/indulgence-course/a-propos.html", "/progression/indulgence-course/indulgence-course.html", "/progression/indulgence-course/parametres.html", "/progression/indulgence-course/script-outil.js",

    "/progression/niveau-course/a-propos.html", "/progression/niveau-course/ajouter-niveau-course.html", "/progression/niveau-course/niveau-course-analyse.html", "/progression/niveau-course/niveau-course-evolution.html", 
    "/progression/niveau-course/script-historique-niveau-course.js", "/progression/niveau-course/script-niveau-course-analyse.js", "/progression/niveau-course/script-sauvegarder-niveau.js",

    "/progression/recuperation/a-propos.html", "/progression/recuperation/ajouter-recuperation.html", "/progression/recuperation/historique-recuperation.html",
    "/progression/recuperation/recuperation.html", "/progression/recuperation/script-recuperation.js",

    "/index.html", "/manifest.json"
]

// script que le navigateur fais tourner en arrière plan, séparement de ma page web
// !!! ATTENTION le localhost est désactivé en localhost (voir file base.js)

// self désigne le service worker
self.addEventListener("fetch", (event) => {
    // lorsque qu'une page demande un file dans le cache
    event.respondWith(
        // on view si on a le fichier (dans le cache) que la requete demande
        // then pour attendre le result du match
        // le "ignoreSearch->true" c'est pour ignorer les param comme c'est dit dans le nom et ça permet d'ouvrir la page entrainement
        // car auparavant ça fonctionnait pas car il y avait un param sauf que la requette cherchait un nom de fichier "entrainement.html?234" alors que c'est l'id le fichier c'est "entrainement.html"
        caches.match(event.request, {ignoreSearch: true}).then((response) => {
            // si le file est trouvé dans le cache on le return sinon on le chercher sur internet (donc avec de la connexion)
            return response || fetch(event.request)
        })
    )
})

// pr forcer la maj du sw
self.addEventListener("install", (event) => {
    self.skipWaiting()

    // on met dans le cache les fichiers
    event.waitUntil(
        caches.open(VERSION_CACHE).then(cache=>cache.addAll(fileInCache))
    )
})

// le nouveau sw prend le controle
self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim()) // pr rafraichir le manifest et le sw sans rafraichir la page
})
