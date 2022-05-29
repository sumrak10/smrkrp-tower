var tg = window.Telegram.WebApp;
tg.expand()
var
    cvs     = document.getElementById('canvas'),
    ctx     = cvs.getContext('2d'),
    wWidth  = window.innerWidth,
    wHeight = window.innerHeight;

cvs.width = wWidth;
cvs.height = wHeight;

var game = true;
// const colors = ['#2F2ABF','#F2BE22','#F23005','#D9D9D9']
// const bg_color = '#122459'
const colors = ['#048ABF','#04B2D9','#05DBF2','#05F2F2']
const bg_color = '#012E40'
let isRight = true;

var boxes = [[wWidth/2-75,0,170,30,'#048ABF']];
var level = 0;
var speed = 2;

var boxX = 1;
var boxWidth = 170;
var boxHeight = 30;
var boxColor = colors[getRandomInt(4)];


const times = [];
let fps;
function gameLoop() {
    let r = 30,
        g = 30,
        b = 170-level;
    clearCanvas('rgb('+r+','+g+','+b+')');
    //main
    if (boxX >= wWidth-boxWidth) {
        isRight = false;
    } 
    if (boxX <= 0){
        isRight = true;
    }
    if (isRight) {
        boxX=boxX+speed;
    } else {
        boxX=boxX-speed;
    }
    
    drawRect(boxX,wHeight/2-boxHeight,boxWidth,boxHeight,boxColor);
    for (let i=0;i<boxes.length;i++) {
        num = i*20;
        opacity = num.toString(16);
        if (opacity.length < 2) {
            opacity = '0'+opacity;
        }
        opacity = '00';
        // console.log(i,boxes[i][0])
        drawRect(boxes[i][0],wHeight/2+boxes[i][1],boxes[i][2],boxes[i][3],boxes[i][4])
    }
    //main end
    //fps
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    ctx.fillStyle = "white";
    ctx.font = "Regular 15pt Arial";
    ctx.fillText(fps, 5, 10);
    // fps end
    if (game) {
        window.requestAnimationFrame(gameLoop);
    } else {
        clearCanvas();
        console.log('GAME OVER!')
    }
}
window.onload = function() {
    cvs.addEventListener("touchstart", handleStart, false);
    // setInterval(gameLoop, 1000/10); //10 fpc
    window.requestAnimationFrame(gameLoop);
};
function tapped() {
    level = level + 1;
    speed = speed + 0.05;
    boxes = shiftBoxes(boxes);
    let now1 = boxX;
    let now2 = now1 + boxWidth;
    let last1 = boxes.at(-1)[0];
    let last2 = last1 + boxes.at(-1)[2];
    console.log(boxes.length);
    if (now1 < last1) {
        if (now2 < last1) {
            game = false;
        }
        now1 = last1;
    }
    if (now2 > last2) {
        if (now1 > last2) {
            game = false;
        } 
        now2 = last2;
    }
    boxes.push([now1,0,now2-now1,boxHeight,boxColor]);
    boxWidth = now2-now1;
    boxColor = colors[getRandomInt(4)];
    ch = getRandomInt(2)
    if (ch == 0) {
        boxX = 1;
        isRight = false;
    } else {
        boxX = wWidth-boxWidth;
        isRight = true;
    }
}

function mapInt(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function shiftBoxes(arr) {
    let newarr = [];
    for (let i=0; i<arr.length;i++) {
        newarr.push([arr[i][0],arr[i][1]+boxHeight,arr[i][2],arr[i][3],arr[i][4]]);
    }
    if (newarr.length > 15) {
        newarr.shift();
    }
    return newarr;
}
function handleStart(evt) {
    evt.preventDefault();
    tapped()
    // console.log("touchstart.");
    // var touches = evt.changedTouches;
    // console.log(touches[0].clientX, touches[0].clientY)
}
function clearCanvas(color='#122459') {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, wWidth, wHeight );
    ctx.closePath();
}
function drawRect(x1,y1,x2,y2,color='white',angle=0) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 7;
    ctx.rotate(angle * Math.PI / 180);
    ctx.fillRect(x1,y1,x2,y2);
    ctx.strokeStyle= 'white';
    ctx.lineWidth = 0.3;
    ctx.strokeRect(x1,y1,x2,y2);
    ctx.rotate(-angle * Math.PI / 180);
    ctx.closePath();
}
function drawLine(x1,y1,x2,y2,color='white') {
    ctx.beginPath();       
    // ctx.fillStyle = color;
    ctx.lineWidth = 15;
    ctx.moveTo(x1, y1);  
    ctx.lineTo(x2, y2);  
    ctx.stroke(); 
    // ctx.closePath();
}