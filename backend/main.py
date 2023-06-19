from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from prediction_update_routine import PredictionUpdateRoutine

prediction_result: list = [0]

app = Flask("ROLLCALL_PREDICTOR")

@app.route("/")
def index():
    return f"{prediction_result[0].parsed_weather}, {prediction_result[0].is_inside_rollcall}"


if __name__ == "__main__":
    pur = PredictionUpdateRoutine(prediction_result)
    pur.run()
    app.run(debug=True)

