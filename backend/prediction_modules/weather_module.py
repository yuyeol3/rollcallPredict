import requests
import json
from openapi_json_parser import OpenapiJsonParser

API_KEY = "DZUIFVa8jSOQwFqdDguTg7YNvaQvshjE0M+YdZ2wppO3OYJSBJZCLOt5FHdW3+4Qdi1F8QCx33vrNHibVfTb9g=="
URL = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst"

def get_weather(base_date: str, base_time: str, nx: str, ny: str, fcst_date: str, fcst_time: str) -> list[dict]:
    """
    날씨 데이터를 받아오는 함수\n
    Args:\n
        `base_date (str)` : 기준 날짜\n
        `base_time (str)` : 기준 시간\n
        `nx (str)` : 예보 좌표 x\n
        `ny (str)` : 예보 좌표 y\n
        `fcst_date (str)` : 예보 날짜\n
        `fcst_time (str)` : 예보 시각\n
    Returns:\n
        `list[dict]` : 예보 날짜와 시각에 대한 dict형 날씨 예보가 담긴 list
    """
    params = {
        "serviceKey" : API_KEY,
        "pageNo" : "1",
        "numOfRows" : "1000",
        "dataType" : "JSON",
        "base_date": base_date,
        "base_time" : base_time,
        "nx" : nx,
        "ny" : ny
    }

    res = requests.get(URL, params=params)
    res.raise_for_status()

    print(res.content)

    item_record_list = OpenapiJsonParser(res.content).parse()
    print(item_record_list)
    target_record_list = [i for i in item_record_list if i["fcstTime"] == fcst_time and i["fcstDate"] == fcst_date]
    
    return target_record_list

class ParsedWeather:
    SKY_CODE = {"1" : "맑음", "3" : "구름많음", "4" : "흐림"}
    PRECIPITATION_CODE = {"0" : "없음", "1" : "비", "2" : "비/눈", "3" : "눈", "4" : "소나기"}
    def __init__(self, weather_data: dict):
        self.base_date = weather_data[0]["baseDate"]
        self.base_time = weather_data[0]["baseTime"]
        self.fcst_date = weather_data[0]["fcstDate"]
        self.fcst_time = weather_data[0]["fcstTime"]
        self.weather_dict = self.parse_data(weather_data)
        print(self.weather_dict)

        self.temperature = self.weather_dict["TMP"]  # 1시간 기온 - 섭씨
        self.wind_speed_ew = self.weather_dict["UUU"]  # 풍속(동서성분) - m/s
        self.wind_speed_ns = self.weather_dict["VVV"]  # 풍속(남북성분) - m/s
        self.wind_direction = self.weather_dict["VEC"]  # 풍향 - deg
        self.wind_speed =  self.weather_dict["WSD"]  # 풍속 - m/s
        self.sky_status = ParsedWeather.SKY_CODE[self.weather_dict["SKY"]]  # 하늘 상태 - 문자열
        self.precipitation_status = ParsedWeather.PRECIPITATION_CODE[self.weather_dict["PTY"]]  # 강수 상태 - 문자열
        self.precipitation_probability = self.weather_dict["POP"]  # 강수 확률 - %
        self.wave = self.weather_dict["WAV"]  # 파고 - M
        self.precipitation_hr = self.weather_dict["PCP"]  # 1시간 강수량 - mm
        self.humidity = self.weather_dict["REH"]  # 습도 - %
        self.snow_hr = self.weather_dict["SNO"]  # 1시간 신적설 - cm

        # 최저/최고기온 키는 없을 수도 있으므로 attribute에 추가하지 않음.

    def parse_data(self, data):
        res = [(i["category"], i["fcstValue"]) for i in data]
        return dict(res)
    
    def __repr__(self):
        return f"ParsedWeather(fcst_date = {self.fcst_date}, temp = {self.temperature}, pcp = {self.precipitation_status})"




if __name__ == "__main__":
    result = get_weather("20230618", "1700", "96", "76", "20230619", "0700")
    if (len(result) > 0):
        parsed_weather = ParsedWeather(result)
        print(parsed_weather.precipitation_status)
    else:
        print("cannot get data")