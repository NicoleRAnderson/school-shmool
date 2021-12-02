import { removeChildren } from "../utils/index.js";

function getAPIData(url) {
  try {
    return fetch(url).then((data) => data.json());
  } catch (error) {
    console.error(error);
  }
}

function loadPokémon(offset = 0, limit = 26) {
  getAPIData(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  ).then(async (data) => {
    for (const pokémon of data.results) {
      await getAPIData(pokémon.url).then((pokéData) =>
        populatePokéCard(pokéData)
      );
    }
  });
}

const pokéGrid = document.querySelector(".pokéGrid");
const loadButton = document.querySelector(".loadPokémon");
loadButton.addEventListener("click", () => {
  removeChildren(pokéGrid);
  loadPokémon(300, 50);
});

const moreButton = document.querySelector(".morePokémon");
moreButton.addEventListener("click", () => {
  let limit = prompt("How many more Pokémon should I load?");
  let offset = prompt("At which Pokémon ID should I start loading?");
  loadPokémon(offset, limit);
});

const newButton = document.querySelector(".newPokémon");
newButton.addEventListener("click", () => {
  let pokéName = prompt("What is the name of your new Pokémon?");
  let pokéHeight = prompt("What is the Pokémon's height?");
  let pokéWeight = prompt("What is the Pokémon's weight?");
  let pokéAbilities = prompt(
    "What are your Pokémon abilities? (use a comma seperated list)"
  );
  let newPokémon = new Pokémon(
    pokéName,
    pokéHeight,
    pokéWeight,
    getAbilitiesArray(pokéAbilities)
  );
  populatePokéCard(newPokémon);
});

function getAbilitiesArray(commaString) {
  let tempArray = commaString.split(",");
  return tempArray.map((abilityName) => {
    return {
      ability: {
        name: abilityName,
      },
    };
  });
}

class Pokémon {
  constructor(name, height, weight, abilities) {
    (this.id = 100),
      (this.name = name),
      (this.height = height),
      (this.weight = weight),
      (this.abilities = abilities);
  }
}

function populatePokéCard(singlePokémon) {
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

  typesBackground(pokémon, pokéFront);
  return pokéFront;
}

function typesBackground(pokémon, card) {
  let pokéType1 = pokémon.types[0].type.name;
  let pokéType2 = pokémon.types[1]?.type.name;
  card.style.setProperty(
    "background",
    `linear-gradient(${getPokéTypeColor(pokéType1)}, ${getPokéTypeColor(
      pokéType2
    )})`
  );
}

function getPokéTypeColor(pokéType) {
  let color;
  switch (pokéType) {
    case "grass":
      color = "#00ff00";
      break;
    case "fire":
      color = "#ff0000";
      break;
    case "water":
      color = "#0000ff";
      break;
    case "bug":
      color = "#7fff00";
      break;
    case "normal":
      color = "#f5f5dc";
      break;
    case "flying":
      color = "#00ffff";
      break;
    case "poison":
      color = "#c300ff";
      break;
    case "electric":
      color = "#c8ff00";
      break;
    case "psychic":
      color = "#333333";
      break;
    default:
      color = "#888888";
  }
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
