from threading import Thread
from rollcall_prediction_module import RollCallPredictor
import datetime
from time import sleep
from datetime import timedelta
import traceback
from pywebpush import webpush
from consts import WEBPUSH_KEY
import database_handler as dbhandler

TZ_KST = datetime.timezone(datetime.timedelta(hours=9))

class Routine:
    def __init__(self):
        self.thrd = Thread(target=self._task)
        # daemon thread로 설정
        # daemon thread란? 메인 쓰레드를 보조하는 쓰레드
        # 메인 쓰레드가 종료시 같이 종료됨
        self.thrd.daemon = True
        self.prev_hour = None
        self.now_date = datetime.datetime.now(tz=TZ_KST)

    def start(self):
        self.thrd.start()

    def _task(self):
        '''루틴 동작 중 실행할 작업 (private)'''
        while (True):
            if (self._update_hour()):
                self._target_fn()

    def _update_hour(self):
        '''
        시간을 확인하고 시간이 바뀌면 멤버변수 prev_hour을 현재 시간으로 고치고 True를 반환.
        아니면 False를 반환
        '''
        self.now = datetime.datetime.now(tz=TZ_KST)
        if ((self.prev_hour is None) or
            (self.prev_hour != self.now.hour)):
            self.prev_hour = self.now.hour
            return True
        
        return False
    
    def _target_fn(self):
        pass


class PredictionUpdateRoutine(Routine):
    PREDICTION_COUNTER = 3
    def __init__(self, data_save_addr):
        Routine.__init__(self)
        self.data_save_addr = data_save_addr
        
    def _target_fn(self):
        self._update_prediction(self.now_date, self.prev_hour)

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


class NotificationPushRoutine(Routine):
    def __init__(self, data_save_addr):
        Routine.__init__(self)
        self.data_save_addr = data_save_addr

    def _target_fn(self):
        self._send_notification()

    def _send_notification(self):
        print("sending notifications..")
        subscribers = dbhandler.Subscribers.query.all()
        rollcall_type = int(self.data_save_addr[0].is_inside_rollcall)


        for subscriber in subscribers:
            webpush(
                subscriber.convert_to_json(),
                "명일 아침점호는 "
                f'{["실외", "실내"][rollcall_type]}'
                "점호입니다.",
                vapid_private_key=WEBPUSH_KEY["privateKey"],
                vapid_claims=WEBPUSH_KEY["subject"]
            )

# class PredictionUpdateRoutine:
#     '''시간이 바뀔 때마다 점호 예측 결과를 업데이트하는 루틴 클래스'''
#     PREDICTION_COUNTER = 3
#     def __init__(self, data_save_addr) -> None:
#         self.data_save_addr = data_save_addr

#     def start(self):
#         '''루틴 시작'''
#         self.thrd = Thread(target=self._task)
#         # daemon thread로 설정
#         # daemon thread란? 메인 쓰레드를 보조하는 쓰레드
#         # 메인 쓰레드가 종료시 같이 종료됨
#         self.thrd.daemon = True
#         self.thrd.start()


#     def _task(self):
#         '''루틴 동작 중 실행할 작업 (private)'''
#         prev_updated_hour = None
#         while (True):
#             now = datetime.datetime.now(tz=TZ_KST)
#             if ((prev_updated_hour is None) or
#                 (prev_updated_hour != now.hour)):
#                 prev_updated_hour = now.hour
#                 self._update_prediction(now, prev_updated_hour)


#     def _update_prediction(self, now: datetime.datetime, prev_updated_hour: int):
#         '''예측 업데이트 (private)'''
#         for i in range(self.PREDICTION_COUNTER):
#             try:
#                 target_date = now + timedelta(days=1)  # 예측할 날짜 (오늘 날짜 + 1 임)
#                 res = RollCallPredictor(f"{now.year}{now.month:02}{now.day:02}", 
#                                     # 0시 정각인 경우 시간이 음수가 되는 현상 방지
#                                     f"{(prev_updated_hour + 24 - (i + 2)) % 24:02}00",
#                                     f"{target_date.year}{target_date.month:02}{target_date.day:02}")
#                 res.predict()  # 에측 실시
#             except Exception as err:
#                 traceback.print_exc()  # 오류 발생시 traceback 출력
#                 # raise err
#             else:
#                 self.data_save_addr[0] = res  # 오류 발생하지 않으면 결과를 저장
#                 print("업데이트 성공")
#                 return  # 추가적인 예측 업데이트가 불필요하므로 함수 끝내기


def init_routines(app):
    address = app.prediction_result
    PredictionUpdateRoutine(address).start()

    NotificationPushRoutine(address).start()

if __name__ == "__main__":
    result = [None]
    pur = PredictionUpdateRoutine(result)
    pur.start()