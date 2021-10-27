'use strict'

var gElCanvas;
var gCtx;

function init() {
    gElCanvas = document.querySelector('.my-canvas'); // maybe change my-canvas to id instead of class
    gCtx = gElCanvas.getContext('2d');
    // resizeCanvas();
    renderGallery();
    renderCanvas();
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
    }
}

function drawLinesOnCanvas() {
    const lines = getMemeLines();
    lines.forEach((line, idx) => {
        // TODO: set correct x
        var x = (gElCanvas.width - 18 * line.txt.length) / 2;
        var y;
        if (idx === 0) y = 80;
        else if (idx === 1) y = gElCanvas.height - 50;
        else y = gElCanvas.height / 2 + 50;
        drawLineOnCanvas(line, { x: x, y: y })
    })
}

function drawLineOnCanvas(line, pos) {
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = line.color;
    gCtx.font = `${line.size}px IMPACT`;
    gCtx.fillText(line.txt, pos.x, pos.y);
    gCtx.strokeText(line.txt, pos.x, pos.y);
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
}

// ------------ event listeners ------------

function onAddLine() {
    const txt = document.querySelector('.line-txt').value;
    if (!txt) return;
    addLineToMeme(txt);
    drawLinesOnCanvas();
    document.querySelector('.line-txt').value = '';
}

function onSelectImg(imgId) {
    restartMeme(imgId);
    renderCanvas();
}