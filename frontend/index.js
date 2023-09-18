const {WeatherDisplayer, WeatherSynop, DetailedWeatherInfo} = require("./WeatherDisplayer.js");
const {TopBar} = require("./TopBar.js");
const {LoadingStatus} = require("./LodingStatus.js");
const {Modal} = require("./Modal.js");

customElements.define("weather-displayer", WeatherDisplayer);
customElements.define("weather-synop", WeatherSynop);
customElements.define("detailed-weather", DetailedWeatherInfo);
customElements.define("top-bar", TopBar);
customElements.define("loading-stat", LoadingStatus);
customElements.define("modal-package", Modal);

// 마우스 우클릭 방지
window.addEventListener("contextmenu", e => e.preventDefault());
window.addEventListener("selectstart", e => e.preventDefault());

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("./static/js/serviceWorker.js")
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
}
  