self.addEventListener("push", (event)=>{
    const data = event.data.text()["body"];

    event.waitUntil(self.registration.showNotification(data));
});