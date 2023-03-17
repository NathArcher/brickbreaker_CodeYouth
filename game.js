//Canvas Element
const canvas = document.getElementById ('canvas');
const content = canvas.getContext ("2d");

canvas.style.border = "1px solid #OFF"
//defines life variable, score variable and level variable
let LIFE = 3; //give player 3 lives
let SCORE = 0; 
const scoreUnit = 1;
let updateScore = document.querySelector ('#score');
let LEVEL = 1;
const youWIN = 3;
let gameOver = false;

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
        strokeColor: '#222323',
    }
    
    let bricks = [];

    //defines rows and colums for bricks
    function createBricks (){
    for (let r = 0; r < brick.row; r++){
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++){
            bricks [r][c] = {
                x: c* ( brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r* (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: true
            }
        }
    }}

    createBricks();
    
    function drawBricks(){
        for (let r = 0; r < brick.row; r++){
            for (let c = 0; c < brick.column; c++){
                let b = bricks[r][c];
                if (b.status){
                    content.fillStyle = brick.fillColor;
                    content.fillRect (b.x, b.y, brick.width, brick.height);

                    content.strokeStyle = brick.styleColor;
                    content.strokeRect (b.x, b.y, brick.width, brick.height);
                }
            
            }
        }
    }
    
//Paddle
//defines the paddles width, height and placement on the canvas
const paddleW = 100;
const paddleH = 20;
const paddleBottomMargin = 100;

//defines the paddle's dimmensions and width within the paddle variable
const paddle = {
    x:canvas.width / 2 - paddleW/2,
    y:canvas.height - paddleH - paddleBottomMargin,
    width:paddleW,
    height:paddleH,
    fillColor: "#222323",//assigns color to the paddle
    dx:5 //pixels the paddle will move to the right/left
} 
//creates the paddle on the canvas
function drawPaddle () {
content.fillStyle = paddle.fillColor;
content.fillRect (paddle.x, paddle.y, paddle.width, paddle.height);
}

drawPaddle ();

//Ball
//defines the ball size and placement
const ballRadius = 8;
const ball = {
    x : canvas.width/2,
    y : paddle.y - ballRadius,
    radius : ballRadius,
    speed :  4,
    dx : 3 + (Math.random() * 2 -1),
    dy: -3
}

//creates and colors the ball
function drawBall (){
    content.beginPath ();
    content.arc (ball.x, ball.y, ball.radius, 0, Math.PI*2);
    
    content.fillStyle = '#222323';
    content.fill ();
    
    content.strokeStyle = '#222323';
    content.stroke ();
    
    content.closePath ();
}
//Mouse

//Keys
//this sets the default for each key to false unless eventlistener picks up keypress
leftArrow = false;
rightArrow = false;

//Event Listener

//this lets the game know if the user presses down the left/right key
document.addEventListener ("keydown", function (event){
    if (event.keyCode == 37){
        leftArrow = true;
    }else if (event.keyCode == 39) {
        rightArrow = true ;
    }
});

//this lets the game know if the user lets go of the left/right key
document.addEventListener ("keyup", function (event){
    if (event.keyCode == 37){
        leftArrow = false;
    }else if (event.keyCode ==  39){
        rightArrow = false;
    }
});


//Functions for objects on canvas




//Gameplay

function movePaddle(){
    if (rightArrow && paddle.x + paddle.width < canvas.width){
        paddle.x += paddle.dx;
    }else if (leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx;
    }
}

function moveBall (){ 
    ball.x += ball.dx;
    ball.y += ball.dy;
}

//reset the ball if the ball goes off the bottom of the canvas
function resetBall (){
    ball.x = canvas.width/2;
    ball.y = paddle.y - ballRadius;
    ball.dx = 3 * (Math.random () * 2-1);
    ball.dy = -3;
}

//if ball hits wall it will bounce off wall
function ballWallCollision (){
    if (ball.x+ball.radius > canvas.width || ball.x - ball.radius <0 ) {
        ball.dx = - ball.dx ;
    }
    if (ball.y-ball.radius <0 ){
        ball.dy =- ball.dy;
    }
    if (ball.y + ball.radius > canvas.height){
        LIFE -- ;
        resetBall ();
        showLifePoints (LIFE);
    }}

//if ball hits paddle it will bounce off paddle
function ballPaddleCollision (){
    if (ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + 
        paddle.height && ball.y > paddle.y) {
            //ball and paddle collision point
            let collidePoint = ball.x - (paddle.x + paddle.width/2)
            collidePoint = collidePoint / (paddle.width/2);
            //calculate angle of the ball
            let angle = collidePoint * Math.PI/3;

            ball.dx = ball.speed * Math.sin (angle);
            ball.dy = - ball.speed * Math.cos (angle);
        }}

//if ball hits brick it will break
function ballBrickCollision(){
    for (let r = 0; r < brick.row; r++){
        for (let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            if (b.status) {
                if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height){
                    ball.dy = - ball.dy;
                    //make the brick break
                    b.status = false
                    //raise the score
                    SCORE += scoreUnit;
                }
            }
        }
    }
}

//check level/increase difficulty
function levelUp(){
let isLevelDone = true;
for(let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++){
        isLevelDone = isLevelDone && ! bricks[r][c].status;
    }
}
if (isLevelDone) {
    if (LEVEL >= youWIN){
        gameOver = true;
        //add in funciton to display GAME COMPLETE 
        return;
    }
    brick.row++;
    createBricks();
    ball.speed += 0.5;
    resetBall();
    LEVEL++;
}}

// Game over
function endGame (){
    if (LIFE <= 0){
        gameOver = true;
    }
}

// Game stats

function showLifePoints(lifeCount){
    // clear previous life images
    content.clearRect(0, 0, 150, 30);
    // draw heart images for each remaining life
    for (let i = 0; i < lifeCount; i++) {
        content.drawImage(LPImg, i * 35, 5, width = 30, height = 30);
    }
}

function showLevel (text, textX, textY){
    //draw text
    content.fillstyle = "#222323";
    content.font = "15px Dot Gothica";
    content.fillText (text, textX, textY);

    
}


function draw (){
    drawPaddle ();
    drawBall ();
    drawBricks();
    //show life points
    showLifePoints (LIFE);
    //show Level
    showLevel ("Level: " + LEVEL, canvas.width - 80, 25);
    //show Score
    updateScore.textContent = (SCORE);
}

function update () {
    movePaddle ();
    moveBall ();
    ballWallCollision();
    ballPaddleCollision();
    ballBrickCollision();
    endGame ();
    levelUp();
}
//Game Loop
function loop () {
    content.drawImage (bgImg, 0, 0);
    draw ();
    update ();

    if (! gameOver){
    requestAnimationFrame (loop);
}
}
loop ();
//