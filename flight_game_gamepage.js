"use strict";
// GENERAL THINGS:
// EACH ELEMENT HAS CLASS TO MANIPULATE IT OR STYLE IT. ALL NAMES ARE IN "camel Style"


//creating " current round text"
let roundText = document.createElement("h1")
roundText.className = "roundText";
roundText.innerHTML = "Round 1,2,3..(variable round)"
document.body.appendChild(roundText);

//creating main structure - space with 2 poxes:
// with choises (gameBox) and the right with map pic (pictureBox):
let mainBox = document.createElement("div");
mainBox.className = "mainBox";
document.body.appendChild(mainBox);

//making game box:
let gameBox = document.createElement("div");
gameBox.className = "gameBox";
mainBox.appendChild(gameBox);

//making picture box:
let pictureBox = document.createElement("div");
pictureBox.className = "pictureBox";
mainBox.appendChild(pictureBox);

// adding map:
let europeMap = document.createElement("img");
europeMap.className = "europeMap";
europeMap.src = "EuropeMap.png";
pictureBox.appendChild(europeMap);

// gamebox - making a list inside and text "your current  location is":
// Current position: 
let currentLocationText = document.createElement("p")
currentLocationText.className = "currentLocationText";
currentLocationText.innerHTML = `Your current  location is: VARIABLE NAME.`;
gameBox.appendChild(currentLocationText);

//list of buttons
let ul = document.createElement("ul");
gameBox.appendChild(ul);

/////////// I need to fetch data of airports here !!!!!!!!!!!!!!!!!!!!!
//let listOfAirports = ["Finland", "Italy", "Spain", "Norway", "Vatican", "Germany"] //example list

//creating function "createButtons(airportList)"" to make buttons based on airport list:
// function createButtons(airportList){  //ADD IN ARGUMENT LIST OF AIRPORTS - it will make buttons based on it.

//     for (let i = 1; i<=airportList.length; i++){
//         //creating buttons :
//         let li = document.createElement("li");
//         ul.appendChild(li);
//         let button = document.createElement("button");
//         button.className = "buttonStyle";
//         button.innerHTML = `Here is the choice ${i} - ${airportList[i-1]}.`;
//         li.appendChild(button);
    
//         //what happens if cliked: reurns the value to check if it is correct???
//         button.addEventListener("click", () =>{
//             console.log("You clicked:", airportList[i-1]);});
//             //1 - RETURNS ANSWER TO CHECK IF CORRECT OR NOT - IF WRONG  - ALERT  OF LOOSING, GAME OVER
//             //if correct - same round loop repeats the process of creating buttons based on airport list
//     }
// }