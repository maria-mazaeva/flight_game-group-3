
import mysql.connector
import random

connection = mysql.connector.connect(
    host = "127.0.0.1",
    port = 3306,
    database = "flight_game",
    user = "root",
    password = "password",
    autocommit = True
)


#Empty lists to store the routes of the player and the police
#Could be printed as a part of the summary at the end (wether you win or lose)
route_records_player = ["EFHK"]  #Player always starts at Helinki Airport, Finland
route_records_police = []
rounds_counter = 0


#Function to start the game
#Gives the player information about how the game works
def start_game():
    print("You just robbed the Bank of Finland, and the police are after you!!!")
    print("Your aim is to outrun the police by visiting 10 different airports in Europe.")
    print("Luckily for you, the police are not very honest, so you can bribe them ones.")
    print("Avoid the police that is trying to get you, do not get caught!")
    print("Remember to choose the most distant airport from your current location to not get caught!")
    print("The police will always be in the closest airport.")




#Returns a list of tuples, of all the airports in Europe, the country they are in, and there ICAO-code
#Also the coordinates of the airport
#def get_airport_data():
#    sql = """select airport.name, country.name, airport.ident, airport.latitude_deg, airport.longitude_deg 
#             from airport, country
#             where airport.iso_country = country.iso_country
#             and country.continent = "EU"
#          """
#    cursor = connection.cursor()
#    cursor.execute(sql)
#    data = cursor.fetchall()
#    return data
def get_airport_data():                  
    sql = """select airport.name, country.name, airport.ident, airport.latitude_deg, airport.longitude_deg
            from airport, country
            where airport.iso_country = country.iso_country
            and country.continent = 'EU'
            group by country.name;
            """ 
    cursor = connection.cursor()
    cursor.execute(sql)
    data = cursor.fetchall()
    airport_data = []
    for i in data:
        airport_data.append(i)
    return airport_data


#Gets the coordinates of the players current location
def get_current_location(icao_code):
    sql = f"select latitude_deg, longitude_deg from airport where ident = '{icao_code}'"
    cursor = connection.cursor()
    cursor.execute(sql)

    data = cursor.fetchall()
    return data





#Gets the new random selection of airports the user can choose from, every round
#The added parameter to the function makes the code reusable instead of hardcoding all the airport choises the user is given
#The parameter can be set to 5, 4, and lastly 3 so that the choises will get limited after an amount of rounds
def rounds(amount_of_choises):

    data = get_airport_data()

    locations_to_choose = {}   #Empty dictionary

    #Uses the parameter to randomly fetch airports, and add them to the empty dictionary
    for i in range(0, amount_of_choises):
        locations_to_choose[data[random.randint(0, len(data))]] = None




    print("For your next trip you have these airports to choose from:\n ")
    for key in locations_to_choose.keys():
        print(f"{key[0]} : {key[1]} (airport code {key[2]})")


    next_location = input("\nPleace provide the airport code of the airport you want to travel to next: ").upper()


    #Tests the user input of the ICAO code
    #Ensures no typo errors
    isTrue = True
    counter = 0

    while isTrue:

        if counter < len(locations_to_choose):
            for key, value in locations_to_choose.items():
                if next_location in key:

                    isTrue = False

                counter += 1
        else:
            next_location = input("\nPleace provide the airport code again (be sure to write it correctly): ").upper()
            counter = 0





