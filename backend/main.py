from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from prediction_update_routine import PredictionUpdateRoutine, RollCallPredictor


prediction_result: list = [0]

app = Flask("ROLLCALL_PREDICTOR")


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_weather_json")
def get_weather_json():
    pres: RollCallPredictor = prediction_result[0]
    to_return = {
        "temperature": pres.parsed_weather.temperature,
        "precipitation_stat": pres.parsed_weather.precipitation_status,
        "base_date": pres.parsed_weather.base_date,
        "base_time": pres.parsed_weather.base_time,
        "sky_status": pres.parsed_weather.sky_status,
        "humidity": pres.parsed_weather.humidity,
        "precipitation_probability": pres.parsed_weather.precipitation_probability,
        "precipitation_hr": pres.parsed_weather.precipitation_hr,
        "inside_rollcall" : pres.is_inside_rollcall
    }
    return to_return

if __name__ == "__main__":
    routine = PredictionUpdateRoutine(prediction_result)
    routine.start()
    app.run(debug=False, host="0.0.0.0")

