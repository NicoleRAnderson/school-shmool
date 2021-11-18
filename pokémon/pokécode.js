async function getAPIData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

getAPIData(`https://pokeapi.co/api/v2/pokemon/jigglypuff`).then((data) => {
  console.log(data);
  populatePokéCards(data);
});

const pokéGrid = document.querySelector(".pokéGrid");

function populatePokéCards(singlePokémon) {
  const pokéScene = document.createElement("div");
  pokéScene.className = "scene";
  const pokéCard = document.createElement("div");
  pokéCard.className = "card";
  const pokéFront = document.createElement("div");
  pokéFront.className = "cardFace front";
  pokéFront.textContent = "front";
  const pokéBack = document.createElement("div");
  pokéBack.className = "cardFace back";
  pokéBack.textContent = singlePokémon.name;

  pokéCard.appendChild(pokéFront);
  pokéCard.appendChild(pokéBack);
  pokéScene.appendChild(pokéCard);
  pokéGrid.appendChild(pokéScene);
}
