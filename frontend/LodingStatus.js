/**
 * 로딩 상태를 보여주는 customElement
 */
class LoadingStatus extends HTMLElement
{
    constructor() {
        super();
        this.style.position = "fixed";
        this.style.top = "0";
        this.style.bottom = "0";
        this.style.width = "100%";
        this.style.height = "100%";

        this.style.display = "none";
        this.style.flexFlow = "column nowrap";
        this.style.justifyContent = "center";
        this.style.alignItems = "center";

        this.styleElement = document.createElement("style");
        this.styleElement.innerHTML = `
        #loading-img {
            width: 30px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
        }
        `;
    }

    connectedCallback() {
        this.innerHTML = `
        <img id="loading-img" src="./static/images/loading.png"></img>
        `;
        this.prepend(this.styleElement);
    }

    /**
     * 로딩화면 보여주기
     */
    showLoading() {
        this.style.display = "flex";
    }

    /**
     * 로딩 화면 숨기기
     */
    hideLoading() {
        this.style.display = "none";
    }
}

module.exports = {LoadingStatus}