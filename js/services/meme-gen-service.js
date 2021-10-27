'use strict'

const gImgs = _createImgs();
var gMeme = createMeme(2);

// ------------ get from model functions ------------

function getUrlOfMemeImg() {
    const imgId = gMeme.selectedImgId;
    return gImgs.find(img => img.id === imgId).url;
}

function getLineText(lineIdx) {
    return gMeme.lines[lineIdx].txt;
}

function getMemeLines() {
    return gMeme.lines;
}

function getImgs() {
    return gImgs;
}

// ------------ change model functions ------------

function addLineToMeme(txt) {
    const line = {
        txt,
        size: 50,
        align: 'center',
        color: '#fff'
    }
    gMeme.lines.push(line);
}

function restartMeme(imgId) {
    gMeme = createMeme(imgId);
}

// ------------ create functions ------------

function createMeme(selectedImgId) {
    return {
        selectedImgId,
        selectedLineIdx: 0,
        lines: [
            // {
            //     txt: 'first line text',
            //     size: 50,
            //     align: 'center',
            //     color: '#fff'
            // }
        ]
    }
}

function _createImgs() {
    return [
        {id: 1, url: 'meme-imgs/1.jpg', keywords: ['satisfaction']},
        {id: 2, url: 'meme-imgs/2.jpg', keywords: ['satisfaction']}
    ]
}