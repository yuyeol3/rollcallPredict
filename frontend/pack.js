const {paths} = require("./paths.js");
const exec = require('child_process').exec;
const ncp = require('./node_modules/ncp').ncp; 
const fs = require("fs");

/**
 * 경로를 받아서 그 경로 안의 파일 이름들을 담은 배열을 반환해주는 함수
 * @param {string} dir 경로
 * @returns {string[]} dir안의 파일 이름들을 담은 배열 반환
 */
const getFileList = (dir) => {
    return fs.readdirSync(dir, (error, fileList)=>{return fileList});
}

/**
 * srcDir 안의 파일을 destDir에 복사하는 함수
 * @param {string} srcDir 
 * @param {string} destDir 
 */
const copyDir = (srcDir, destDir) => {
    const opt = {clobber : true};

    ncp(srcDir, destDir, opt, (err,out,stderr) => {
        if (err)
          console.error(err);
    });
}

/**
 * srcDir 안의 파일을 destDir과 비교하여 변경점을 반영하는 함수
 * @param {string} srcDir 
 * @param {string} destDir 
 */
const updateDir = (srcDir, destDir) => {
    copyDir(srcDir, destDir);

    /**
     * @type Map<string, boolean>
     */
    let srcMap = new Map();

    getFileList(srcDir).forEach((e)=> {
        srcMap.set(e, true);
    })

    getFileList(destDir).forEach((e)=>{
        if (!srcMap.has(e))
            fs.unlinkSync(destDir + e);
    })
}

/**
 * javascript 파일들을 웹에서 쓸 수 있게 번들해줌
 */
const bundleJs = () => {
    exec(`browserify ./js/index.js -o ${paths.js}/index.js`, (err,out,stderr) => {
        if (err)
            console.error(err)
    });    
}

const main = ()=> {
    try {
        updateDir("./html/", paths.html);
        updateDir("./css/", paths.css);
        updateDir("./images/", paths.images);
        copyDir("./js/serviceWorker.js", paths.js + "serviceWorker.js");
        copyDir("./manifest.json", paths.manifest);
        bundleJs();

        console.log('successfully packed');
    }
    catch (err) {
        console.error(err);
    }
}

main();