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
