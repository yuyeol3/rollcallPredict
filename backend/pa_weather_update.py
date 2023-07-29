from routines import *
import json


class Pa_PredictionUpdateRoutine(PredictionUpdateRoutine):
    def __init__(self):
        self.data_save_addr = [None]
        super().__init__(self.data_save_addr)
    
    def _update_prediction(self):
        now = datetime.datetime.now()
        prev_updated_hour = now.hour
        '''예측 업데이트 (private)'''
        for i in range(self.PREDICTION_COUNTER):
            try:
                target_date = now + timedelta(days=1)  # 예측할 날짜 (오늘 날짜 + 1 임)
                res = RollCallPredictor(f"{now.year}{now.month:02}{now.day:02}", 
                                    # 0시 정각인 경우 시간이 음수가 되는 현상 방지
                                    f"{(prev_updated_hour + 24 - (i + 2)) % 24:02}00",
                                    f"{target_date.year}{target_date.month:02}{target_date.day:02}")
                res.predict()  # 에측 실시
            except Exception as err:
                traceback.print_exc()  # 오류 발생시 traceback 출력
                # raise err
            else:
                with open("pa_weather_data.json", "w", encoding="utf8") as f:
                    to_dump = {
                        "temperature": res.parsed_weather.temperature,
                        "precipitation_stat": res.parsed_weather.precipitation_status,
                        "base_date": res.parsed_weather.base_date,
                        "base_time": res.parsed_weather.base_time,
                        "target_date" : res.parsed_weather.get_target_date(),
                        "sky_status": res.parsed_weather.sky_status,
                        "humidity": res.parsed_weather.humidity,
                        "precipitation_probability": res.parsed_weather.precipitation_probability,
                        "precipitation_hr": res.parsed_weather.precipitation_hr,
                        "wbgt": int(res.parsed_weather.calc_wbgt()),
                        "inside_rollcall" : res.is_inside_rollcall
                    }
                    json.dump(to_dump, f)  # 오류 발생하지 않으면 결과를 저장
                
                print("업데이트 성공")
                return  # 추가적인 예측 업데이트가 불필요하므로 함수 끝내기
    


def main():
    prediction_rt = Pa_PredictionUpdateRoutine()
    prediction_rt._update_prediction()

if __name__ == "__main__":
    main()
