function animationEnAttente() {
  // Clin d'oeil
  if (anime.random(0, 8) == 1) {
    anime({
      targets: "#eve rect",
      width: [{ value: 36 }, { value: 43 }],
      height: [{ value: 58 }, { value: 6 }],
      rx: [{ value: 18 }, { value: 3 }],
      translateY: [{ value: 0 }, { value: 30 }],
      duration: 500,
      direction: "alternate",
      complete: Etat,
    });
  } else {
    anime({
      targets: "#eve",
      translateY: function () {
        return anime.random(-20, 5);
      },
      translateX: function () {
        return anime.random(-10, 10);
      },
      rotate: function () {
        return anime.random(-10, 10);
      },
      easing: "spring(50, 80, 100, 2)",
      complete: Etat,
    });
  }
}

function animationEcoute() {
  anime({
    targets: "rect",
    height: 90,
    translateY: -40,
    rx: 18,
    direction: "linear",
  });
  anime({
    targets: "#eve",
    rotate: [{ value: -10 }, { value: 10 }],
    duration: 5000,
    delay: 5000,
    direction: "linear",
    complete: Etat,
  });
}

function animationRecherche() {
  taille = anime.random(10, 85);
  anime({
    targets: "#OeilDroit",
    height: taille,
    translateY: -taille / 2,
    rx: taille / 5,
    duration: 1000,
    direction: "linear",
  });
  taille = anime.random(10, 85);
  anime({
    targets: "#OeilGauche",
    height: taille,
    translateY: -taille / 2,
    rx: taille / 5,
    duration: 1000,
    direction: "linear",
    complete: Etat,
  });
}
