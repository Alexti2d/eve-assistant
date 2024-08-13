var etat = "enAttente";
var phrase;
var anciennePhrase;
var messageToServer = {
  categorieCommande: "Parler",
  commande: "",
  donne: ""
}

Bouche("‿");
Etat(etat);

if (!responsiveVoice.voiceSupport()) {
  alert("le navigateur ne prend pas en charge le TTS");
}

responsiveVoice.enableWindowClickHook();

// Connection au WebSocket
const connection = new WebSocket("ws://localhost:3333");

connection.onopen = () => {
  console.log("connected");
};

connection.onclose = () => {
  console.error("Je suis déconnecté");
  Parler("Je suis déconnecté");
};

connection.onerror = (error) => {
  console.error("Une erreur c'est produite failed to connect", error);
  Parler("Une erreur c'est produite");
};

// Trigger quand la voix est active
function VoiceStartCallback() {
  Bouche("~");
}

// Trigger quand Eve a fini de parler
function VoiceEndCallback() {
  Bouche("‿");
  if (etat != "ecoute") {
    // reset du visage
    etat = "enAttente";
    animationEnAttente();
  }
}


// Detection message recut
connection.onmessage = (event) => {
  var message = JSON.parse(event.data)
  console.log(message);

  switch (message.categorieCommande) {
    case "Couleur":
      Couleur(message.donne);
      break;

    case "Stop":
      try {
        responsiveVoice.cancel();
        VoiceEndCallback();
      } catch {}
      break;

    case "Parler":
      Parler(message.donne);
      break;

    default:
      $("#eve").css("display", "none");
      break;
  }
};

// Fonction qui permet à Eve de dicter une phrase
function Parler(phrase) {
  var parameters = {
    onstart: VoiceStartCallback,
    onend: VoiceEndCallback,
    rate: 1,
    pitch: 1,
  };

  if (phrase !== anciennePhrase) {
    if (phrase == "Je vous écoute" || phrase == "Bonjour Alexandre") {
      parameters.pitch = 1.2;
      parameters.rate = 1.1;
    } else {
      parameters.pitch = 0.9;
      parameters.rate = 1.05;
    }
    responsiveVoice.speak(phrase, "French Female", parameters);
    phrase = anciennePhrase;
  }
}

// Affichage de la forme de la bouche de Eve
function Bouche(forme) {
  $("#Bouche").text(forme);
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