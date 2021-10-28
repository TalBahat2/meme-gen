'use strict'

const gImgs = _createImgs();
var gMeme = createMeme(2);
var gFontDiff = 5;

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

function getLastLineIdx() {
    return gMeme.lines.length - 1;
}

function getCurrLineIdx() {
    return gMeme.selectedLineIdx;
}

function getCurrLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function getCurrTextWidth() {
    const currLine = getCurrLine();
    gCtx.font = `${currLine.size}px IMPACT`
    return gCtx.measureText(currLine.txt).width;
}

function getCurrTextHeight() {
    const currLine = getCurrLine();
    gCtx.font = `${currLine.size}px IMPACT`
    return gCtx.measureText(currLine.txt).actualBoundingBoxAscent + gCtx.measureText(currLine.txt).actualBoundingBoxDescent;
}

function getCurrLinePos() {
    const currLine = getCurrLine();
    return currLine.pos;
}

// ------------ check functions ------------

function isLinesEmpty() {
    return !gMeme.lines.length;
}

// ------------ change model functions ------------

function addLineToMeme(height) {
    const line = {
        txt: '',
        size: 50,
        align: 'center',
        color: '#fff',
        pos: { x: gElCanvas.width / 2, y: height }
    }
    gMeme.lines.push(line);
}

function restartMeme(imgId) {
    gMeme = createMeme(imgId);
}

function changeSelectedLineIdx(selectedLineIdx) {
    gMeme.selectedLineIdx = selectedLineIdx;
}

function changeCurrLineFont(sign) {
    const currLineIdx = gMeme.selectedLineIdx;
    gMeme.lines[currLineIdx].size += sign * gFontDiff;
}

function changeCurrLineText(txt) {
    const currLineIdx = gMeme.selectedLineIdx;
    gMeme.lines[currLineIdx].txt = txt;
}

function changeCurrLinePos(x, y) {
    var currLine = getCurrLine();
    currLine.pos.x = x;
    currLine.pos.y = y;
}

function changeAlign(align) {
    const currLine = getCurrLine();
    currLine.align = align;
}

// ------------ create functions ------------

function createMeme(selectedImgId) {
    return {
        selectedImgId,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'text here',
                size: 50,
                align: 'C',
                color: '#fff',
                pos: { x: 170, y: 60 }
            }
        ]
    }
}

function _createImgs() {
    return [
        { id: 1, url: 'meme-imgs/1.jpg', keywords: ['satisfaction'] },
        { id: 2, url: 'meme-imgs/2.jpg', keywords: ['satisfaction'] }
    ]
}