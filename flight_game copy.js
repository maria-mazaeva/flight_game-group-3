"use strict";

let previous_location = ["Finland"]
let route_records_player = ["EFHK", "EFHK"];  // dumm fix related to index and police lication 
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


///copypasted button creation:
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
            route_records_player.push(choice);
            previous_location.push(airportList[i].name);
            console.log(`Gamers -  ${airportList[i].latitude_deg}, ${airportList[i].longitude_deg}`)
            resolve(choice);
            });}})}

async function rounds(amount_of_choises) {
    //Fetch data from backend
    currentLocationText.innerHTML = `Your current location is ${previous_location.at(-1)}`
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

    console.log(`police - ${police_location}`);
    console.log(`all clicked rounds -  ${route_records_player}`);
    console.log(`current location - ${route_records_player.at(-1)}`);
    //comparing of police and theif in the same place:

    if (police_location === current_location) {
        console.log("lost")
        return "losing";
    } else {
        console.log("win")
        return "winning";
    }}
async function main() {
    let amount_of_choises = 6;
    let airport_data = await get_airport_data();

    while (round_counter <= 5) {
        roundText.innerHTML = `Round ${round_counter}`;      

        let run = await rounds(amount_of_choises);

        if (run === "winning") {
            round_counter++;
            amount_of_choises--;
        }
        if (run === "losing") {
            alert("You have lost!");
            break;
        }
    }
    if (round_counter === 6) {
        alert("You have won!");
    }
}
main();