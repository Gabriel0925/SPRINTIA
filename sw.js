// script que le navigateur fais tourner en arrière plan, séparement de ma page web

// self désigne le service worker
self.addEventListener("fetch", () => {})

// pr forcer la maj du sw
self.addEventListener("install", (event) => {
    self.skipWaiting()
})

// le nouveau sw prend le controle
self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim()) // pr rafraichir le manifest et le sw
}) 

// version du fichier manifest : V5.2
