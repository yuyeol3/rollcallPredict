const {WeatherDisplayer} = require("./WeatherDisplayer.js");
const {TopBar} = require("./TopBar.js");
const {LoadingStatus} = require("./LodingStatus.js");
const {Modal} = require("./Modal.js");

customElements.define("weather-displayer", WeatherDisplayer);
customElements.define("top-bar", TopBar);
customElements.define("loading-stat", LoadingStatus);
customElements.define("modal-package", Modal);

