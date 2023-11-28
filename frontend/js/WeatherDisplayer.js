const {image_dir} = require("./consts.js")
const {WeatherUpdater} = require("./WeatherUpdater.js")

class WeatherSynop extends HTMLElement
{
    constructor() {
        super();
        
        this.styleElement = document.createElement("style");
        this.styleElement.innerHTML = `
        #weather-status-div {
            width : 90%;
            height : 200px;
            margin: 0 auto;
            display : flex;
            flex-flow : row nowrap;
            justify-content : center;
            align-items : center;
        }


        #weather-icon-div {
            width: 50%;
            height: 100%;
            display: flex;
            flex: row;
            justify-content: center;
            align-items: center;
        }
        
        #weather-icon-img {
            height: 60%;
        }
        
        #weather-attributes-div {
            width: 50%; height: 100%;
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
            text-align: center;
        }
        
        #weather-attributes-div h1{
            margin: 10px 0;
        }


        #updated-time {
            text-align: center;
        }

        #update-weather-btn {
            width: 150px;
            height: 40px;
            margin: 0px calc((100% - 150px) / 2);
            background-color: rgb(77, 165, 247);
            color : white;
            border : 0px;
            border-radius : 7.5px;
        }

        #update-weather-btn:active {
            background-color: #a2cdf5;
        }

        #target-date-p {
            text-align: center;
            font-weight: bold;
            margin-bottom: 0;
        }

        #pcp-stat {
            font-size: 35px;
        }

        #temp {
            font-size: 40px;
        }
        `;
    }

    connectedCallback() {
        this.innerHTML = `
        <p id="target-date-p">0000년 00월 00일</p>
        <div id="weather-status-div">
            <div id="weather-icon-div">
                <img id="weather-icon-img" src=""></img>
            </div>
            <div id="weather-attributes-div">
                <h1 id="temp"></h1>
                <h1 id="pcp-stat"></h1>
            </div>
        </div>
        <div id="button-div">
            <button id="update-weather-btn">업데이트</button>
            <p id="updated-time"></p>
        </div>
        `;
        this.prepend(this.styleElement);
    }

    setButton(callbkFn) {
        this.querySelector("#update-weather-btn").onclick = () => {callbkFn();}
    }
    
    update(data) {
        this.querySelector("#target-date-p").innerText = `${data["target_date"]}`;
        // 온도
        this.querySelector("#temp").innerText = `${data["temperature"]}º`;
        // 업데이트 날짜
        this.querySelector("#updated-time").innerText = 
        `Updated at ${data["base_date"]} ${data["base_time"]}`;
        
        // 날씨 아이콘            
        this.querySelector("#weather-icon-img")
        .setAttribute("src", `${image_dir[data["precipitation_stat"]]}`);
        
    
        let weather_stat;
        // 강수 상태 없으면 -> 하늘 상태 보여주기. 강수 상태 있으면 강수 상태를 표시
        (data["precipitation_stat"] === "없음" ? 
        weather_stat = data["sky_status"] : 
        weather_stat = data["precipitation_stat"]);
        this.querySelector("#pcp-stat").innerText = weather_stat;
      
    }

}

class DetailedWeatherInfo extends HTMLElement {
    constructor() {
        super();
        this.styleElement = document.createElement("style");
        this.styleElement.innerHTML = ``;
    }

    connectedCallback() {
        this.innerHTML = `
        <div id="rollcall-stat-div" class="background-box">
            <h2>내일 점호는?</h2>
            <p id="tomorrow-rollcall">명일 아침점호는 <b></b>입니다</p>
        </div>
        <div id="more-weather-info" class="background-box">
            <h2>세부 정보</h2>
            <ul id="detailed-info-list">
                <li id="humidity">습도: </li>
                <li id="pcp-probability">강수확률: </li>
                <li id="pcp-hr">강수량: </li>
                <li id="wbgt">온도지수(추정): </li>
            </ul>
        </div>
        `;
        this.prepend(this.styleElement);
    }

    update(data) {
        // 습도
        this.querySelector("#humidity").innerText = `습도: ${data["humidity"]}%`;
        // 강수확률
        this.querySelector("#pcp-probability").innerText = 
        `강수확률: ${data["precipitation_probability"]}%`;
        // 강수량
        this.querySelector("#pcp-hr").innerText = `강수량: ${data["precipitation_hr"]}`;
        // 온도지수
        this.querySelector("#wbgt").innerText = `온도지수(추정): ${data["wbgt"]}º`;
        
        // 예측한 점호 결과
        this.querySelector("#tomorrow-rollcall").innerHTML = 
        `명일 아침점호는 <b>${["⛰️야외", "🏠실내"][Number(data["inside_rollcall"])]}점호</b>입니다`
    }
}

class WeatherDisplayer extends HTMLElement
{
    constructor() {
        super();
        this.weatherUpdater = new WeatherUpdater();
        setInterval(
            ()=>{this.updateWeather()},
            1000 * 1800
        );
        this.styleElement = document.createElement("style");
        this.styleElement.innerHTML = `

        .background-box {
            display: block;
            width : 90%;
            margin: 10px auto;
            border-radius : 10px;
            background-color : white;
            padding : 10px;
        }

        .background-box h2 {
            margin-top: 5px;
        }

        #rollcall-status-div {
            width: 100%;
            height: 70%;
            padding: 10px;
        }

        #detailed-info-div {
            padding: 10px;
        }

        `;
    }

    connectedCallback() {
        this.innerHTML = `
        <loading-stat></loading-stat>
        <weather-synop class="background-box"></weather-synop>
        <detailed-weather></detailed-weather>
        `;
        this.querySelector("#update-weather-btn").onclick = ()=>{this.updateWeather()};
        this.prepend(this.styleElement);
        this.updateWeather();
    }


    async updateWeather() {
        const loadingStat = this.querySelector("loading-stat");
        const weatherSynop = this.querySelector("weather-synop");
        const detailedWeather = this.querySelector("detailed-weather");
        try {
            // 로딩화면 보여주기
            loadingStat.showLoading();
            console.log("attempting to update weather..");
            
            await this.weatherUpdater.updateWeather();
            // 데이터 불러오기
            const data = this.weatherUpdater.getData();
            weatherSynop.update(data);
            detailedWeather.update(data);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            // 로딩화면 숨기기
            loadingStat.hideLoading();
        }
    }


};

module.exports = {WeatherDisplayer, WeatherSynop, DetailedWeatherInfo}