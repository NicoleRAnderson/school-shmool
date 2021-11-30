function getAPIData(url) {
  try {
    return fetch(url).then((data) => data.json());
  } catch (error) {
    console.error(error);
  }
}

getAPIData(`https://pokeapi.co/api/v2/pokemon?limit=26`).then(async (data) => {
  for (const pokémon of data.results) {
    await getAPIData(pokémon.url).then((pokéData) =>
      populatePokéCards(pokéData)
    );
  }
});

const pokéGrid = document.querySelector(".pokéGrid");

function populatePokéCards(singlePokémon) {
  const pokéScene = document.createElement("div");
  pokéScene.className = "scene";
  const pokéCard = document.createElement("div");
  pokéCard.className = "card";
  pokéCard.addEventListener("click", () =>
    pokéCard.classList.toggle("is-flipped")
  );

  const front = populateCardFront(singlePokémon);
  const back = populateCardBack(singlePokémon);

  pokéCard.appendChild(front);
  pokéCard.appendChild(back);
  pokéScene.appendChild(pokéCard);
  pokéGrid.appendChild(pokéScene);
}

function populateCardFront(pokémon) {
  const pokéFront = document.createElement("figure");
  pokéFront.className = "cardFace front";
  const pokéImg = document.createElement("img");
  pokéImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokémon.id}.png`;

  const pokéCaption = document.createElement("figCaption");
  pokéCaption.textContent = pokémon.name;
  pokéFront.appendChild(pokéImg);
  pokéFront.appendChild(pokéCaption);
  return pokéFront;
}

function populateCardBack(pokémon) {
  const pokéBack = document.createElement("div");
  pokéBack.className = "cardFace back";
  const label = document.createElement("h4");
  label.textContent = "Abilities:";
  pokéBack.appendChild(label);
  const abilityList = document.createElement("ul");
  pokémon.abilities.forEach((abilityItem) => {
    let listItem = document.createElement("li");
    listItem.textContent = abilityItem.ability.name;
    abilityList.appendChild(listItem);
  });
  pokéBack.appendChild(abilityList);
  return pokéBack;
}
