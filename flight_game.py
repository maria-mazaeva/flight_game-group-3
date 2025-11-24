import mysql.connector
import random
from geopy.distance import geodesic

connection = mysql.connector.connect(
    host="127.0.0.1",
    port=3306,
    database="flight_game",
    user="root",
    password="password",
    autocommit=True
)

# Empty lists to store the routes of the player and the police
# Could be printed as a part of the summary at the end (wether you win or lose)
route_records_player = ["EFHK"]  # Player always starts at Helinki Airport, Finland
route_records_police = []
rounds_counter = 1


# Function to start the game
# Gives the player information about how the game works
def start_game():
    print('WELCOME to the "Police escape" game!')
    print("You just robbed the Bank of Finland, and the police are after you!!!")
    print("There are 5 rounds in the game.\nTo win: visit 5 airports, each turn pick the FARTHEST airport.\nPolice always move to the CLOSEST.\nIf they reach you, you lose.")


# Returns a list of 50 airports, one airport per European country, the country they are in, and there ICAO-code
# Also the coordinates of the airport

def get_airport_data():
    sql = """select airport.name, country.name, airport.ident, airport.latitude_deg, airport.longitude_deg
             from airport, \
                  country
             where airport.iso_country = country.iso_country
               and country.continent = 'EU'
             group by country.name; \
          """

    cursor = connection.cursor()
    cursor.execute(sql)
    data = cursor.fetchall()
    airport_data = []
    for i in data:
        airport_data.append(i)
    return airport_data


# Gets the coordinates of the players current location
def get_current_location(icao_code):
    sql = f"select latitude_deg, longitude_deg from airport where ident = '{icao_code}'"
    cursor = connection.cursor()
    cursor.execute(sql)

    data = cursor.fetchall()
    return data


# Calculating the distance between airports to choose the nearest one for the police
def run_airport_distance(locations_to_choose, route_records):
    # Get current location
    curr_lat, curr_lon = get_current_location(route_records[-1])[0]
    city_current = (curr_lat, curr_lon)

    nearest_city = None
    min_distance = float("inf")

    for key in locations_to_choose.keys():
        city_candidate = (key[3], key[4])
        distance_calculated = geodesic(city_current, city_candidate).km

        if distance_calculated < min_distance:
            min_distance = distance_calculated
            nearest_city = city_candidate

    return nearest_city


# Gets the new random selection of airports the user can choose from, every round
# The added parameter to the function makes the code reusable instead of hardcoding all the airport choises the user is given
# The parameter can be set to 5, 4, and lastly 3 so that the choises will get limited after an amount of rounds
def rounds(amount_of_choises):
    data = get_airport_data()
    locations_to_choose = {}  # Empty dictionary
    # List to track used indexes
    used_indexes = []
    while len(used_indexes) < amount_of_choises:
        idx = random.randint(0, len(data) - 1)
        if idx not in used_indexes:
            locations_to_choose[data[idx]] = None
            used_indexes.append(idx)



    police_location = run_airport_distance(locations_to_choose, route_records_player)

    print("For your next trip you have these airports to choose from:\n ")
    for key in locations_to_choose.keys():
        print(f"{key[0]} : {key[1]} (airport code {key[2]})")

    next_location = input("\nPlease provide the airport code of the airport you want to travel to next: ").upper()

    # Tests the user input of the ICAO code
    # Ensures no typo errors
    isTrue = True
    counter = 0

    while isTrue:

        if counter < len(locations_to_choose):
            for key, value in locations_to_choose.items():
                if next_location in key:
                    route_records_player.append(next_location)
                    isTrue = False

                counter += 1
        else:
            next_location = input("\nPlease provide the airport code again (be sure to write it correctly): ").upper()
            counter = 0

    # checking if player's current location same with police and returning this result in function result
    if police_location == get_current_location(next_location)[0]:
        answer = "losing"
    else:
        answer = "winning"

    return answer


# MAIN ACTION
start_game()
amount_of_choises = 6 
getairportdata = get_airport_data()
while rounds_counter <= 5:
    print(f"--------------------- ROUND {rounds_counter} ---------------------")
    
    current = ("f", "Finland")
    for i in getairportdata:
        if i[2] == route_records_player[-1]:  # prints and tracks current lication
            current = i
    print(f"Your current location is {current[1]}")
    
    run = rounds(amount_of_choises)
    if run == "winning":
        rounds_counter += 1  
    if run == "losing":
        print(f"You lost. Police just got you!\n- | | (x_x) | |\n- | |  /█╯  | |\n- | |  / |  | |")
        break
    amount_of_choises -= 1
if rounds_counter == 6:
    print(f"You won!!! Congratulations!\n (-_•)  \n <) )╯💰\n  / > ")



