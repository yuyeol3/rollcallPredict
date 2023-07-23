import datetime
import requests
import json
from weather_module import *
from openapi_json_parser import OpenapiJsonParser
import consts

class HolidayChecker:
    '''
    휴일인지 확인해주는 클래스
    '''
    API_KEY = consts.API_KEY
    URL = "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo"
    def __init__(self, year: int, month: int, day: int):
        '''
        Args:\n
        `year (int)`\n
        `month (int)`\n
        `day (int)`\n
        '''
        self.year = year
        self.month = month
        self.day = day
        

    def chk_holiday(self):
        '''
        설정한 날짜가 휴일인지 확인하는 함수
        '''
        temp_dt = datetime.date(self.year, self.month, self.day)

        if (temp_dt.weekday() >= 5):
            return True
        
        date_str_fmt = f"{self.year:03}{self.month:02}{self.day:02}"
        if (date_str_fmt in self._get_special_holidays(self.year, self.month)):
            return True
        
        return False
        
    def _get_special_holidays(self, year: int, month: int):
        '''
        주말이 아닌 공휴일 데이터를 가져오는 함수\n
        Args:\n
        `year (int)`\n
        `month (int)`\n
        Returns:\n
        `dict[str, str]`: 날짜(키)에 휴일이름(값)이 담긴 딕셔너리 
        '''
        params = {
            "serviceKey" : HolidayChecker.API_KEY,
            "solYear" : str(year),
            "solMonth" : str(month).zfill(2),
            "_type" : "json"
        }

        res = requests.get(HolidayChecker.URL, params=params)
        res.raise_for_status()
     

        items = OpenapiJsonParser(res.content).parse()
        items_dict = dict([(str(i["locdate"]), i["dateName"]) for i in items])        
        return items_dict
        

class RollCallPredictor:
    '''날씨와 휴일 정보를 불러와 점호 결과를 예측하는 클래스'''
    def __init__(self, base_date, base_hour, target_date):
        self.base_date = base_date
        self.base_hour = base_hour
        self.target_date = target_date
        self.is_holiday = HolidayChecker(year=int(target_date[:4]),
                                         month=int(target_date[4:6]),
                                         day=int(target_date[6:])).chk_holiday()

    def predict(self):
        '''예측 실시'''
        self.parsed_weather = ParsedWeather(get_weather(self.base_date, self.base_hour,
                                                        consts.NX, consts.NY,
                                                        self.target_date, "0600"))
        self.is_inside_rollcall = self._chk_inside_rollcall(self.parsed_weather)


        return {"WTH":self.parsed_weather, "IS_INSIDE": self.is_inside_rollcall}

    def _chk_inside_rollcall(self, pweather: ParsedWeather):

        return (
            self.is_holiday or
            pweather.precipitation_status != "없음" or
            pweather.calc_discomfort_index() >= 81 or
            pweather.calc_wind_chill() <= -5 or
            float(pweather.wind_speed) >= 10
            # pweather.calc_wbgt() >= 22
        )
     

if __name__ == "__main__":
    print(RollCallPredictor("20230619", "1700", "20230620").predict())