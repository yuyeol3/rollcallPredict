const getPageHome = () => {
    document.getElementById("contents").innerHTML = `
    <weather-displayer></weather-displayer>`;

    document.querySelectorAll("dialog").forEach((e)=>{
        e.close();
    })
}

module.exports = {getPageHome}