import json
from flask import Flask,Response, jsonify, request
from flask_cors import CORS
import os
import mysql.connector
import random
from geopy.distance import geodesic

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

class Database:
    def __init__(self):
        self.conn = mysql.connector.connect(
            host="127.0.0.1",
            port=3306,
            database="flight_game",
            user="root",
            password="password",
            autocommit=True
        )
    def get_conn(self):
        return self.conn

db = Database()

# Returns a list of 50 airports, one airport per European country, the country they are in, and there ICAO-code
# Also the coordinates of the airport
@app.route('/all_airports')
def get_airport_data():
    sql = """select airport.name, country.name, airport.ident, airport.latitude_deg, airport.longitude_deg
             from airport, \
                  country
             where airport.iso_country = country.iso_country
               and country.continent = 'EU'
             group by country.name; \
          """

    cursor = db.get_conn().cursor(dictionary=True)
    cursor.execute(sql)
    result = cursor.fetchall()
    airport_data = []
    for i in result:
        airport_data.append(i)
    return json.dumps(airport_data)


# Gets the coordinates of the players current location
@app.route('/get_current_location/<icao_code>')
def get_current_location(icao_code):
    sql = "select latitude_deg, longitude_deg from airport where ident =%s"
    cursor = db.get_conn().cursor(dictionary=True)
    cursor.execute(sql, (icao_code,))
    result = cursor.fetchone()
    return json.dumps(result)

# Calculating the distance between airports to choose the nearest one for the police
# Added method ['POST'] to get dictionary and list of dictionaries from frontend, cause we could not do it through the url
@app.route('/run_airport_distance', methods=['POST'])
def run_airport_distance():
    # getting info through a request
    data = request.json
    locations_to_choose = data['locations_to_choose']
    route_records = data['route_records']

    # Get current location
    location_dictionary = json.loads(get_current_location(route_records[-2]))
    curr_lat = location_dictionary['latitude_deg']
    curr_lon = location_dictionary['longitude_deg']
    city_current = (curr_lat, curr_lon)

    nearest_city = None
    min_distance = float("inf")


    for value in locations_to_choose:
        lat = value['latitude_deg']
        lon = value['longitude_deg']
        city_candidate = (lat, lon)
        distance_calculated = geodesic(city_current, city_candidate).km

        if distance_calculated < min_distance:
            min_distance = distance_calculated
            nearest_city = city_candidate

    result_str = json.dumps(nearest_city)
    return result_str

@app.errorhandler(404)
def page_not_found(error_code):
    response = {
        "message": "Invalid endpoint",
        "status": 404
    }
    json_response = json.dumps(response)
    http_response = Response(response=json_response, status=404, mimetype="application/json")
    return http_response

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)

