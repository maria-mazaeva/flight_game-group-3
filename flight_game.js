"use strict";


let route_records_player = ["EFHK"];
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
        let request = await fetch("url");

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


async function rounds(amount_of_choises) {
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


    let police_location = await run_airport_distance(locations_to_choose, route_records_player);


    let next_location = createButtons(locations_to_choose);
     

    if (police_location === get_current_location(next_location)[0]) {
        return "loosing";
    } else {
        return "winning";
    }


}





async function main() {
    let amount_of_choises = 6;
    let airport_data = await get_airport_data()

    while (round_counter <= 5) {
        /*
        Codeblock to change the heading
        Should state which airport we are currently at
        Use info from variable get_airport_data
         */

        let run = await rounds(amount_of_choises);

        if (run === "winning") {
            round_counter++;
        }

        if (run === "losing") {
            alert("You have lost!");
            break;
        }

        amount_of_choises--;
    }

    if (rounds_counter === 6) {
        alert("You have won!");
    }
}

