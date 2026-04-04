// première fois que je fais du back-end
// request c'est ce qui arrive du navigateur du user vers vercel
export default async function echange(request, response) { 
    const dico = {"code":request.query}

    if (!dico["code"]) { // si il n'y a pas le code alors on s'arrete
        return
    }

    try {
        // Envoie la demande à Strava
        const reponseStrava = await fetch("https://www.strava.com/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // on demande un JSON
            },
            body: JSON.stringify({
                client_id: process.env.STRAVA_CLIENT_ID,
                client_secret: process.env.STRAVA_CLIENT_SECRET,
                code: code,
                grant_type: "authorization_code" // On précise le type d'échange
            })
        })

        const data = await reponseStrava.json() // on attend la reponse de la requete puis on transforme en json

        // On renvoie ces données au frontend
        response.status(200).json(data)

    } catch {
        return
    }

}
