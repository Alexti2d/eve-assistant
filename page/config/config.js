$("label").click(function () {
  setTimeout(() => {
    var Couleur = document.querySelector('input[name="options"]:checked').value;
    console.log(Couleur);
    Couleur = "Couleur " + Couleur;
    configConnection.send(Couleur);
  }, 50);
});

function NouvelleCommande(Commande) {
  console.log("Commande ecrite : " + Commande);
  configConnection.send(Commande);
}

function Couleur(Couleur) {
  $("#Bouche").css({
    fill: Couleur,
  });
  $("#OeilDroit").css({
    fill: Couleur,
  });
  $("#OeilGauche").css({
    fill: Couleur,
  });
}
