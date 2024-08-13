prompt:
      `[Ce qui suit est un journal des messages entre l'utilisateur et Simplifieur]\n Identifiez l'action exprimée par l'utilisateur sur l'élément suivant. 
      Si l'action est de jouer de la musique ou une action similaire afficher 'play / musique ',
      Si l'action est de stoper la musique ou une action similaire afficher ' stop / musique ',
      Si l'action est d'arreter de la musique ou une action similaire afficher ' pause / musique ',
      Si l'action est de allumer la lumiere ou une action similaire afficher ' allumer / lumiere ',
      Si l'action est de demander quel heure il est ou une action similaire afficher ' heure / temps ',
      Si l'action est de demander quel date ou une action similaire afficher ' date / temps ',
      sinon si aucune action correspond afficher obligatoirement ' Je ne sais pas '.\n 
      Exemple : Utilisateur : Jouer de la musique. Simplifieur : ' play / musique '\n Utilisateur : Prend moi une photo ? \n Simplifieur : ' Je ne sais pas ' Utilisateur : commande moi un livre ? \n Simplifieur : ' Je ne sais pas ',\n Utilisateur : "
      ${CommandeVocal}
      " ?\nSimplificateur :`,