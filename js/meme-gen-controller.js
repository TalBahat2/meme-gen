'use strict'

var gElCanvas;
var gCtx;
const gFramePadding = 5;
const gMoveLineDiff = 10;

function init() {
    gElCanvas = document.querySelector('.my-canvas'); // maybe change my-canvas to id instead of class
    gCtx = gElCanvas.getContext('2d');
    gElCanvas.addEventListener("click", ev => {
        console.log('x:', ev.offsetX, 'y:', ev.offsetY);
    });
    // resizeCanvas();
    renderGallery();
    renderCanvas();
    setTextInInput();
    onChangeText(); // TODO: change to more readable code
}

function renderGallery() {
    const imgs = getImgs();
    var strHTML = ``;
    strHTML = imgs.reduce((acc, img) => {
        return acc + `
        <div class="img-container" onclick="onSelectImg(${img.id})">
        <img src="${img.url}">
        </div>
        `
    }, strHTML)
    const elGallery = document.querySelector('.image-gallery');
    elGallery.innerHTML = strHTML;
}

// ------------ canvas functions ------------

function renderCanvas() {
    const imgUrl = getUrlOfMemeImg();
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
        drawLinesOnCanvas();
        drawFrameAroundCurrLine();
    }
}

function drawLinesOnCanvas() {
    const lines = getMemeLines();
    lines.forEach(line => drawLineOnCanvas(line));
}

function drawLineOnCanvas(line) {
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = line.color;
    gCtx.font = `${line.size}px IMPACT`;
    gCtx.fillText(line.txt, line.pos.x, line.pos.y);
    gCtx.strokeText(line.txt, line.pos.x, line.pos.y);
}

function drawFrameAroundCurrLine() {
    const textWidth = getCurrTextWidth();
    const textHeight = getCurrTextHeight();
    const textPos = getCurrLinePos();
    const x = gFramePadding;
    const y = textPos.y - textHeight - gFramePadding;
    gCtx.beginPath();
    gCtx.rect(x, y, gElCanvas.width - 2 * gFramePadding, textHeight + 2 * gFramePadding);
    gCtx.strokeStyle = 'grey';
    gCtx.stroke();
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
}

// ------------ event listeners ------------

function onSelectImg(imgId) {
    restartMeme(imgId);
    setTextInInput();
    renderCanvas();
}

function onChangeText() {
    const txt = document.querySelector('.line-txt').value;
    const currLine = getCurrLine();
    // model
    changeCurrLineText(txt);
    const currTextWidth = getCurrTextWidth();
    const newXPos = gElCanvas.width / 2 - currTextWidth / 2;
    changeCurrLinePos(newXPos, currLine.pos.y);
    // dom
    renderCanvas();
    setTextInInput();
}

function onAddLine() {
    const lastLineIdx = getLastLineIdx();
    const height = (!lastLineIdx) ? gElCanvas.height - 40 : gElCanvas.height / 2;
    addLineToMeme(height);
    changeSelectedLineIdx(getLastLineIdx());
    setTextInInput();
    renderCanvas();
}

function onChangeLineFont(sign) {
    if (isLinesEmpty()) return;
    // TODO: if font is too small/big, return
    changeCurrLineFont(sign);
    onChangeText(); // change to more readable
    renderCanvas();
}

function onMoveLine(directionSign) {
    if (isLinesEmpty()) return;
    const currPos = getCurrLinePos();
    changeCurrLinePos(currPos.x, currPos.y + directionSign * gMoveLineDiff);
    renderCanvas();
}

function onSwitchLinesFocus() {
    if (isLinesEmpty()) return;
    const currLineIdx = getCurrLineIdx();
    const nextLineIdx = (currLineIdx === getLastLineIdx()) ? 0 : currLineIdx + 1;
    changeSelectedLineIdx(nextLineIdx);
    setTextInInput();
    renderCanvas();
}

function onAlign(align) {
    const currPos = getCurrLinePos();
    var x;
    switch (align) {
        case 'L':
            x = gFramePadding * 2;
            break;
        case 'C':
            x = gElCanvas.width / 2 - getCurrTextWidth() / 2;
            break;
        case 'R':
            x = gElCanvas.width - getCurrTextWidth() - gFramePadding * 2;
            break;
    }
    changeCurrLinePos(x, currPos.y);
    changeAlign(align);
    renderCanvas();

}

// else

function setTextInInput() {
    const elInput = document.querySelector('.line-txt');
    elInput.value = getLineText(getCurrLineIdx());
}