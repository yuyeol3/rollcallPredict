from routines import *
from flask_pywebpush import WebPush
import database_handler as dbhandler
import json

class Pa_NotificationPushRoutine(NotificationPushRoutine):
    def __init__(self, server):
        super().__init__([None], server)
        self.webpush = WebPush(dbhandler.server.app,
                              WEBPUSH_KEY["privateKey"],
                              {"sub" : WEBPUSH_KEY["subject"]}
                              )

    def _send_notification(self):
        with self.server.app_context():
            print("sending notifications..")
            subscribers = dbhandler.Subscribers.query.all()
            rollcall_type = int(self._get_weather_data()["inside_rollcall"])

            for subscriber in subscribers:
                try:
                    self.webpush.send(subscriber.convert_to_json(),
                                     "명일 아침점호는 "
                                     f'{["실외", "실내"][rollcall_type]}'
                                     "점호입니다.")
                                     
                except WebPushException:
                    print("WebPushException arose")
            
            print("notifications have successfully sent")

    def _get_weather_data(self):
        with open("pa_weather_data.json", "r", encoding="utf8") as f:
            return json.load(f)

def main():
    noti_rt = Pa_NotificationPushRoutine(dbhandler.server.app)
    noti_rt._send_notification()

if __name__ == "__main__":
    main()