const {routes} = require("./consts.js");

const getRouteHtml = async () => {
    const path = window.location.hash || window.location.pathname;
    const route = routes[path] || routes[404];
    route();

//     const contents = document.getElementById("contents");
//     contents.innerHTML = route();
}

const handleRoute = (event) => {
    event = event || window.event;
    event.preventDefault(); // anchor 태그의 기본동작인 링크 대상으로 이동하는 행동을 방지한다.
    window.history.pushState({}, "", event.target.href); 
    getRouteHtml();
}



module.exports = {getRouteHtml, handleRoute}