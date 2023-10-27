const getPage404 = () => {

    document.getElementById("contents").innerHTML = `
            <style>
                #err-msg {
                    height: 90vh;
                    display : flex;
                    flex-flow : column nowrap;
                    justify-content : center;
                    align-items : center;
                }
            </style>
            <div id="err-msg">
                <h1 style="text-align: center;">404 오류</h1>
                <p style="text-align: center;">요청하신 페이지를 찾을 수 없습니다.</p>
                <a href="./#">메인 화면으로</a>
            </div>
    `;
}

module.exports = {getPage404}