const { image_dir } = require("./consts.js")



class WeatherDisplayer extends HTMLElement
{
    constructor() {
        super();
        this.styleElement = document.createElement("style");
        this.styleElement.innerHTML = `
        #weather-status-div {
            height: 30%;
            display: flex;
            flex-flow: row wrap;
            justify-content: center;
            align-items: center;
        }

        #rollcall-status-div {
            height: 70%;
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

        #temp {
            font-size: 60px;
        }

        #updated-time {
            display: inline;
        }

        `;
    }

    connectedCallback() {
        this.innerHTML = `
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
        try {
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