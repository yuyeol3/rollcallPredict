from threading import Thread
from rollcall_prediction_module import RollCallPredictor
import datetime
from time import sleep
from datetime import timedelta
import traceback

TZ_KST = datetime.timezone(datetime.timedelta(hours=9))

class PredictionUpdateRoutine:
    '''시간이 바뀔 때마다 점호 예측 결과를 업데이트하는 루틴 클래스'''
    PREDICTION_COUNTER = 3
    def __init__(self, data_save_addr) -> None:
        self.data_save_addr = data_save_addr

    def start(self):
        '''루틴 시작'''
        self.thrd = Thread(target=self._task)
        # daemon thread로 설정
        # daemon thread란? 메인 쓰레드를 보조하는 쓰레드
        # 메인 쓰레드가 종료시 같이 종료됨
        self.thrd.daemon = True
        self.thrd.start()


    def _task(self):
        '''루틴 동작 중 실행할 작업 (private)'''
        prev_updated_hour = None
        while (True):
            now = datetime.datetime.now(tz=TZ_KST)
            if ((prev_updated_hour is None) or
                (prev_updated_hour != now.hour)):
                prev_updated_hour = now.hour
                self._update_prediction(now, prev_updated_hour)


    def _update_prediction(self, now: datetime.datetime, prev_updated_hour: int):
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
                self.data_save_addr[0] = res  # 오류 발생하지 않으면 결과를 저장
                print("업데이트 성공")
                return  # 추가적인 예측 업데이트가 불필요하므로 함수 끝내기


if __name__ == "__main__":
    result = [None]
    pur = PredictionUpdateRoutine(result)
    pur.run()