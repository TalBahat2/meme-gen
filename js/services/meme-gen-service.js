'use strict'

const gImgs = _createImgs();
const KEY = 'memes';
var gMeme = createMeme(2);
var gMemes;
var gFontDiff = 5;

_createMemes();

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

function getLines() {
    return gMeme.lines;
}

function getLineFramePoss(lineIdx) {
    const currLine = gMeme.lines[lineIdx];
    gCtx.font = `${currLine.size}px IMPACT`
    const textWidth = gCtx.measureText(currLine.txt).width;
    const textHeight = (!!currLine.txt) ? gCtx.measureText(currLine.txt).actualBoundingBoxAscent + gCtx.measureText(currLine.txt).actualBoundingBoxDescent : 40;
    const textPos = currLine.pos;
    const x1 = gFramePadding;
    const y1 = textPos.y - textHeight - gFramePadding;
    const dx = gElCanvas.width - 2 * gFramePadding;
    const dy = textHeight + 2 * gFramePadding;
    return { x1, y1, dx, dy };
}

function getLinePos(lineIdx) {
    return gMeme.lines[lineIdx].pos;
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
        pos: { x: gElCanvas.width / 2, y: height },
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

function deleteLine() {
    if (gMeme.lines.length === 1) return;
    const currLineIdx = getCurrLineIdx();
    gMeme.lines.splice(currLineIdx, 1);
}

function changeFontColor(color) {
    const currLine = getCurrLine();
    currLine.color = color;
}

function changeLinePos(lineIdx, pos) {
    gMeme.lines[lineIdx].pos = pos;
}

// ------------ create functions ------------

function createMeme(selectedImgId, txt='text here') {
    return {
        selectedImgId,
        selectedLineIdx: 0,
        lines: [
            {
                txt,
                size: 50,
                align: 'C',
                color: '#fff',
                pos: { x: 130, y: 60 },
            }
        ]
    }
}

function _createImgs() {
    return [
        { id: 1, url: 'meme-imgs/1.jpg', keywords: ['satisfaction'] },
        { id: 2, url: 'meme-imgs/2.jpg', keywords: ['satisfaction'] },
        { id: 3, url: 'meme-imgs/3.jpg', keywords: ['satisfaction'] },
        { id: 4, url: 'meme-imgs/4.jpg', keywords: ['satisfaction'] },
        { id: 5, url: 'meme-imgs/5.jpg', keywords: ['satisfaction'] },
        { id: 6, url: 'meme-imgs/6.jpg', keywords: ['satisfaction'] },
        { id: 7, url: 'meme-imgs/7.jpg', keywords: ['satisfaction'] },
        { id: 8, url: 'meme-imgs/8.jpg', keywords: ['satisfaction'] },
        { id: 9, url: 'meme-imgs/9.jpg', keywords: ['satisfaction'] },
        { id: 10, url: 'meme-imgs/10.jpg', keywords: ['satisfaction'] },
        { id: 11, url: 'meme-imgs/11.jpg', keywords: ['satisfaction'] },
        { id: 12, url: 'meme-imgs/12.jpg', keywords: ['satisfaction'] },
    ]
}

function _createMemes() {
    var memes = loadFromStorage(KEY)
    if (!memes || !memes.length) {
        memes = [];
        memes.push(createMeme(1, 'example'));
    }
    console.log('memes',memes);
    gMemes = memes;
    _saveMemesToStorage();
}

function _saveMemesToStorage() {
    saveToStorage(KEY, gMemes);
}