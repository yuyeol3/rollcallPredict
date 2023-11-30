
class BottomBar extends HTMLElement
{
    constructor()
    {
        super();
        this.styleElement = document.createElement("style");
        this.styleElement.innerHTML = `
            #buttons-div {
                height: 100%;
                display: flex;
                flex-direction : row;
                justify-content : space-around;
                align-items : center;
            }

            .bottombtn {
                height: 100%;
                background-color: transparent;
                border: 0px;
            }

            @media (min-width : 1024px) {
                #buttons-div {

                    flex-direction : column;

                }
            }
        `;

    }

    connectedCallback()
    {
        this.innerHTML = `
        <div id="buttons-div">
            <button class="bottombtn" id="home-btn" title="home">
                <img src="/static/images/home.svg" alt="home">
            </button>
            <button class="bottombtn" id="info-btn" title="about">
                <img src="/static/images/info.svg" alt="about">
            </button>
        </div>
        `;
        this.prepend(this.styleElement);
        this.querySelector("#home-btn").onclick = () => {
            if (location.hash != "")
                location.href = "/#"
        };
        this.querySelector("#info-btn").onclick = () => {
            if (location.hash != "#about")
                location.href = "/#about"
        };
    }


};

module.exports = {BottomBar};