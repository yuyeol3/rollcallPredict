const {noti_openkey} = require("./consts.js")
const {NotiHandler} = require("./NotiHandler.js")

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
            const subscribeBtn = notiModal.getDialog().querySelector("#subscribe-button");
            new NotiHandler(noti_openkey, subscribeBtn).registSubscription(); 
        }

    }

};

module.exports = {TopBar}
