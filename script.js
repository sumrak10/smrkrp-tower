var tg = window.Telegram.WebApp;

var
    cvs     = document.getElementById('canvas'),
    ctx     = cvs.getContext('2d'),
    wWidth  = window.innerWidth,
    wHeight = window.innerHeight;

tg.expand()
cvs.width = wWidth;
cvs.height = wHeight;

function mapInt(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function clearCanvas() {
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, wWidth, wHeight );
    ctx.closePath();
}
function loop() {
    clearCanvas();
    // window.requestAnimationFrame(draw);
}

window.onload = function() {
    console.log(tg.viewportHeight)
    tg.MainButton.hide();
    setInterval(loop, 100/60); //10 fpc
    // window.requestAnimationFrame(draw);
};