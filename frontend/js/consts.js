const image_dir = {
    "없음" : "./static/images/sun.png",
    "비" : "./static/images/rain.png",
    "비/눈" : "./static/images/sleet.png",
    "눈" : "./static/images/snow.png"
};

const noti_openkey = "BObE1QWyIKsrHwzu4PfAee-J6zG44TMuyjLzZveQbKOZJkdrBDbARqnJBaua0ji74TowUqWHPp9IwckRdfYUxkk";

const pages = require("./pages/pages.js");
const routes = {
    404: pages.getPage404,
    "/": pages.getPageHome,
    "#about": pages.getPageAbout
};

module.exports = {image_dir, noti_openkey, routes}