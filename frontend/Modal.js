class Modal extends HTMLElement {
    constructor() {
        super();

        this.styleElement = document.createElement("style");
        this.styleElement.innerHTML = `
            .modal-dialog {
                width: 90vw;
                height: 45vh;
                border-width: 0px;
                border-radius: calc(90vw * 0.02);
            }

            .close-button {
                border-width: 0px;
                background-color: white;
                height: 20px;
                margin-bottom: 10px;
                float : right;
            }

            .close-button img {
                width: 10px;
            }

            .content-div {

                clear : right;
                margin : 10px 0;
            }


        `;
    }

    connectedCallback() {
        this.innerHTML = `
        <button class="call-modal"></button>
        <dialog class="modal-dialog">
            <form class="modal-form" method="dialog">
                <button class="close-button" value="close" onclick="location.hash = ''"><img src="./static/images/close.png"></button>
            </form>
            <div class="content-div"></div>
        </dialog>
        `;
        this.appendChild(this.styleElement);
        this._setModalButton();
    }

    _setModalButton() {
        this.querySelector(".call-modal").onclick = ()=> { 
            if (this.getAttribute("href")) {
                location.href = this.getAttribute("href");
                return;
            }

            this.querySelector(".modal-dialog").showModal();
        }
    }

    setButtonHTML(content) {
        this.querySelector(".call-modal").innerHTML = content;
    }

    setDialogHTML(content) {
        this.querySelector(".content-div").innerHTML = content;
    }
    
    getButton() {
        return this.querySelector(".call-modal");
    }

    getDialog() {
        return this.querySelector(".modal-dialog");   
    }

    openModal() {
        this.querySelector(".modal-dialog").showModal();
    }     
};




module.exports = {Modal}