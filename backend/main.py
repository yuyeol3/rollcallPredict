from rollcal_prediction_server import *
import database_handler as dbhandler


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_weather_json")
def get_weather_json() -> dict:
    if app.prediction_result[0] is None:
        return {}
    
    
    pres: RollCallPredictor = app.prediction_result[0]
    to_return = {
        "temperature": pres.parsed_weather.temperature,
        "precipitation_stat": pres.parsed_weather.precipitation_status,
        "base_date": pres.parsed_weather.base_date,
        "base_time": pres.parsed_weather.base_time,
        "target_date" : pres.parsed_weather.get_target_date(),
        "sky_status": pres.parsed_weather.sky_status,
        "humidity": pres.parsed_weather.humidity,
        "precipitation_probability": pres.parsed_weather.precipitation_probability,
        "precipitation_hr": pres.parsed_weather.precipitation_hr,
        "wbgt": int(pres.parsed_weather.calc_wbgt()),
        "inside_rollcall" : pres.is_inside_rollcall
    }
    return to_return

@app.route("/regist_subscription", methods=['POST', 'GET'])
def regist_subscription():
    if request.method == "POST":
        print("POST request made!")
        print(request.json)

        return {"registration_result":True}

    elif request.method == "GET":
        return redirect("/")

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0")

