from flask import Flask, render_template, url_for, request, redirect
from prediction_update_routine import PredictionUpdateRoutine, RollCallPredictor

class RollcallPredictionServer(Flask):
    '''Flask server class'''
    def __init__(self, *args, **kargs):
        super().__init__(*args, **kargs)
        self.prediction_result: list = [None]
        routine = PredictionUpdateRoutine(self.prediction_result)
        routine.start()
    
    def run(self, *args, **kargs):
        super().run(*args, **kargs)


app = RollcallPredictionServer("ROLLCALL_PREDICTOR")