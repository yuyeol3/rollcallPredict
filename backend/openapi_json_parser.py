import json

class OpenapiJsonParser:
    '''공공데이터포털에서 가져온 json 데이터들을 `list[dict]` 형으로 파싱해주는 클래스'''
    def __init__(self, serialized_json):
        self.reset(serialized_json)

    def parse(self):
        self.contents = json.loads(self.serialized_json)
        self.result_status = self.contents["response"]["header"]["resultMsg"]
        self.items = []
        
        if self.result_status == "NO_DATA":
            return self.items


        self.items = (self.contents["response"]["body"]["items"]["item"] 
                 if type(self.contents["response"]["body"]["items"]) is not str 
                 else [])
        
        if type(self.items) is dict:
            self.items = [self.items]

        return self.items
    
    def reset(self, serialized_json):
        self.serialized_json = serialized_json


if __name__ == "__main__":
    pass