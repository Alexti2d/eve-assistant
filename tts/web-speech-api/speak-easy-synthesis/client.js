
var phrase;

// Connection au WebSocket
const connection = new WebSocket("ws://localhost:3333");

connection.onopen = () => {
  console.log("connected");
};

connection.onclose = () => {
  console.error("Je suis déconnecté");
  // Parler("Je suis déconnecté");
};

connection.onerror = (error) => {
  console.error("Une erreur c'est produite failed to connect", error);
  // Parler("Une erreur c'est produite");
};


// Detection message recut
connection.onmessage = (event) => {
  var message = JSON.parse(event.data)
  console.log(message);
  Parler(message)
};

// Fonction qui permet à Eve de dicter une phrase
function Parler(message) {
    speak(message)
}

// Detection et changement de l'animation de Eve
function Etat(etat) {
  console.log("etat : ", etat);

  switch (etat) {
    case "enAttente":
      animationEnAttente();
      break;

    case "ecoute":
      animationEcoute();
      break;

    case "recherche":
      animationRecherche();
      break;

    default:
      console.log("Animation idle");
  }
}

// Function pour envoyer des infos au serv
function sendServ(messageToServer) {
  connection.send(JSON.stringify(messageToServer));
}