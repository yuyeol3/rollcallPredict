(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const image_dir = {
    "없음" : "./static/images/sun.png",
    "비" : "./static/images/rain.png",
    "비/눈" : "./static/images/sleet.png",
    "눈" : "./static/images/snow.png"
};

const noti_openkey = "BObE1QWyIKsrHwzu4PfAee-J6zG44TMuyjLzZveQbKOZJkdrBDbARqnJBaua0ji74TowUqWHPp9IwckRdfYUxkk";

module.exports = {image_dir, noti_openkey}
},{}],2:[function(require,module,exports){
const { image_dir, noti_openkey } = require("./consts.js")

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

        #target-date-p {
            text-align: center;
            font-weight: bold;
            margin-bottom: 0;
        }

        `;
    }

    connectedCallback() {
        this.innerHTML = `
        <loading-stat></loading-stat>
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
                <li id="wbgt">온도지수(추정): </li>
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
            // 로딩화면 보여주기
            loadingStat.showLoading();
            console.log("attempting to update weather..");
            // 데이터 불러오기
            const data = await this.fetchData();
            // 예보하는 날짜
            this.querySelector("#target-date-p").innerText = `${data["target_date"]}`;
            // 온도
            this.querySelector("#temp").innerText = `${data["temperature"]}º`;
            // 업데이트 날짜
            this.querySelector("#updated-time").innerText = `Updated at ${data["base_date"]} ${data["base_time"]}`;
            // 날씨 아이콘            
            this.querySelector("#weather-icon-img").setAttribute("src", `${image_dir[data["precipitation_stat"]]}`);
            
        
            let weather_stat;
            // 강수 상태 없으면 -> 하늘 상태 보여주기. 강수 상태 있으면 강수 상태를 표시
            data["precipitation_stat"] === "없음" ? weather_stat = data["sky_status"] : weather_stat = data["precipitation_stat"];
            this.querySelector("#pcp-stat").innerText = weather_stat;
            
            // 습도
            this.querySelector("#humidity").innerText = `습도: ${data["humidity"]}%`;
            // 강수확률
            this.querySelector("#pcp-probability").innerText = `강수확률: ${data["precipitation_probability"]}%`;
            // 강수량
            this.querySelector("#pcp-hr").innerText = `강수량: ${data["precipitation_hr"]}`;
            // 온도지수
            this.querySelector("#wbgt").innerText = `온도지수(추정): ${data["wbgt"]}º`;
            
            // 예측한 점호 결과
            this.querySelector("#tomorrow-rollcall").innerHTML = `명일 아침점호는 <b>${["야외", "실내"][Number(data["inside_rollcall"])]}점호</b>입니다`
        }
        catch (error) {
            console.error(error);
        }

        // 로딩화면 숨기기
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


        #noti-modal img {
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
                    height: 25px;
                    background-color: white;
                    border: 1px solid black;
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
            new NotiHandler(noti_openkey).checkPermission(); 
        }

    }

};

class Modal extends HTMLElement {
    constructor() {
        super();

        this.styleElement = document.createElement("style");
        this.styleElement.innerHTML = `
            .modal-dialog {
                width: 90vw;
                height: 45vh;
                border-width: 0px;
                border-radius: 50px;
            }

            .close-button {
                border-width: 0px;
                background-color: white;
                height: 20px;
                margin: 10px 0;
                float : right;
            }

            .content-div {

                clear : right;
                margin : 10px 0;
            }


        `;
    }

    connectedCallback() {
        this.innerHTML = `
        <button class="call-modal"></button>
        <dialog class="modal-dialog">
            <form class="modal-form" method="dialog">
                <button class="close-button" value="close">x</button>
            </form>
            <div class="content-div"></div>
        </dialog>
        `;
        this.appendChild(this.styleElement);
        this._setModalButton();
    }

    _setModalButton() {
        this.querySelector(".call-modal").onclick = ()=> { this.querySelector(".modal-dialog").showModal(); }
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
};

class NotiHandler {
    constructor(openKey) {
        this.openKey = openKey;
    }

    checkPermission() {
        if ('Notification' in window) {
            Notification.requestPermission()
              .then((permission) => {
                if (permission === 'granted') {
                  // User has granted permission
                  // Subscribe for push notifications
                  this.sendSupscriptionReq();
                } else {
                  // User has denied permission
                  console.log('Push notification permission denied.');
                }
              })
              .catch((error) => {
                console.error('Error requesting notification permission:', error);
              });
          }
          
    }

    sendSupscriptionReq() {
        console.log("inside sendSupscriptionReq()")


        navigator.serviceWorker.register("./static/js/serviceWorker.js")
            .then((registration) => {

            registration.pushManager.getSubscription().then((subscription) => {
                if (subscription) {
                    this.saveOnDB(subscription);
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
        return data;
    }
};

customElements.define("weather-displayer", WeatherDisplayer);
customElements.define("top-bar", TopBar);
customElements.define("loading-stat", LoadingStatus);
customElements.define("modal-package", Modal);

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./static/js/serviceWorker.js");
}
},{"./consts.js":1}]},{},[2]);
