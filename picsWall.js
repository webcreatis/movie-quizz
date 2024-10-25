// Fonction pour charger le JSON
fetch("/pics.json")
  .then((response) => response.json())
  .then((data) => {
    console.log("data---------------->", data);

    const imageGrid = document.getElementById("image-grid");

    // Création d'un container pour chaque image et on l'ajoute au DOM
    const imageBoxes = data.map((image, index) => {
      const imageBox = document.createElement("div");
      imageBox.classList.add(
        "overflow-hidden",
        "opacity-0",
        "min-[320px]:w-[100px]",
        "min-[320px]:h-[100px]",
        "min-[768px]:w-[120px]",
        "min-[768px]:h-[120px]",
        "tablet:w-[200px]",
        "tablet:h-[200px]",
        "min-[1440px]:w-[250px]",
        "min-[1440px]:h-[250px]",
        "desktopHD:w-[300px]",
        "desktopHD:h-[300px]"
      );

      // Ajout de l'image à la div
      imageBox.innerHTML = `
        <img src="${image.src}" alt="${image.alt}" class="w-full h-full object-cover transition-transform scale-100">
      `;

      // Ajout de l'image au container parent
      imageGrid.appendChild(imageBox);

      // Lance l'animation de chaque image avec un délai
      setTimeout(() => {
        imageBox.classList.remove("opacity-0");
        imageBox.classList.add("opacity-100");
      }, index * 50);

      return imageBox;
    });

    // Sélectionne une image aléatoire pour une animation infinie
    const startRandomInfiniteAnimation = () => {
      let lastAnimatedImage = null;

      setInterval(() => {
        // Si une image est déjà animée, on retire l'animation et on supprime le flou des autres ainsi que l'effet zoom
        if (lastAnimatedImage) {
          lastAnimatedImage.classList.remove("z-20");
          imageBoxes.forEach((imgBox) => {
            imgBox.classList.remove("blur-md");
            imgBox.classList.remove("scale-75");
          });
        }

        // Sélectionne une image aléatoire
        const randomIndex = Math.floor(Math.random() * imageBoxes.length);
        const randomImage = imageBoxes[randomIndex];

        // Ajout de l'animation à l'image sélectionnée
        randomImage.classList.add(
          "duration-100",
          "animate-opacity-fade",
          "scale-75"
        );

        // Ajout de l'effet de flou et zoom à toutes les autres images
        imageBoxes.forEach((imgBox, idx) => {
          if (idx !== randomIndex) {
            imgBox.classList.add("blur-md", "scale-100");
          }
        });

        // Sauvegarde l'image animée pour la retirer au prochain cycle
        lastAnimatedImage = randomImage;
      }, 1000);
    };

    // Lance l'animation infinie après que toutes les images sont affichées
    setTimeout(startRandomInfiniteAnimation, data.length * 10);
  })
  .catch((error) =>
    console.error("Erreur lors du chargement des images:", error)
  );
