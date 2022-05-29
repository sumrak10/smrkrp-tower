var tg = window.Telegram.WebApp;
tg.expand()
var
    cvs     = document.getElementById('canvas'),
    ctx     = cvs.getContext('2d'),
    wWidth  = window.innerWidth,
    wHeight = window.innerHeight;

cvs.width = wWidth;
cvs.height = wHeight;

var isRight = true;
var i = 1;
const times = [];
let fps;
function gameLoop() {
    clearCanvas();
    drawRect(i,100,100,100,'white');
    if (i == wWidth-100) {
        isRight = false;
    } 
    if (i == 0){
        isRight = true;
    }
    if (isRight) {
        i++;
    } else {
        i--;
    }

    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    ctx.fillStyle = "white";
    ctx.font = "Regular 15pt Arial";
    ctx.fillText(fps, 5, 10);
    window.requestAnimationFrame(gameLoop);
}
window.onload = function() {
    // setInterval(gameLoop, 1000/10); //10 fpc
    window.requestAnimationFrame(gameLoop);
};


function mapInt(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function clearCanvas() {
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, wWidth, wHeight );
    ctx.closePath();
}
function drawRect(x1,y1,x2,y2,color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x1,y1,x2,y2);
    ctx.closePath();
}