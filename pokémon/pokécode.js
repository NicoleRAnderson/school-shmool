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
  loadPokémon(0, 50);
  setTimeout(() => loadPokémon(100, 50), 3000);
});

const allPokémon = await getAllSimplePokémon();

async function getAllSimplePokémon() {
  const allPokémon = []
  await getAPIData(`https://pokeapi.co/api/v2/pokemon?limit=1118&offset=0`,).then(async (data) => {
    for (const pokémon of data.results) {
      await getAPIData(pokémon.url).then((pokéData) => {
        const mappedPokémon = {
          abilities: pokéData.abilities,
          height: pokéData.height,
          id: pokéData.id,
          name: pokéData.name,
          types: pokéData.types,
          weight: pokéData.weight,
        }
        allPokémon.push(mappedPokémon)
      })
    }
  })
  return allPokémon
}

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
  let newPokéTypes = prompt(
    "What are your Pokémon's types? (enter up to 2 types seperated by a space)"
  );
  let newPokémon = new Pokémon(
    pokéName,
    pokéHeight,
    pokéWeight,
    getAbilitiesArray(pokéAbilities),
    getTypesArray(newPokéTypes)
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

function getTypesArray(spacedString) {
  let tempArray = spacedString.split(" ");
  return tempArray.map((typeName) => {
    return {
      type: {
        name: typeName,
      },
    };
  });
}

class Pokémon {
  constructor(name, height, weight, abilities, types) {
    (this.id = 9001),
      (this.name = name),
      (this.height = height),
      (this.weight = weight),
      (this.abilities = abilities),
      (this.types = types);
  }
}

function getAllPokémonByType(type) {
  return allPokémon.filter((pokémon) => pokémon.types[0].type.name === type);
}

//const sortButton = document.querySelector(".sortButton")
//sortButton.addEventListener("click", () => {
//const allByType = getAllPokémonByType("water")
//allByType.forEach((item) => populatePokéCard(item))
//})

const typeSelector = document.querySelector("#typeSelector");
typeSelector.addEventListener("change", (event) => {
  const usersTypeChoice = event.target.value.toLowerCase();
  const allByType = getAllPokémonByType(usersTypeChoice);
  removeChildren(pokéGrid);
  allByType.forEach((item) => populatePokéCard(item));
});

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
  if (pokémon.id === 9001) {
    pokéImg.src = "../images/newpokeball.png";
  } else {
    pokéImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokémon.id}.png`;
  }

  const pokéCaption = document.createElement("figCaption");
  pokéCaption.textContent = pokémon.name;

  pokéCaption.textContent = `${pokémon.name[0].toUpperCase()}${pokémon.name.slice(
    1
  )}`;
  pokéFront.appendChild(pokéImg);
  pokéFront.appendChild(pokéCaption);

  typesBackground(pokémon, pokéFront);
  return pokéFront;
}

function typesBackground(pokémon, card) {
  let pokéType1 = pokémon.types[0].type.name;
  let pokéType2 = pokémon.types[1]?.type.name;
  if (!pokéType2) {
    card.style.setProperty("background", getPokéTypeColor(pokéType1));
  } else {
    card.style.setProperty(
      "background",
      `linear-gradient(${getPokéTypeColor(pokéType1)}, ${getPokéTypeColor(
        pokéType2
      )})`
    );
  }
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
      color = "#006400";
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
      color = "#734f96";
      break;
    case "ground":
      color = "#964B00";
      break;
    case "fairy":
      color = "#FA83E9";
      break;
    case "fighting":
      color = "#BD763C";
      break;
    case "steel":
      color = "#A8BAB7";
      break;
    default:
      color = "#888888";
  }
  return color;
}

function populateCardBack(pokémon) {
  const pokéBack = document.createElement("div");
  pokéBack.className = "cardFace back";
  const label = document.createElement("h4");
  label.textContent = "Abilities & Types:";
  pokéBack.appendChild(label);
  const abilityList = document.createElement("ul");
  pokémon.abilities.forEach((abilityItem) => {
    let listItem = document.createElement("li");
    listItem.textContent = abilityItem.ability.name;
    abilityList.appendChild(listItem);
  });
  //const secondLabel = document.createElement("h4");
  //secondLabel.textContent = "Types:";
  // pokéBack.appendChild(secondLabel);
  const typesList = document.createElement("ol");
  pokémon.types.forEach((pokéType) => {
    let typeItem = document.createElement("li");
    typeItem.textContent = pokéType.type.name;
    typesList.appendChild(typeItem);
  });

  const pokéHeight = document.createElement("h5");
  pokéHeight.textContent = `Height: ${pokémon.height}`;
  const pokéWeight = document.createElement("h5");
  pokéWeight.textContent = `Weight: ${pokémon.weight}`;

  pokéBack.appendChild(abilityList);
  pokéBack.appendChild(typesList);
  pokéBack.appendChild(pokéHeight);
  pokéBack.appendChild(pokéWeight);
  return pokéBack;
}
