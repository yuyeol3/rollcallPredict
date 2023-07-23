self.addEventListener("push", (event)=>{
    const title = event.data.text();

    event.waitUntil(self.registration.showNotification(title));
});