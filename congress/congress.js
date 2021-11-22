import { senators } from "../data/senators.js";
import { representatives } from "../data/representatives.js";
import { removeChildren } from "../utils/index.js";

const members = [...senators, ...representatives]; // modern combining arrays like a genus ;)

const senatorDiv = document.querySelector(".senators");
const seniorityHeading = document.querySelector(".seniority");
const weaselOrderedList = document.querySelector(".weaselList");

function simplifiedMembers(chamberFilter) {
  const filteredArray = members.filter((member) =>
    chamberFilter ? member.short_title === chamberFilter : member
  );

  return filteredArray.map((item) => {
    const middleName = item.middle_name ? ` ${item.middle_name} ` : ` `;
    return {
      id: item.id,
      name: `${item.first_name}${middleName}${item.last_name}`,
      party: item.party,
      imgURL: `https://www.govtrack.us/static/legislator-photos/${item.govtrack_id}-100px.jpeg`,
      gender: item.gender,
      seniority: +item.seniority,
      missedVotesPct: item.missed_votes_pct,
      loyaltyPct: item.votes_with_party_pct,
    };
  });
}

populateSenatorDiv(simplifiedMembers());

function populateSenatorDiv(simpleSenators) {
  removeChildren(senatorDiv);
  simpleSenators.forEach((item) => {
    let itemFigure = document.createElement("figure");
    let figImg = document.createElement("img");
    let figCaption = document.createElement("figcaption");

    if (item.party === "R") itemFigure.style.borderColor = "Red";
    if (item.party === "D") itemFigure.style.borderColor = "Blue";

    figImg.src = item.imgURL;

    figCaption.textContent = item.name;
    itemFigure.appendChild(figImg);
    itemFigure.appendChild(figCaption);
    senatorDiv.appendChild(itemFigure);
  });
}

//const filterSenators = (prop, value) =>
//simplifiedMembers(item).filter((item) => item[prop] === value);

//const republicans = filterSenators("party", "R");
//const femaleSenators = filterSenators("gender", "F");



const genderSortFemaleButton = document.querySelector(".genderSort");
genderSortFemaleButton.addEventListener("click", () => {
  const femaleMembers = simplifiedMembers().filter(
    (member) => member.gender === "F"
  );
  populateSenatorDiv(femaleMembers);
});

const mostSeniorMember = simplifiedMembers().reduce((acc, item) => {
  return acc.seniority > item.seniority ? acc : item;
});

seniorityHeading.textContent = `The most senior member of Congress is ${mostSeniorMember.name} who has taken our tax dollars as salary for more than ${mostSeniorMember.seniority} years!`;

const mostLoyal = simplifiedMembers().reduce((acc, item) => {
  if (item.loyaltyPct === 100) {
    acc.push(item);
  }
  return acc;
}, []);

const biggestWeasel = simplifiedMembers().reduce(
  (acc, item) => ((acc.missedVotesPct || 0) > item.missedVotesPct ? acc : item),
  {}
);

const biggestWeasels = simplifiedMembers().filter(
  (item) => item.missedVotesPct >= 50
);

biggestWeasels.forEach((weasel) => {
  let listItem = document.createElement("li");
  listItem.textContent = weasel.name;
  weaselOrderedList.appendChild(listItem);
});
