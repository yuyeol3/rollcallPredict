self.addEventListener("push", (event)=>{
    const data = event.data.text();

    event.waitUntil(self.registration.showNotification(data));
});