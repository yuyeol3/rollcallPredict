from rollcal_prediction_server import *
import database_handler as dbhandler
from rollcall_prediction_module import RollCallPredictor
import json



@app.route("/")
def index():
    return render_template("index.html")


@app.route("/get_weather_json")
def get_weather_json() -> dict:
    to_return = {}
    with open("pa_weather_data.json", "r", encoding="utf8") as f:
        to_return = json.load(f)
    
    return to_return


@app.route("/regist_subscription", methods=['POST', 'GET'])
def regist_subscription():
    if request.method == "POST":
        subscription = request.json
        to_add = dbhandler.Subscribers(
            endpoint=subscription["endpoint"],
            p256dh=subscription["keys"]["p256dh"],
            auth=subscription["keys"]["auth"]
        )
        dbhandler.db.session.add(to_add)
        dbhandler.db.session.commit()

        #push.send(subscription, "this is test")

        return {"registration_result":True}

    elif request.method == "GET":
        return redirect("/")

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port="5100")
    # app.run(debug=False)
