/**
 * noti 등록/수신을 위한 컨트롤 클레스.
 */
class NotiHandler {
    constructor(openKey, targetButton) {
        this.openKey = openKey;
        this.targetButton = targetButton;
    }

    registSubscription() {
        this._checkPermissionNRegist();
    }

    _checkPermissionNRegist() {
        if ('Notification' in window) {
            Notification.requestPermission()
              .then((permission) => {
                if (permission === 'granted') {
                  // User has granted permission
                  // Subscribe for push notifications
                  this._sendSupscriptionReq();
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

    _sendSupscriptionReq() {
        console.log("inside sendSupscriptionReq()")


        navigator.serviceWorker.register("./static/js/serviceWorker.js")
            .then((registration) => {

            registration.pushManager.getSubscription().then((subscription) => {
                if (subscription) {
                    console.log("구독이 이미 있습니다.");
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
        return data;
    }
};

module.exports = {NotiHandler}