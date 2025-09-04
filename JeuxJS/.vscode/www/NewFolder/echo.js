console.log('echo.js charge');

// Adresse IP/nom d'hote du serveur = celui qui a servi la page
var ipServeur = location.hostname;
// Choix du sch�ma selon la page (si vous ouvrez en https, utilisez wss)
var wsScheme = (location.protocol === 'https:' ? 'wss://' : 'ws://');
var wsBase = wsScheme + ipServeur + ':80';
var wsUrl = wsBase + '/echo';
var ws; // Variable WebSocket

// -------------------- Lancement apr�s chargement de la page --------------------
window.onload = function () {
    // Delai court pour laisser le DOM finir de se stabiliser
    setTimeout(function () {
        if (TesterLaCompatibilite()) {
            ConnexionAuServeurWebsocket();
        }
        ControleIHM();
    }, 500);
};

// -------------------- V�rification compatibilit� --------------------
function TesterLaCompatibilite() {
    if (!('WebSocket' in window)) {
        console.log('WebSocket non supporte par le navigateur');
        return false;
    }
    return true;
}

// -------------------- Connexion au serveur WebSocket --------------------
function ConnexionAuServeurWebsocket() {
    try {
        console.log('Tentative de connexion a ' + wsUrl);
        ws = new WebSocket(wsUrl);

        ws.onopen = function () {
            console.log('WebSocket ouverte avec ' + wsBase);
            document.getElementById('Envoyer').disabled = false; // activer bouton
        };

        ws.onmessage = function (evt) {
            console.log('Message recu du serveur : ' + evt.data);
            document.getElementById('messageRecu').value = evt.data;
        };

        ws.onclose = function (event) {
            console.warn('WebSocket fermee - Code:', event.code, 'Raison:', event.reason);
            document.getElementById('Envoyer').disabled = true; // desactiver bouton
        };

        ws.onerror = function (error) {
            console.error('Erreur WebSocket : ', error);
            console.error('Verifiez que le serveur est demarre et accessible sur ' + wsBase);
        };

    } catch (err) {
        console.error('Impossible de creer WebSocket : ', err);
    }
}

// -------------------- Contr�le IHM --------------------
function ControleIHM() {
    // bouton d�sactiv� tant que WebSocket n'est pas pr�te
    document.getElementById('Envoyer').disabled = true;
    document.getElementById('Envoyer').onclick = BPEnvoyer;
}

// -------------------- Bouton Envoyer --------------------
function BPEnvoyer() {
    let message = document.getElementById('messageEnvoi').value;

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        console.log('Message envoye : ' + message);
    } else {
        console.warn('WebSocket pas encore prete (etat = ' + ws.readyState + ')');
    }
}
