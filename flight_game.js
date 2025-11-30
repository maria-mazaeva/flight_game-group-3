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

            let latitude = response.latitude_deg;
            let longitude = response.longitude_deg;

            show_map(latitude,longitude)

            return response;
        }

    } catch(error) {
        console.log(error);
    }
}

function show_map(lat,lon) {
    document.querySelector(".europeMap").remove();
    const picture_box = document.querySelector('.pictureBox');
    const map = L.map(picture_box).setView([lat, lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const airportMarkers = L.featureGroup().addTo(map);
    const marker = L.marker([lat,lon])
        .bindPopup('You are here.')
        .openPopup();


    // pan map to selected airport
    map.flyTo([lat,lon]);

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
    console.log(police_location);
     

    if (police_location === get_current_location(next_location)[0]) {
        return "loosing";
    } else {
        return "winning";
    }


}





async function main() {
    let amount_of_choises = 6;
    let airport_data = await get_airport_data();

    while (round_counter <= 5) {
        /*
        Codeblock to change the heading
        Should state which airport we are currently at
        Use info from variable airport_data
         */

        let run = await rounds(amount_of_choises);

        if (run === "winning") {
            round_counter++;
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
            pEl.addEventListener("click", main);

            //Appends the div to the body element
            bodyEl.appendChild(boxEl);
            break;
        }

        amount_of_choises--;
    }

    if (rounds_counter === 6) {
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
            pEl.addEventListener("click", main);

            //Appends the div to the body element
            bodyEl.appendChild(boxEl);
    }

}

