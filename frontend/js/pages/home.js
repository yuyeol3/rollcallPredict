const getPageHome = () => {
    document.getElementById("contents").innerHTML = `
    <style>
    </style>
    <weather-displayer class="main-content"></weather-displayer>`;

    document.querySelectorAll("dialog").forEach((e)=>{
        e.close();
    })
}

module.exports = {getPageHome}