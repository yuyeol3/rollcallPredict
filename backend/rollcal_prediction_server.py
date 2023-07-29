from flask import Flask, render_template, url_for, request, redirect

class RollcallPredictionServer(Flask):
    '''Flask server class'''
    def __init__(self, *args, **kargs):
        super().__init__(*args, **kargs)
        self.prediction_result: list = [None]

    
    def run(self, *args, **kargs):
        super().run(*args, **kargs)


app = RollcallPredictionServer("ROLLCALL_PREDICTOR")
