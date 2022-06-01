var tg = window.Telegram.WebApp;
tg.expand();
var
    cvs     = document.getElementById('canvas'),
    ctx     = cvs.getContext('2d'),
    wWidth  = window.innerWidth,
    wHeight = window.innerHeight;

cvs.width = wWidth;
cvs.height = wHeight;

var audio = new Audio();
audio.src = 'sounds/tapped.mp3';

var game = false,
    gameover = false,
    restart = false,
    gameOverShadowBlur = 15,
    gameShadowBlur = 15;
// const colors = ['#2F2ABF','#F2BE22','#F23005','#D9D9D9']
// const bg_color = '#122459'
const colors = ['#048ABF','#04B2D9','#05DBF2','#05F2F2']
const bg_color = [10,10,100]
// bg_color = tg.ThemeParams.bg_color;
if (tg.ready()) {
    colors = [tg.ThemeParams.bg_color,
            tg.ThemeParams.text_color,
            tg.ThemeParams.hint_color,
            tg.ThemeParams.link_color,
            tg.ThemeParams.button_color,
            tg.ThemeParams.button_text_colorString]
}
let isRight = true;

var boxes = [[wWidth/2-100,0,200,30,'#048ABF','Старт']];
var level = 0;
var speed = 2;

var boxWidth = 200;
var boxHeight = 30;
var boxX = -boxWidth;
var boxColor = colors[getRandomInt(4)];
var clippedBox = [];
var clippedBoxColor = [255,255,255];
let r = bg_color[0],
    g = bg_color[1],
    b = bg_color[2];

const times = [];
let fps;
function gameLoop() {
    clearCanvas('rgb('+r+','+g+','+b+')');
    if (game && !restart) {
        //main
        if (r >= bg_color[0]) {
            r = r - 10;
        }
        if (g >= bg_color[1]) {
            g = g - 10;
        }
        if (b >= bg_color[2]) {
            b = b - 10;
        }
        if (clippedBoxColor[0] >= bg_color[0]) {
            clippedBoxColor[0] = clippedBoxColor[0] - 10;
        }
        if (clippedBoxColor[1] >= bg_color[1]) {
            clippedBoxColor[1] = clippedBoxColor[1] - 10;
        }
        if (clippedBoxColor[2] >= bg_color[2]) {
            clippedBoxColor[2] = clippedBoxColor[2] - 10;
        }
        if (gameShadowBlur > 15) {
            gameShadowBlur = gameShadowBlur -1;
        }
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
        if (!gameover) {
            drawRect(boxX,wHeight/2-boxHeight,boxWidth,boxHeight,boxColor,'',gameShadowBlur);

            if ((clippedBoxColor[0] >= bg_color[0]) || (clippedBoxColor[1] >= bg_color[1]) || (clippedBoxColor[2] >= bg_color[2])) {
                drawRect(clippedBox[0],wHeight/2-clippedBox[1],clippedBox[2],clippedBox[3],'rgb('+clippedBoxColor[0]+','+clippedBoxColor[1]+','+clippedBoxColor[2]+')','',0,'rgb('+clippedBoxColor[0]+','+clippedBoxColor[1]+','+clippedBoxColor[2]+')');
            }
        }
        for (let i=0;i<boxes.length;i++) {
            if (!gameover) {
                drawRect(boxes[i][0],wHeight/2+boxes[i][1],boxes[i][2],boxes[i][3],boxes[i][4],boxes[i][5],gameOverShadowBlur);
            } else {
                drawRect(boxes[i][0],wHeight/2+boxes[i][1],boxes[i][2],boxes[i][3],boxes[i][4],boxes[i][5],gameOverShadowBlur);
            }
        }
        //main end
    } 
    if (!game && !gameover) {
        clearCanvas('rgb('+r+','+g+','+b+')');
        drawStartButton(wWidth/2-100,wHeight/2,200,30,'#048ABF', 'Старт');
    }
    if (gameover) {
        r = r - 2;
        g = g - 2;
        b = b - 2;
        speed = 0;
        gameOverShadowBlur = gameOverShadowBlur - 0.3;
        if (r <= 0 && g <= 0 && b <= 0) {
            gameover = false;
            restart = true;
        }
        drawRect(lastbox[0],wHeight/2+lastbox[1],lastbox[2],lastbox[3],lastbox[4]);
        lastbox[1] = lastbox[1]+0.5;
    }
    if (restart) {
        if (r <= bg_color[0]) {
            r = r + 5;
        }
        if (g <= bg_color[1]) {
            g = g + 5;
        }
        if (b <= bg_color[2]) {
            b = b + 5;
        }
        ctx.fillStyle = "white";
        ctx.font = "50px RobotoRegular";
        ctx.textAlign = 'center'
        ctx.fillText('Счет: '+(level-1), wWidth/2,wHeight/2-50);
        drawStartButton(wWidth/2-100,wHeight/2,200,30,'#048ABF', 'Рестарт');
        tg.MainButton.text = 'Готово';
        tg.MainButton.color = colors[0];
        tg.MainButton.textColor = '#ffffff';
        tg.MainButton.show();
    }
    //fps
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    ctx.fillStyle = "white";
    ctx.font = "15px Arial";
    ctx.fillText(fps, 10, 15);
    // fps end
    window.requestAnimationFrame(gameLoop);
}
window.onload = function() {
    console.log('v1.0');
    cvs.addEventListener("touchstart", handleStart, false);
    Telegram.WebApp.onEvent('mainButtonClicked', function(){
        tg.sendData("level: " + level+' '+tg.ThemeParams.bg_color+
        tg.ThemeParams.text_color+
        tg.ThemeParams.hint_color+
        tg.ThemeParams.link_color+
        tg.ThemeParams.button_color+
        tg.ThemeParams.button_text_colorString);
    });
    
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
    
    if (now1 < last1) {
        if (now2 < last1) {
            gameover = true;
        }
        clippedBox = [now1,0,last1-now1,30]
        now1 = last1;
    }
    if (now2 > last2) {
        if (now1 > last2) {
            gameover = true;
        } 
        clippedBox = [last2,0,now2-last2,30]
        now2 = last2;
    }
    if (!gameover) {
        audio.play();
        r = 150;
        g = 150;
        b = 150;
        gameShadowBlur = 60;
        clippedBoxColor = [255,255,255];
        boxes.push([now1,0,now2-now1,boxHeight,boxColor,level]);
    } else {
        boxes = shiftBoxes(boxes,true);
        lastbox = [boxX,-boxHeight,boxWidth,boxHeight,boxColor]
    }
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


function shiftBoxes(arr,invert=false) {
    let newarr = [];
    for (let i=0; i<arr.length;i++) {
        if (!invert) {
            newarr.push([arr[i][0],arr[i][1]+boxHeight,arr[i][2],arr[i][3],arr[i][4],arr[i][5]]);
        } else {
            newarr.push([arr[i][0],arr[i][1]-boxHeight,arr[i][2],arr[i][3],arr[i][4],arr[i][5]]);
        }
    }
    if (newarr.length > 15) {
        newarr.shift();
    }
    return newarr;
}
function handleStart(evt) {
    evt.preventDefault();
    if (game) {
        tapped();
    } else {
        game = true;
    }
    if (restart) {
        level = 0;
        boxes = [[wWidth/2-100,0,200,30,'#048ABF','Рестарт']];
        speed = 2;

        r = bg_color[0];
        g = bg_color[1];
        b = bg_color[2];

        boxWidth = 200;
        boxHeight = 30;
        boxX = -boxWidth;
        boxColor = colors[getRandomInt(4)];

        game = false;
        gameover = false;
        gameOverShadowBlur = 15;

        isRight = true;
        restart = false;
        game = true;

        clippedBox = [];
    }
    
    // console.log("touchstart.");
    // var touches = evt.changedTouches;
    // console.log(touches[0].clientX, touches[0].clientY)
}

function mapInt(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function clearCanvas(color='#122459') {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, wWidth, wHeight );
    ctx.closePath();
}
function drawRect(x1,y1,x2,y2,color='white',text='',shb,strokestyle='white') {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = shb;
    ctx.fillRect(x1,y1,x2,y2);
    ctx.strokeStyle= strokestyle;
    ctx.lineWidth = 0.3;
    ctx.strokeRect(x1,y1,x2,y2);
    ctx.fillStyle = "white";
    ctx.font = "25px RobotoRegular";
    ctx.textAlign = 'center'
    if (x2 >= 30) {
        ctx.fillText(text, x1+x2/2, y1+y2/2+8);
    } else {
        ctx.fillText(text, x1+x2/2-60, y1+y2/2+8);
    }
    ctx.closePath();
}
function drawStartButton(x1,y1,x2,y2,color='white',text='cтарт',shadowBlur=15) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = shadowBlur;
    ctx.fillRect(x1,y1,x2,y2);
    ctx.strokeStyle= 'white';
    ctx.lineWidth = 0.3;
    ctx.strokeRect(x1,y1,x2,y2);
    ctx.fillStyle = "white";
    ctx.font = "25px RobotoRegular";
    ctx.textAlign = 'center'
    ctx.fillText(text, x1+x2/2, y1+y2/2+8);
    ctx.closePath();
}