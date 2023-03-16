//Canvas Element
const canvas = document.getElementById ('canvas');
const content = canvas.getContext ("2d");

canvas.style.border = "1px solid #OFF"

let canvasBgImg = new Image ();
canvasBgImg.src = '/whiteBG.jpg'

//Bricks
    //creates and defines the brick variable
    const brick = {
        row :3,
        column : 12,
        width: 55,
        height: 20,
        offSetLeft: 10,
        offSetTop: 20,
        marginTop: 40,
        fillColor: '#222323',
    }
    
    let bricks = [];

    //defines rows and colums for bricks
    function createBricks (){
    for (let r=0; r< brick.row; r++){
        bricks[r] = [];
        for (let c= 0; c<brick.column; c++){
            bricks [r][c] = {
                x: c* ( brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r* (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: true
            }
        }
    }}

    createBricks();
    
    function drawBricks() {
        for (let r=0; r< brick.row; r++){
            for (let c= 0; c<brick.column; c++){
                let b = bricks [r][c]
                if (b.status){
                    content.fillStyle = brick.fillColor
                    content.fillRect (b.x, b.y, brick.width, brick.height);
                }
            
            }
        }
    }
    

//Paddle
const paddleW = 100;
const paddleH = 20;
const paddleBottomMargin = 100;

const paddle = {
    x:canvas.width / 2 - paddleW/2,
    y:canvas.height - paddleH - paddleBottomMargin,
    width:paddleW,
    height:paddleH,
    dx:5 //pixels the paddle will move to the right/left
} 
function drawPaddle () {
content.fillStyle = '#222323';
content.fillRect (paddle.x, paddle.y, paddle.width, paddle.height);
}


//Ball
const ballRadius = 8;
const ball = {
    x : canvas.width/2,
    y : paddle.y - ballRadius,
    radius : ballRadius,
    speed :  4,
    dx : 3 + (Math.random() * 2 -1),
    dy: -3
}

function drawBall (){
    content.beginPath ();
    content.arc (ball.x, ball.y, ball.radius, 0, Math.PI*2);
    
    content.fillStyle = '#222323';
    content.fill ();
    
    content.strokeStyle = '#222323';
    content.stroke ();
    
    content.closePath ();
}
//Mouse - Event Listener

//Keys - Event Listener
leftArrow = false;
rightArrow = false;
document.addEventListener ("keydown", function (event){
    if (event.keyCode == 37){
        leftArrow = true;
    }else if (event.keyCode == 39) {
        rightArrow = true ;
    }
});
document.addEventListener ("keyup", function (event){
    if (event.keyCode == 37){
        leftArrow = false;
    }else if (event.keyCode ==  39){
        rightArrow = false;
    }
});

//Functions for objects on canvas
function movePaddle(){
    if (rightArrow && paddle.x + paddle.width < canvas.width){
        paddle.x += paddle.dx;
    }else if (leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx;
    }
}

function draw (){
    drawPaddle ();
    drawBall ();
    drawBricks ();
    }
function update () {
        movePaddle ();
    }
//Gameplay
function loop () {
    content.drawImage (canvasBgImg, 0, 0);
    draw ();
    update ()
    requestAnimationFrame (loop);
}
loop ();
//