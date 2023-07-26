from flask import Flask, render_template, url_for, request, redirect

class RollcallPredictionServer(Flask):
    '''Flask server class'''
    def __init__(self, *args, **kargs):
        super().__init__(*args, **kargs)
        self.prediction_result: list = [None]
        # update_routine = PredictionUpdateRoutine(self.prediction_result)
        # update_routine.start()
        
        # noti_routine = NotificationPushRoutine(self.prediction_result)
        # noti_routine.start()
    
    def run(self, *args, **kargs):
        super().run(*args, **kargs)


app = RollcallPredictionServer("ROLLCALL_PREDICTOR")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'