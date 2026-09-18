async function sendEmail(descriptionUser) {
    let inputCacher = document.getElementById("input-cacher").value
    if (inputCacher.length > 0) {return} /* protection contre les Honeypot (= les bots qui remplisse tous les inputs d'une page et qui peuvent me spammer de mail) */

    // on vérifie si le user n'a pas déjà envoyé un mail ses dernieres heures
    let lastEmailJsSend = localStorage.getItem("emailJSLastSend")
    if (lastEmailJsSend!=null) {
        lastEmailJsSend = lastEmailJsSend

        const tempsEcoule = Date.now() - Number(lastEmailJsSend)

        if (tempsEcoule < 3600000) { // une heure -> 3 600 000 ms car 60*60*1000
            alert("Vous avez déjà envoyé un email récemment. Veuillez attendre une heure pour envoyé un nouveau mail, merci de votre compréhension.")
            return
        }
    }

    let buttonEnvoie = document.getElementById("button-envoyer")
    if (descriptionUser == "") {return alert("Veuillez remplir la zone de texte avant d'envoyer votre retour pour améliorer SPRINTIA.")}

    if (confirm("Êtes-vous sûr de vouloir envoyer votre retour pour améliorer SPRINTIA ?")) {
        // message au user
        buttonEnvoie.textContent = "Envoi..."
        buttonEnvoie.disabled = true

        // prépa des datas à envoyer
        const emailTemplates = { // c'est ce que j'ai choisi sur le site emailJS
            name:"Utilisateur SPRINTIA",
            email:"sprintia09@gmail.com",
            message:descriptionUser
        }

        try {
            // envoie (ma clé/la clé du template/les datas)
            await emailjs.send("service_km3fv8k", "template_sspnl2v", emailTemplates)

            // on note dans le local storage a quelle heure le user a envoyé le mail
            localStorage.setItem("emailJSLastSend", Date.now())
            
            setTimeout(() => {
                buttonEnvoie.textContent = "Envoyé"
                logoDynamique("✉️  Merci beaucoup !")
            }, 650);
            setTimeout(() => {
                buttonEnvoie.textContent = "Envoyer"
                buttonEnvoie.disabled = false 
            }, 1300);
        } catch(error) {
            alert("L'envoie a échoué, vérifie ta connexion à internet.")

            // si ya une erreur on réactive le bouton
            buttonEnvoie.textContent = "Envoyer"
            buttonEnvoie.disabled = false
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const buttonSend = document.getElementById("button-envoyer")
    if (buttonSend) {buttonSend.addEventListener("click", () => {sendEmail(document.getElementById('description-user').value.trim())})}

    // init
    emailjs.init({ // emailjs dispo depuis ce lien "https://dashboard.emailjs.com/admin"
        // la clé permet uniquement d'identifier mon projet depuis EmailJS donc personne peu me spam d'Email c'est pour ça qu'elle est écrit en clair
        publicKey: "E0XdvKtThlrBh8Lqt"
    })
})