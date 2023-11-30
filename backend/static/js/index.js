(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

class BottomBar extends HTMLElement
{
    constructor()
    {
        super();
        this.styleElement = document.createElement("style");
        this.styleElement.innerHTML = `
            #buttons-div {
                height: 100%;
                display: flex;
                flex-direction : row;
                justify-content : space-around;
                align-items : center;
            }

            .bottombtn {
                height: 100%;
                background-color: transparent;
                border: 0px;
            }

            @media (min-width : 1024px) {
                #buttons-div {

                    flex-direction : column;

                }
            }
        `;

    }

    connectedCallback()
    {
        this.innerHTML = `
        <div id="buttons-div">
            <button class="bottombtn" id="home-btn" title="home">
                <img src="/static/images/home.svg" alt="home">
            </button>
            <button class="bottombtn" id="info-btn" title="about">
                <img src="/static/images/info.svg" alt="about">
            </button>
        </div>
        `;
        this.prepend(this.styleElement);
        this.querySelector("#home-btn").onclick = () => {
            if (location.hash != "")
                location.href = "/#"
        };
        this.querySelector("#info-btn").onclick = () => {
            if (location.hash != "#about")
                location.href = "/#about"
        };
    }


};

module.exports = {BottomBar};
},{}],2:[function(require,module,exports){
/**
 * 로딩 상태를 보여주는 customElement
 */
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

    /**
     * 로딩화면 보여주기
     */
    showLoading() {
        this.style.display = "flex";
    }

    /**
     * 로딩 화면 숨기기
     */
    hideLoading() {
        this.style.display = "none";
    }
}

module.exports = {LoadingStatus}
},{}],3:[function(require,module,exports){
class Modal extends HTMLElement {
    constructor() {
        super();

        this.styleElement = document.createElement("style");
        this.styleElement.innerHTML = `
            .modal-dialog {
                width: 90vw;
                height: 45vh;
                border-width: 0px;
                border-radius: calc(90vw * 0.02);
            }

            .close-button {
                border-width: 0px;
                background-color: white;
                height: 20px;
                margin-bottom: 10px;
                float : right;
            }

            .close-button img {
                width: 10px;
            }

            .content-div {

                clear : right;
                margin : 10px 0;
            }
            
            @media (min-width: 1024px)
            {
                .modal-dialog {
                    width: 50vw;
                    border-radius: calc(50vw * 0.02);
                }
            }

        `;
    }

    connectedCallback() {
        this.innerHTML = `
        <button class="call-modal"></button>
        <dialog class="modal-dialog">
            <form class="modal-form" method="dialog">
                <button class="close-button" value="close"><img src="./static/images/close.png"></button>
            </form>
            <div class="content-div"></div>
        </dialog>
        `;
        this.appendChild(this.styleElement);
        this._setModalButton();
    }

    _setModalButton() {
        this.querySelector(".call-modal").onclick = ()=> { 
            if (this.getAttribute("href")) {
                location.href = this.getAttribute("href");
                return;
            }

            this.querySelector(".modal-dialog").showModal();
        }
    }

    setButtonHTML(content) {
        this.querySelector(".call-modal").innerHTML = content;
    }

    setDialogHTML(content) {
        this.querySelector(".content-div").innerHTML = content;
    }
    
    getButton() {
        return this.querySelector(".call-modal");
    }

    getDialog() {
        return this.querySelector(".modal-dialog");   
    }

    openModal() {
        this.querySelector(".modal-dialog").showModal();
    }     
};




module.exports = {Modal}
},{}],4:[function(require,module,exports){
const {noti_openkey} = require("../consts.js")
const {NotiHandler} = require("../modules/NotiHandler.js")

class TopBar extends HTMLElement
{
    constructor() {
        super();
        this.styleElement = document.createElement("style");
        this.styleElement.innerHTML = `
        #app-title {
            display: inline-block;

            text-align: left;
            margin: 14px 20px;
            width: 100%;
            height: 20px;
        }

        #icons-div {
            position: fixed;
            top: 0; right: 0;
            width: 50px;
            height: 50px;
        }

        #icons-div .call-modal {
            height: 50px;
            border-width: 0px;
            background-color: white;
        }


        #noti-modal .call-modal img {
            width: 30px;
        }


        `;
    }

    connectedCallback() {
        this.innerHTML = `
            <div id="icons-div">
                <modal-package id="noti-modal"></modal-package>

            </div>
            <h3 id="app-title">내일점호</h3>
        `;
        this.appendChild(this.styleElement);
        this._setNotiModal();
    }

    _setNotiModal() {
        const notiModal = this.querySelector("#noti-modal");
        notiModal.setDialogHTML(`
            <style>
                .setting-list-div {
                    height: 30px;
                    margin: 10px 0;
                    display: flex;
                    flex-direction : row;
                    justify-content : space-between;
                }

                .setting-list-div button {
                    height: 40px;
                    width: 100px;
                    background-color: rgb(77, 165, 247);
                    color : white;
                    border : 0px;
                    border-radius : 5px;
                }

                .setting-list-div p {
                    margin: 0;
                    height: 25px;
                }
            </style>
            <div class="setting-list-div">
                <p>매일 오후 9시에 알람 받기</p><button id="subscribe-button">구독 신청</button>
            </div>
        `);
        notiModal.setButtonHTML(`
            <img src="./static/images/bell.png"></img>
        `)

        notiModal.getDialog().querySelector("#subscribe-button").onclick = () => { 
            const subscribeBtn = notiModal.getDialog().querySelector("#subscribe-button");
            new NotiHandler(noti_openkey, subscribeBtn).registSubscription(); 
        }

    }

};

module.exports = {TopBar}

},{"../consts.js":6,"../modules/NotiHandler.js":8}],5:[function(require,module,exports){
const {image_dir} = require("../consts.js")
const {WeatherUpdater} = require("../modules/WeatherUpdater.js")

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

        @media (min-width : 1024px) {
            .background-box {
                width: 80%;
            }
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
},{"../consts.js":6,"../modules/WeatherUpdater.js":10}],6:[function(require,module,exports){
const image_dir = {
    "없음" : "./static/images/sun.png",
    "비" : "./static/images/rain.png",
    "비/눈" : "./static/images/sleet.png",
    "눈" : "./static/images/snow.png"
};

const noti_openkey = "BObE1QWyIKsrHwzu4PfAee-J6zG44TMuyjLzZveQbKOZJkdrBDbARqnJBaua0ji74TowUqWHPp9IwckRdfYUxkk";

const pages = require("./pages/pages.js");
const routes = {
    404: pages.getPage404,
    "/": pages.getPageHome,
    "#about": pages.getPageAbout
};

module.exports = {image_dir, noti_openkey, routes}
},{"./pages/pages.js":14}],7:[function(require,module,exports){
const {WeatherDisplayer, WeatherSynop, DetailedWeatherInfo} = require("./components/WeatherDisplayer.js");
const {TopBar} = require("./components/TopBar.js");
const {BottomBar} = require("./components/BottomBar.js");
const {LoadingStatus} = require("./components/LodingStatus.js");
const {Modal} = require("./components/Modal.js");
const {getRouteHtml, handleRoute} = require("./modules/RouteHandler.js");

// customElement 정의
customElements.define("weather-displayer", WeatherDisplayer);
customElements.define("weather-synop", WeatherSynop);
customElements.define("detailed-weather", DetailedWeatherInfo);
customElements.define("top-bar", TopBar);
customElements.define("bottom-bar", BottomBar);
customElements.define("loading-stat", LoadingStatus);
customElements.define("modal-package", Modal);

// 마우스 우클릭 방지
window.addEventListener("contextmenu", e => e.preventDefault());
window.addEventListener("selectstart", e => e.preventDefault());


window.addEventListener('DOMContentLoaded', function()
{
  // service worker 등록
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("./static/js/serviceWorker.js")
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  }

  // routing을 위한 정의
  window.onpopstate = getRouteHtml;
  getRouteHtml();

});

},{"./components/BottomBar.js":1,"./components/LodingStatus.js":2,"./components/Modal.js":3,"./components/TopBar.js":4,"./components/WeatherDisplayer.js":5,"./modules/RouteHandler.js":9}],8:[function(require,module,exports){
/**
 * noti 등록/수신을 위한 컨트롤 클레스.
 */
class NotiHandler {
    constructor(openKey, targetButton) {
        this.openKey = openKey;
        this.targetButton = targetButton;
    }

    async registSubscription() {
        let permAllowance = await this._checkPermission();

        if (permAllowance) {
            this._sendSupscriptionReq();
        }
    }

    async _checkPermission() {
        if ('Notification' in window) {
            try {
                let permission = await Notification.requestPermission();
                if (permission === "granted") {
                    return true;
                }

            } catch(error) {
                console.error('Error requesting notification permission:', error);
            } 
        }
        
        return false;

        // if ('Notification' in window) {
        //     Notification.requestPermission()
        //       .then((permission) => {
        //         if (permission === 'granted') {
        //           // User has granted permission
        //           // Subscribe for push notifications
        //           this._sendSupscriptionReq();
        //         } else {
        //           // User has denied permission
        //           console.log('Push notification permission denied.');
        //         }
        //       })
        //       .catch((error) => {
        //         console.error('Error requesting notification permission:', error);
        //       });
        //   }
          
    }

    _sendSupscriptionReq() {

        navigator.serviceWorker.register("./static/js/serviceWorker.js")
            .then((registration) => {

            registration.pushManager.getSubscription().then((subscription) => {
                if (subscription) {
                    console.log("구독이 이미 있습니다.");
                    this._showSubscriptionSucceed();
                    // this.saveOnDB(subscription);
                } else {
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: this.openKey
                    })
                    .then((subscription) => {
                        this.saveOnDB(subscription);
                    })
                }
            })

        })
    }

    async saveOnDB(subscription) {
        console.log("inside SaveOnDB(subscription)");
        const res = await fetch("./regist_subscription", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
        })

        const data = await res.json();

        if (data.registration_result) {
            this._showSubscriptionSucceed();
        }

        return data;
    }

    _showSubscriptionSucceed() {
        this.targetButton.innerText = "구독완료✔️"
    }
};

module.exports = {NotiHandler}
},{}],9:[function(require,module,exports){
const {routes} = require("../consts.js");

const getRouteHtml = async () => {
    const path = window.location.hash || window.location.pathname;
    const route = routes[path] || routes[404];
    route();

//     const contents = document.getElementById("contents");
//     contents.innerHTML = route();
}

const handleRoute = (event) => {
    event = event || window.event;
    event.preventDefault(); // anchor 태그의 기본동작인 링크 대상으로 이동하는 행동을 방지한다.
    window.history.pushState({}, "", event.target.href); 
    getRouteHtml();
}



module.exports = {getRouteHtml, handleRoute}
},{"../consts.js":6}],10:[function(require,module,exports){
class WeatherUpdater {
    constructor() {
        this.weather = null;
        

    }

    getData() {
        if (this.weather == null) {
            console.warn("cannot read weather data.");
            return;
        }

        return this.weather;
    }
    async updateWeather() {
        // AJAX 요청 설정
        const response = await fetch("./get_weather_json", {
            method: "GET",
            headers: {
            "Content-Type": "application/json"
            }
        });
        
        const data = await response.json();
        this.weather = data;
        return data
    }
}

module.exports = {WeatherUpdater}
},{}],11:[function(require,module,exports){
const getPage404 = () => {

    document.getElementById("contents").innerHTML = `
            <style>
                #err-msg {
                    height: 90vh;
                    display : flex;
                    flex-flow : column nowrap;
                    justify-content : center;
                    align-items : center;
                }
            </style>
            <div id="err-msg">
                <h1 style="text-align: center;">404 오류</h1>
                <p style="text-align: center;">요청하신 페이지를 찾을 수 없습니다.</p>
                <a href="./#">메인 화면으로</a>
            </div>
    `;
}

module.exports = {getPage404}
},{}],12:[function(require,module,exports){
const getPageAbout = () => {

    document.getElementById("contents").innerHTML = `
        <style>
            #about-div {
                text-align: center;
                background-color: white;
            }
        </style>    
        <div id="about-div" class="main-content">
            <h1 id="header-text">내일점호</h1>

        </div>
    `

};

module.exports = {getPageAbout};
},{}],13:[function(require,module,exports){
const getPageHome = () => {
    document.getElementById("contents").innerHTML = `
    <style>
    </style>
    <weather-displayer class="main-content"></weather-displayer>`;

    document.querySelectorAll("dialog").forEach((e)=>{
        e.close();
    })
}

module.exports = {getPageHome}
},{}],14:[function(require,module,exports){
const {getPage404} = require("./404.js");
const {getPageHome} = require("./home.js");
const {getPageAbout} = require("./about.js");

module.exports = {getPage404, getPageHome, getPageAbout};
},{"./404.js":11,"./about.js":12,"./home.js":13}]},{},[7]);
