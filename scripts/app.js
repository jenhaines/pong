// load google font == Press Start 2P
WebFontConfig = {
  google:{ families: ['Press+Start+2P::latin'] },
  active: function(){startScreen();},
};
(function(){
  var wf = document.createElement("script");
  wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.async = 'true';
  document.head.appendChild(wf);
})();


window.requestAnimFrame = (function(){
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
  function(callback){
    return window.setTimeout(callback, 1000 / 60);
  };
})();

window.cancelRequestAnimFrame = (function(){
  return window.cancelAnimationFrame ||
  window.webkitCancelRequestAnimationFrame    ||
  window.mozCancelRequestAnimationFrame       ||
  window.oCancelRequestAnimationFrame     ||
  window.msCancelRequestAnimationFrame        ||
  clearTimeout
})();

var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var cw=canvas.width;
var ch=canvas.height;
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
var sndCollide = new buzz.sound('sounds/pong.wav');
var sndPaddleCollide = new buzz.sound('sounds/pong2.wav');
var sndPongEnd = new buzz.sound('sounds/pongEnd.wav');
var sndWinning = new buzz.sound('sounds/winning.wav');
var W = window.innerWidth;
var H = window.innerHeight;
var cw = 800;
var ch = 600;
c.width = cw;
c.height = ch;
var init;
var pointsP = 0;
var pointsC = 0;
var over = 0;
var rect = c.getBoundingClientRect();

c.addEventListener("mousedown", btnClick, true);
window.addEventListener("keydown", function(event){
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event){
  delete keysDown[event.keyCode];
});

// Start Button object
var startBtn = {
  w: 125,
  h: 50,
  x: cw/2 - 50,
  y: ch/2 - 25,

  draw: function(){
    with(ctx){
      strokeStyle = "white";
      lineWidth = "2";
      strokeRect(335, 273, this.w, this.h);
      textAlign = "center";
      textBaseline = "middle";
      fillStyle = "white";
      font = "20px 'Press Start 2P'";
      fillText("Start", cw/2, ch/2 );
      fillText("Want to play some Pong?", 400, 120);
      fillText("Use right and left arrow", 400, 160);
      fillText("keys to move paddle!", 400, 200);
    }
  }
};

var restartBtn = {
  w: 150,
  h: 50,
  x: cw/2 - 75,
  y: ch/2 - 25,

  draw: function() {
    with(ctx){
      strokeStyle = "white";
      lineWidth = "2";
      strokeRect(this.x, this.y, this.w, this.h);
      font = "20px 'Press Start 2P";
      textAlign = "center";
      textBaseline = "middle";
      fillStlye = "white";
      fillText("Restart", cw/2, ch/2);
    }
  }
};

var Court = {
  x: 0,
  y: 0,
  cw: W,
  ch: H,
  draw: function(){
    ctx.fillStyle = "#339966";
    ctx.fillRect(this.x, this.y, this.cw, this.ch);
  }
};

var Net = {
  x: 400,
  y: 10,
  cw: 6,
  ch: ch - 20,
  draw: function(){
    ctx.fillStyle = "#fff";
    ctx.fillRect(this.x, this.y, this.cw, this.ch);
  },
  clear: function(){
    ctx.fillStyle = "#339966";
    ctx.fillRect(this.x, this.y, this.cw, this.ch);
  }
};

var computer = new Computer();
var player = new Player();
var ball = new Ball(400, 300);

var keysDown = {};

function Paddle(x, y, width, height){
 this.x = x;
 this.y = y;
 this.width = width;
 this.height = height;
}

// Function for updating score
function updateScore() {
  with(ctx){
    font = "64px 'Press Start 2P'";
    textBaseline = "top";
    textAlign = "left";
    fillText(pointsC, 200, 10 );
    fillText(pointsP, 560, 10 );
  }
}

Paddle.prototype.render = function(){
   ctx.fillStyle = "#0000FF";
   ctx.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if(this.y < 0) {
      this.y = 0;
      this.y_speed = 0;
    } else if (this.y + this.height > 600) {
      this.y = 600 - this.height;
      this.y_speed = 0;
    }
  };

 function Computer(){
   this.paddle = new Paddle(80, 250, 10, 80);
 }

 function Player(){
   this.paddle = new Paddle(720, 250, 10, 80);
 }

 Computer.prototype.render = function(){
   this.paddle.render();
 };

 Player.prototype.render = function(){
   this.paddle.render();
 };

 Computer.prototype.update = function(){
  var y_pos = ball.y;
    var diff = -((this.paddle.y + (this.paddle.height / 2)) - y_pos);
    if(diff < 0 && diff < -4) { // max speed up
      diff = -4;
    } else if(diff > 0 && diff > 4) { // max speed down
      diff = 4;
    }
    this.paddle.move(0,diff);
    if(this.paddle.y < 0) {
      this.paddle.y = 0;
    } else if (this.paddle.y + this.paddle.height > 600) {
      this.paddle.y = 600 - this.paddle.height;
    }
 };

 Player.prototype.update = function(){
   for(var key in keysDown ){
     var value = Number(key);
       if(value == 39) { // left arrow 
         this.paddle.move(0, -5);
       } else if (value == 37){ // right arrow
         this.paddle.move(0, 5);
       } else {
         this.paddle.move(0, 0);
       }
   }
 };

// Make random y coordinate for serves
 function randServe(){
  return Math.floor((Math.random() * (3 + 3)) - 3);
 };

 function Ball(x, y){
   this.x = x;
   this.y = y;
   this.x_speed = 3;
   this.y_speed = randServe();
   this.width = 10;
   this.height = 10;
 }


 Ball.prototype.render = function(){
  with(ctx){
   beginPath();
   rect(this.x, this.y, this.width, this.height);
   fillStyle = "#fff";
   fill();
  }
 };

 Ball.prototype.update = function(paddle1, paddle2){
  this.x += this.x_speed;
  this.y += this.y_speed;
  var top_x = this.x - 4;
  var top_y = this.y - 4;
  var bottom_x = this.x + 4;
  var bottom_y = this.y + 4;

  if (this.y - 10 < 0) {
      this.y = 10;
      this.y_speed = -this.y_speed;
      sndCollide.play();
  } else if (this.y + 10 > 600) {
      this.y = 590;
      this.y_speed = -this.y_speed;
      sndCollide.play();
  }

  if (this.x < 0){
    pointsP++;
    this.x_speed = 3;
    this.y_speed = 2;
    this.y = 300;
    this.x = 400;
    if(pointsP == 4) gameOver();
  }

  if (this.x > 800){
    pointsC++;
    this.x_speed = 3;
    this.y_speed = randServe();
    this.y = 300;
    this.x = 400;
    if (pointsC == 4) gameOver();
  }

  if (top_x > 400) {
      if (top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x && top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y) {
          this.x_speed = -3;
          this.y_speed += (paddle2.y_speed / 2);
          this.x += this.x_speed;
          sndPaddleCollide.play();
      }
  } else {
      if (top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x && top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y) {
          this.x_speed = 3;
          this.y_speed += (paddle1.y_speed / 2);
          this.x += this.x_speed;
          sndPaddleCollide.play();
      }
  }
 };

 function gameOver() {
   Net.clear();
   ctx.fillStyle = "white";
   ctx.font = "20px 'Press Start 2P";
   ctx.textAlign = "center";
   ctx.textBaseline = "middle";
   if (pointsP > pointsC){
    displayText = 'You Won! ';
    sndWinning.play();
   }else{
    displayText = 'You Lost! ';
    sndPongEnd.play();
   }

   ctx.fillText("Game Over -  " + displayText, cw/2, ch/2 + 50);
   ctx.fillText("You scored " + pointsP + " points!", cw/2, ch/2 + 80 );
   // Stop the Animation
   cancelRequestAnimFrame(init);

   // Set the over flag
   over = 1;

   // Show the restart button
   restartBtn.draw();
 }

 // On button click (Restart and start)
 function btnClick(e) {
   // Variables for storing mouse position on click
   var mx = e.pageX - rect.left;
   var my = e.pageY - rect.top + 22;
   // Click start button
   if((mx >= startBtn.x && mx <= startBtn.x + startBtn.w) && (my >= startBtn.y && my <= startBtn.y + startBtn.h)) {
      finalCountdown();

     // Delete the start button after clicking it
     startBtn = {};
   }

   // If the game is over, and the restart button is clicked
   if(over == 1) {
     if((mx >= restartBtn.x && mx <= restartBtn.x + restartBtn.w) && (my >= restartBtn.y && my <= restartBtn.y + restartBtn.h)) {
        // If restart set random angle for bar
         ball.x = 400;
         ball.y = 300;
         points = 0;
         ball.x_speed = 4;
         ball.y_speed = randServe();
         //Reset score
         pointsP = 0;
         pointsC = 0;

          // step();
         over = 0;

        finalCountdown();
     }
   }
 }

function finalCountdown(){
  var i = 3;
  var int = setInterval(function(){
    with(ctx){
      font = "80px 'Press Start 2P'";
      fillStyle = "#339966";
      fillRect(0, 0, cw, ch);
      fillStyle = "#fff";
      fillText(i, 400, 200 );
      fill();
    }
    i--;
    if (i < 0) {
      clearInterval(int);
      step();
    }
  }, 1000);
};

 var update = function(){
   computer.update();
   player.update();
   ball.update(computer.paddle, player.paddle);
   updateScore();
 };

 var render = function(){
   Court.draw();
   Net.draw();
   computer.render();
   player.render();
   ball.render();
 };

 function step(){
   init = requestAnimFrame(step);
   render();
   update();
 }

 function startScreen(){
   Court.draw();   
   startBtn.draw();
 }
 