"use strict";

    // CREATING PAGE ELEMENTS::::

//creating " current round text"
let roundText = document.createElement("h1")
roundText.className = "roundText";
roundText.innerHTML = ""
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
// let europeMap = document.createElement("img");
// europeMap.className = "europeMap";
// europeMap.src = "EuropeMap.png";
// pictureBox.appendChild(europeMap);

// gamebox - making a list inside and text "your current  location is":
// Current position:
let currentLocationText = document.createElement("p")
currentLocationText.className = "currentLocationText";
currentLocationText.innerHTML = ``;
gameBox.appendChild(currentLocationText);

//list of buttons
let ul = document.createElement("ul");
gameBox.appendChild(ul);


///////// HERE COMES FUNCTIONS:::::


let previous_location = ["Finland"]
let route_records_player = ["EFHK", "EFHK"];  // dumm fix related to index and police lication for now
let round_counter = 1;

async function get_airport_data() {
    try {
        let request = await fetch("http://127.0.0.1:5000/all_airports");

        if (request.status === 200) {
            let response = await request.json();
            return response
        }
    } catch(error) {
        console.log(error);
    }
}



//Calculates the distance between to choose the nearest one for the police
async function run_airport_distance(locations_to_choose, route_records) {
    try {

        //Have to add parameters to fetch, and use POST to send objects to the backend
        let request = await fetch("http://127.0.0.1:5000/run_airport_distance", {
            method: "POST",    //the http request POST
            headers: {
                "Content-Type": "application/json"  //Sets the media-type (format) so that the backend can interpret the data
            },
            //Content of what we are sending
            //Have to change the objects to strings
            //Json.stringify can change any JS datatype to a string
            body: JSON.stringify({
                route_records: route_records,
                locations_to_choose: locations_to_choose
            })

        });

        if (request.status === 200) {
            let response = await request.json();
            return response;
        }
    } catch(error) {
        console.log(error);
    }
}

async function get_current_location(icao_code) {
    try {
        let request = await fetch("http://127.0.0.1:5000/get_current_location/" + icao_code);

        if (request.status === 200) {
            let response = await request.json();
            return response;
        }

    } catch(error) {
        console.log(error);
    }
}

function move_map_to_location(map, lat,lon) {


    map.flyTo([lat,lon]);

    L.marker([lat,lon]).addTo(map)
        .bindPopup('You are here.')
        .openPopup();

}

// Creating Buttons:
function createButtons(airportList){
    ul.innerHTML = "";
    return new Promise(resolve => {
    for (let i = 0; i<airportList.length; i++){
        //creating buttons :
        let li = document.createElement("li");
        ul.appendChild(li);
        let button = document.createElement("button");
        button.className = "buttonStyle";
        button.innerHTML = `${i+1}. ${airportList[i].name}.`;
        li.appendChild(button);

        //clicking button:
        button.addEventListener("click", () => {
            //let choice = [airportList[i].latitude_deg, airportList[i].longitude_deg];
            let choice = airportList[i].ident
            console.log(choice);
            route_records_player.push(choice);
            previous_location.push(airportList[i].name);
            console.log(previous_location);
            console.log(`Gamers -  ${airportList[i].latitude_deg}, ${airportList[i].longitude_deg}`)
            resolve(choice);
            });}})}

async function rounds(map, amount_of_choises) {
    //Fetch data from backend
    let data = await get_airport_data();
    let locations_to_choose =  [];

    //List to track used indexes
    let used_indexes = [];

    while (used_indexes.length < amount_of_choises) {
        let index = Math.floor(Math.random() * data.length);

        if (used_indexes.includes(index) === false) {  //Syntax for checking if element is inside a list
            let data_locations = data[index];
            locations_to_choose.push(data_locations);
            used_indexes.push(index);
        }
    }
    
    console.log(locations_to_choose);
    let cteateButtonsVariable = await createButtons(locations_to_choose);


    //starting process of finding police and players location:
    let police_location = await run_airport_distance(locations_to_choose, route_records_player);

    let current_location = await get_current_location(route_records_player.at(-1));
    let curr_lat = current_location.latitude_deg;
    let curr_lon = current_location.longitude_deg;

    move_map_to_location(map, curr_lat,curr_lon);


    console.log(`police - ${police_location}`);
    console.log(`all clicked rounds -  ${route_records_player}`);
    console.log(`current location - ${route_records_player.at(-1)}`);
    //comparing of police and theif in the same place:

    if ((police_location[0] === current_location.latitude_deg) && (police_location[1] === current_location.longitude_deg) ) {
        console.log("lost")
        return "losing";
    } else {
        console.log("win")
        return "winning";
    }}


async function main() {

    //adding map with predefined location - Helsinki
    const picture_box = document.querySelector('.pictureBox');
    const map = L.map(picture_box).setView([60.1699, 24.9384], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    let popup = L.popup()
    .setLatLng([60.1699, 24.9384])
    .setContent("You start the game in Helsinki.")
    .openOn(map);

    round_counter = 1;
    let amount_of_choises = 6;

    while (round_counter <= 5) {
        roundText.innerHTML = `Round ${round_counter}`;
        currentLocationText.innerHTML = `Your current location is ${previous_location.at(-1)}`;

        let run = await rounds(map, amount_of_choises);

        if (run === "winning") {
            round_counter++;
            amount_of_choises--;
        }

        
        if (run === "losing") {
            //Removing elements
            document.querySelector(".roundText").remove();
            document.querySelector(".mainBox").remove();

            //Fetching the body element
            let bodyEl = document.querySelector("body");

            //Creates a div box for elements
            let boxEl = document.createElement("div");
            boxEl.classList.add("box");

            //Creates a header inside div
            let h1El = document.createElement("h1");
            h1El.innerText = "YOU LOST";
            boxEl.appendChild(h1El);

            //Creates image element inside div
            let imgEl = document.createElement("img");
            imgEl.src = "cartoon-prisoner-behind-bars-10416629 (1).webp";
            boxEl.appendChild(imgEl);

            //Creates button to restart game inside div
            let pEl = document.createElement("p");
            pEl.innerText = "Play again";
            boxEl.appendChild(pEl);
            pEl.addEventListener("click", refresh);

            //Appends the div to the body element
            bodyEl.appendChild(boxEl);
            break;
        }
    }

    if (round_counter === 6) {
        //Removing elements
            document.querySelector(".roundText").remove();
            document.querySelector(".mainBox").remove();

            //Fetching the body element
            let bodyEl = document.querySelector("body");

            //Creates a div box for elements
            let boxEl = document.createElement("div");
            boxEl.classList.add("box");

            //Creates a header inside div
            let h1El = document.createElement("h1");
            h1El.innerText = "YOU WON";
            boxEl.appendChild(h1El);

            //Creates image element inside div
            let imgEl = document.createElement("img");
            imgEl.src = "cartoon-thief-running-sack-money-cheerful-cartoon-thief-depicted-running-large-sack-money-slung-over-his-393251250.webp";
            boxEl.appendChild(imgEl);

            //Creates button to restart game inside div
            let pEl = document.createElement("p");
            pEl.innerText = "Play again";
            boxEl.appendChild(pEl);
            pEl.addEventListener("click", refresh);

            //Appends the div to the body element
            bodyEl.appendChild(boxEl);
    }

}


function refresh() {
    location.reload();
}


main()