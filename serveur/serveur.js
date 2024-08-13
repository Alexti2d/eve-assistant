import WebSocket from "ws";
// const Description = require("./extension/recherche/description.cjs");
import Ollama from "ollama";

const wss = new WebSocket.Server({ port: 3333 });

let CommandeVocal = "quel est la recette du baba au";

var messageToClient = {
  categorieCommande: "Parler",
  commande: "",
  donne: "Salut",
};

wss.on("error", console.error);

// Connection au client
wss.on("connection", (ws) => {
  console.log("\x1b[92m connectee 👾 \x1b[0m\n");

  //Detection d'un message du client
  ws.onmessage = function (msg) {
    console.log("\n\x1b[36m client : \x1b[0m" + msg.data);
    messageToClient.donne = JSON.parse(msg.data).donne;
    sendClient(messageToClient);
  };

  async function MessageRecus(CommandeVocal) {
    // Creation du prompt qui va etre envoyé au LLM
    let promptLLM = `[Ce qui suit est un journal des messages entre utilisateur et Simplifieur]\n Identifiez l'action exprimée par l'utilisateur sur l'élément suivant. 
    Si l'action est de jouer de la musique ou une action similaire afficher 'play / musique ',
    Si l'action est de stoper la musique ou une action similaire afficher ' stop / musique ',
    Si l'action est d'arreter de la musique ou une action similaire afficher ' pause / musique ',
    Si l'action est de allumer la lumiere ou une action similaire afficher ' allumer / lumiere ',
    Si l'action est de demander quel heure il est ou une action similaire afficher ' heure / temps ',
    Si l'action est de demander quel date ou une action similaire afficher ' date / temps ',
    sinon si l'utilisateur pose une question ou une action similaire afficher ' recherche / recherche ',
    sinon si l'utilisateur commence ca phrase avec "que", "quel", "qui" action similaire afficher ' recherche / recherche ',
    sinon si l'utilisateur a une interogation ou une action similaire afficher ' recherche / recherche ',
    sinon si l'utilisateur veut rechercher une information ou une action similaire afficher ' recherche / recherche ',
    sinon si l'utilisateur veut rechercher une recette de cuisine ou une action similaire afficher ' recette / recette ',
    sinon si aucune action correspond afficher obligatoirement ' Je ne sais pas '.\n 
    Exemple : Utilisateur : Joue de la musique. \n Simplifieur : ' play / musique '\n Utilisateur : Quel est la capital de france ? \n Simplifieur : ' recherche / recherche '\n Utilisateur : Qui est l'homme le plus riche ? \n Simplifieur : ' recherche / recherche '\n Utilisateur : Quel est la superficie de la france ? \n Simplifieur : ' recherche / recherche '\n Utilisateur : Prend moi une photo ? \n Simplifieur : ' Je ne sais pas '\n Utilisateur : commande moi un livre ?\n Simplifieur : ' Je ne sais pas ',\n Utilisateur :${CommandeVocal}" ?\nSimplifieur :`;

    var action = await PostLLM(promptLLM, 15);

    // Partie a ameliorer
    action = action.substring(3, action.length - 3);
    var typeAction = action.split(" / ")[0];
    var categorieAction = action.split(" / ")[1];

    //Si le LLM a detecté une action
    if (action.indexOf("/") != -1) {
      let reponseDuLLM = "";

      switch (categorieAction) {
        case "musique":
          // A voir si la musique est géré via le back
          break;

        case "lumiere":
          // Appel Api pour allumer la lumiere
          reponseDuLLM = "la lumiere s'allume";
          break;

        case "recherche":
          promptLLM = `
        [Ce qui suit est un journal des messages entre eleve et un Professeur]\n Le Professeur va devoir repondre au question de l'eleve de facon claire est simplifie. 
        si jamais le Professeur n'a pas la reponse il doit obligatoirement dire qu'il ne sait pas.\n 
        Exemple : Eleve : Quel est la capital de France. \n Professeur : Paris est la capitale de la France. Divisee en vingt arrondissements, elle est le chef-lieu de la region Ile-de-France et le siege de la metropole du Grand Paris.\n Eleve : "
        ${CommandeVocal}
        " ?\nProfesseur :
        `;
          sendClient("Je recherche ca je reviens vers vous prochainement");
          reponseDuLLM = await PostLLM(promptLLM, 75);
          break;

        case "recette":
          promptLLM = `
        [Ce qui suit est un journal des messages entre eleve et un Cuisinier]\n Le Cuisinier va devoir repondre au question de l'eleve de facon claire est simplifie en detaillant les differentes etapes.\n
        Exemple : Eleve : Quel est la recette du diabolo grenadine pour une personne. \n Cuisinier : Les ingrédient du diabolo grenadine pour une personne sont une cuillere de grenadine et un verre d'eau. En premier verser la cuillere de grenadine dans le verre, ensuite remplissez le verre d'eau\n Eleve : "
        ${CommandeVocal}
        " ?\nCuisinier :`;
          sendClient("Je recherche cette recette je reviens vers vous prochainement");
          reponseDuLLM = await PostLLM(promptLLM, 200);
          break;

        case "temps":
          let DateActuel = new Date();
          switch (typeAction) {
            case "heure":
              console.log(
                "il est " +
                  DateActuel.getHours() +
                  " heure " +
                  DateActuel.getMinutes()
              );
              reponseDuLLM =
                "il est " +
                DateActuel.getHours() +
                " heure " +
                DateActuel.getMinutes();
              break;
            case "date":
              console.log("il est " + DateActuel.toDateString());
              reponseDuLLM = "il est " + DateActuel.toDateString();
              break;
            default:
              console.error("Type d'action inconnue");
          }
          break;

        default:
          console.error("Categorie d'action inconnue");
      }

      return reponseDuLLM;
    }

    // Fonction pour interroger le LLM
    async function PostLLM(prompt, length) {
      console.log(" le LLM process");

      const response = await Ollama.generate({
        model: "Mistral",
        stream: false,
        prompt: prompt,
        options: {
          num_predict: length,
          temperature: 0,
          top_p: 0,
          presence_penalty: 0,
          stop: ["Utilisateur :", "Eleve :"],
        },
      });

      console.log("\x1b[90m reponse LLM :\x1b[0m", response.response);

      return response.response;
    }
  }

  test();

  async function test() {
    let reponseDuLLM = await MessageRecus(CommandeVocal);
    sendClient(reponseDuLLM);
  }

  // Envoie au client des données
  function sendClient(messageToClient) {
    ws.send(JSON.stringify(messageToClient));
    console.log(
      "\n\x1b[90m message envoyée : \x1b[0m" +
        JSON.stringify(messageToClient) +
        "\n"
    );
  }
});
