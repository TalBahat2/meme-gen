'use strict'

var gElCanvas;
var gCtx;
var gIsdrag = false;
var gDraggedLineIdx;
var gStartPos;
var gIsFrameDrawn = false;
const gFramePadding = 5;
const gMoveLineDiff = 10;
const gScreenBreakPoint = 550;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend'];


function init() {
    gElCanvas = document.querySelector('.my-canvas'); // maybe change my-canvas to id instead of class
    gCtx = gElCanvas.getContext('2d');
    addEventListeners();
    resizeCanvas();
    renderGallery();
    renderCanvas();
    setTextInInput();
    onChangeText(); // TODO: change to more readable code
}

function addEventListeners() {
    gElCanvas.addEventListener("click", () => gIsFrameDrawn = true);
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderCanvas();
    });
    gElCanvas.addEventListener('mousedown', onDown);
    gElCanvas.addEventListener('mousemove', onMove);
    gElCanvas.addEventListener('mouseup', onUp);
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
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

function renderSavedMemes() {
    const savedMemes = '';
}

// ------------ canvas functions ------------

function renderCanvas() {
    const imgUrl = getUrlOfMemeImg();
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
        if (gIsFrameDrawn) drawFrameAroundCurrLine();
        drawLinesOnCanvas();
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
    const poss = getLineFramePoss(getCurrLineIdx());
    gCtx.fillStyle = 'rgba(239,239,239, 0.5)';
    gCtx.fillRect(poss.x1, poss.y1, poss.dx, poss.dy);
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container')
    const windowWidth = window.innerWidth;
    if (windowWidth > gScreenBreakPoint) {
        if (gElCanvas.width === 300) {
            gElCanvas.width = 400;
            gElCanvas.height = 400;
        }
    } else {
        if (gElCanvas.width === 400) {
            gElCanvas.width = 300;
            gElCanvas.height = 300;
        }
    }
    // TODO: change the pos and font size of lines
    
    renderCanvas();
}

// ------------ event listeners ------------

function onSelectImg(imgId) {
    changeView('editor');
    restartMeme(imgId);
    setTextInInput();
    renderCanvas();
}

function onChangeText() {
    // TODO: insert code to mini functions, and then change deleteLine() in case lines.length === 1.
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
    const height = (!lastLineIdx) ? gElCanvas.height - 50 : gElCanvas.height / 2;
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

function onDeleteLine() {
    deleteLine();
    changeSelectedLineIdx(0);
    setTextInInput()
    renderCanvas();
}

function onChangeFontColor() {
    const color = document.querySelector('.font-color div input').value;
    changeFontColor(color);
    renderCanvas();
}

function onDown(ev) {
    const pos = getEvPos(ev);
    const clickedLineIdx = getClickedLineIdx(pos);
    if (clickedLineIdx === -1) {
        gIsFrameDrawn = false;
        renderCanvas();
        return;
    }
    gIsFrameDrawn = true;
    document.body.style.cursor = 'grabbing';
    changeSelectedLineIdx(clickedLineIdx);
    setTextInInput();
    gIsdrag = true;
    gStartPos = pos;
    gDraggedLineIdx = clickedLineIdx;
    renderCanvas();
}

function onMove(ev) {
    if (!gIsdrag) return;
    const draggedLineIdx = gDraggedLineIdx;
    const textPos = getCurrLinePos();
    const pos = getEvPos(ev);
    const dx = pos.x - gStartPos.x;
    const dy = pos.y - gStartPos.y;
    gStartPos = pos;
    const newPos = { x: textPos.x + dx, y: textPos.y + dy };
    changeCurrLinePos(textPos.x + dx, textPos.y + dy);
    renderCanvas();
}

function onUp() {
    gIsdrag = false;
    document.body.style.cursor = 'default'
}

function downloadImg(elLink) {
    gIsFrameDrawn = false;
    renderCanvas();
    // TODO: fix download with frame
    const imgContent = gElCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent;
}

// else

function setTextInInput() {
    const elInput = document.querySelector('.line-txt');
    elInput.value = getLineText(getCurrLineIdx()); // change to "getCurrLineText" and dont send idx.
}

function getEvPos(ev) {
    var pos = { x: ev.offsetX, y: ev.offsetY };
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos;
}

function getClickedLineIdx(pos) {
    const lines = getLines();
    return lines.findIndex((line, lineIdx) => {
        var { x1, y1, dx, dy } = getLineFramePoss(lineIdx);
        return pos.x > x1 && pos.x < x1 + dx &&
            pos.y > y1 && pos.y < y1 + dy
    })
}

function changeView(mode) {
    var elEditor = document.querySelector('.meme-editor');
    var elGallery = document.querySelector('.image-gallery');
    var elMemes = document.querySelector('.saved-memes');
    switch (mode) {
        case 'gallery':
            elEditor.classList.add('hidden');
            elMemes.classList.add('hidden');
            elGallery.classList.remove('hidden');
            break;
        case 'editor':
            elMemes.classList.add('hidden');
            elGallery.classList.add('hidden');
            elEditor.classList.remove('hidden');
            break;
        case 'memes':
            elEditor.classList.add('hidden');
            elGallery.classList.add('hidden');
            elMemes.classList.remove('hidden');
            renderSavedMemes();
            break;
    }
}