async function sendEmail(descriptionUser) {
    let buttonEnvoie = document.getElementById("button-envoyer")
    if (descriptionUser == "") {return alert("Veuillez remplir la zone de texte avant d'envoyer votre retour pour améliorer SPRINTIA.")}

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

window.addEventListener("DOMContentLoaded", () => {
    // init
    emailjs.init({ // emailjs dispo depuis ce lien "https://dashboard.emailjs.com/admin"
        // la clé permet uniquement d'identifier mon projet depuis EmailJS donc personne peu me spam d'Email c'est pour ça qu'elle est écrit en clair
        publicKey: "E0XdvKtThlrBh8Lqt"
    })
})