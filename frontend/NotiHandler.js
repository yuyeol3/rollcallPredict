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