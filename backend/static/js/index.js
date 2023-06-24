(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const image_dir = {
    "없음" : "./static/images/sun.png",
    "비" : "./static/images/rain.png",
    "비/눈" : "./static/images/sleet.png",
    "눈" : "./static/images/snow.png"
}

module.exports = {image_dir}
},{}],2:[function(require,module,exports){
const { image_dir } = require("./consts.js")

class LoadingStatus extends HTMLElement
{
    constructor() {
        super();
        this.style.position = "fixed";
        this.style.top = "0";
        this.style.bottom = "0";
        this.style.width = "100%";
        this.style.height = "100%";

        this.style.display = "none";
        this.style.flexFlow = "column nowrap";
        this.style.justifyContent = "center";
        this.style.alignItems = "center";

        this.styleElement = document.createElement("style");
        this.styleElement.innerHTML = `
        #loading-img {
            width: 30px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
        }
        `;
    }

    connectedCallback() {
        this.innerHTML = `
        <img id="loading-img" src="./static/images/loading.png"></img>
        `;
        this.prepend(this.styleElement);
    }

    showLoading() {
        this.style.display = "flex";
    }

    hideLoading() {
        this.style.display = "none";
    }
}

class WeatherDisplayer extends HTMLElement
{
    constructor() {
        super();
        this.styleElement = document.createElement("style");
        this.styleElement.innerHTML = `
        #weather-status-div {
            height: 30%;
            padding: 10px;
            display: flex;
            flex-flow: row wrap;
            justify-content: center;
            align-items: center;
        }

        #rollcall-status-div {
            width: 100%;
            height: 70%;
            padding: 10px;
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
            height: 80%;
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

        #detailed-info-div {
            padding: 10px;
        }

        #temp {
            font-size: 60px;
        }

        #updated-time {
            text-align: center;
        }

        #update-weather-btn {
            width: 150px;
            height: 50px;
            margin: 0px calc((100% - 150px) / 2);
            font-weight: bold;
            background-color: white;
            border: 1px solid black;
        }

        #update-weather-btn:active {
            background-color: gray;
        }


        `;
    }

    connectedCallback() {
        this.innerHTML = `
        <loading-stat></loading-stat>
        <div id="weather-status-div">
            <div id="weather-icon-div">
                <img id="weather-icon-img" src=""></img>
            </div>
            <div id="weather-attributes-div">
                <h1 id="temp"></h1>
                <h1 id="pcp-stat"></h1>
            </div>
        </div>
        <div id="detailed-info-div">
            <button id="update-weather-btn">업데이트</button>
            <p id="updated-time"></p>
            <h2>내일 점호는?</h2>
            <p id="tomorrow-rollcall">명일 아침점호는 <b></b>입니다</p>
            <h2>세부 정보</h2>
            <ul id="detailed-info-list">
                <li id="humidity">습도: </li>
                <li id="pcp-probability">강수확률: </li>
                <li id="pcp-hr">강수량: </li>
            </ul>
        </div>
        `;
        this.querySelector("#update-weather-btn").onclick = ()=>{this.updateWeather()};
        this.prepend(this.styleElement);
        this.updateWeather();
    }


    async updateWeather() {
        const loadingStat = this.querySelector("loading-stat");
        try {
            loadingStat.showLoading();
            console.log("attempting to update weather..");
            const data = await this.fetchData();
            
            this.querySelector("#temp").innerText = `${data["temperature"]}º`;
            this.querySelector("#updated-time").innerText = `Updated at ${data["base_date"]} ${data["base_time"]}`;
            
            let weather_stat;

            this.querySelector("#weather-icon-img").setAttribute("src", `${image_dir[data["precipitation_stat"]]}`);
            if (data["precipitation_stat"] === "없음")
                weather_stat = data["sky_status"];
            else
                weather_stat = data["precipitation_stat"]; 

            this.querySelector("#pcp-stat").innerText = weather_stat;
            
            this.querySelector("#humidity").innerText = `습도: ${data["humidity"]}%`;
            this.querySelector("#pcp-probability").innerText = `강수확률: ${data["precipitation_probability"]}%`;
            this.querySelector("#pcp-hr").innerText = `강수량: ${data["precipitation_hr"]}`;
            

            this.querySelector("#tomorrow-rollcall").innerHTML = `명일 아침점호는 <b>${["야외", "실내"][Number(data["inside_rollcall"])]}점호</b>입니다`
        }
        catch (error) {
            console.error(error);
        }

        loadingStat.hideLoading();
    }

    async fetchData() {
        // AJAX 요청 설정
        const response = await fetch("./get_weather_json", {
            method: "GET",
            headers: {
            "Content-Type": "application/json"
            }
        });
        
        const data = await response.json();
        return data
    }
}

class TopBar extends HTMLElement
{
    constructor() {
        super();
        this.styleElement = document.createElement("style");
        this.styleElement.innerHTML = `
        #app-title {
            display: inline-block;
            text-align: center;
            margin: 15px auto;
            width: 100%;
            height: 20px;
        }
        `;
    }

    connectedCallback() {
        this.innerHTML = `
            <h3 id="app-title">내일점호</h3>
        `;
        this.appendChild(this.styleElement);
    }
}

customElements.define("weather-displayer", WeatherDisplayer);
customElements.define("top-bar", TopBar);
customElements.define("loading-stat", LoadingStatus);
},{"./consts.js":1}]},{},[2]);
