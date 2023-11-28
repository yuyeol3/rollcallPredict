const image_dir = {
    "없음" : "./static/images/sun.png",
    "비" : "./static/images/rain.png",
    "비/눈" : "./static/images/sleet.png",
    "눈" : "./static/images/snow.png"
};

const noti_openkey = "BObE1QWyIKsrHwzu4PfAee-J6zG44TMuyjLzZveQbKOZJkdrBDbARqnJBaua0ji74TowUqWHPp9IwckRdfYUxkk";

const {getPage404} = require("./pages/404.js");
const {getPageHome} = require("./pages/home.js");

const routes = {
    404: getPage404,
    "/": getPageHome
};

module.exports = {image_dir, noti_openkey, routes}