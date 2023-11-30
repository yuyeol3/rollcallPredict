const getPageAbout = () => {

    document.getElementById("contents").innerHTML = `
        <style>
            #about-div {
                text-align: center;
                background-color: white;
            }
        </style>    
        <div id="about-div" class="main-content">
            <h1 id="header-text">내일점호</h1>

        </div>
    `

};

module.exports = {getPageAbout};