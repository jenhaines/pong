window.requestAnimFrame = (function(){
  return window.requestAnimationFrame ||
  function(callback){
    return window.setTimeout(callback, 1000 / 60);
  };
})();

window.cancelRequestAnimFrame = (function(){
  return window.cancelAnimationFrame ||
  clearTimeout
})();
  

var c = document.getElementById('canvas');
var ctx = c.getContext('2d'); 

var W = window.innerWidth;
var H = window.innerHeight;
var cw = 800;
var ch = 600;
c.width = cw;
c.height = ch;
var points = 0;
var over = 0;
var rect = c.getBoundingClientRect();

c.addEventListener("mousedown", btnClick, true);

// Start Button object
var startBtn = {
  w: 100,
  h: 50,
  x: cw/2 - 50,
  y: ch/2 - 25,

  draw: function(){
    ctx.strokeStyle = "white";
    ctx.lineWidth = "2";
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    ctx.font = "18px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.fillText("Start", cw/2, ch/2 );
  }
};

var restartBtn = {
  w: 100,
  h: 50,
  x: cw/2 - 50,
  y: ch/2 - 25,

  draw: function() {
    Net = {};

    ctx.strokeStyle = "white";
    ctx.lineWidth = "2";
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    ctx.font = "18px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStlye = "white";
    ctx.fillText("Restart", cw/2, ch/2);
  }
};

var Net = {
  x: 400,
  y: 10,
  nw: 4,
  nh: 580,
    draw: function(){
    ctx.fillStyle = "#FFF";
    ctx.fillRect(this.x, this.y, this.nw, this.nh);
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

// On button click (Restart and start)
function btnClick(e) {
  // Variables for storing mouse position on click
  var mx = e.pageX - rect.left;
  var my = e.pageY - rect.top;
  // Click start button
  if(mx >= startBtn.x && mx <= startBtn.x + startBtn.w) {
    step();

    // Delete the start button after clicking it
    startBtn = {};
  }

  // If the game is over, and the restart button is clicked
  if(over == 1) {
    if(mx >= restartBtn.x && mx <= restartBtn.x + restartBtn.w) {
        ball.x = 20;
        ball.y = 20;
        points = 0;
        ball.vx = 4;
        ball.vy = 8;
        step();

        over = 0;
    }
  }
}


var computer = new Computer();
var player = new Player();
var ball = new Ball(400, 300);

var keysDown = {};

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
  requestAnimFrame(step);
  render();
  update();
}

function startScreen(){
  Court.draw();
  startBtn.draw();
}

function Paddle(x, y, width, height){
 this.x = x;
 this.y = y;
 this.width = width;
 this.height = height;
 this.speed = 0;
}

// Function for updating score
function updateScore() {
  ctx.fillStyle = "white";
  ctx.font = "16px Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Score: " + points, 20, 20 );
}

function gameOver() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Game Over - You scored "+points+" points!", cw/2, ch/2 + 50 );
  // Stop the Animation
  Net = {};
  cancelRequestAnimFrame();

  // Set the over flag
  over = 1;

  // Show the restart button
  restartBtn.draw();
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
      diff = -5;
    } else if(diff > 0 && diff > 4) { // max speed down
      diff = 5;
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
       if(value == 37) { // left arrow 
         this.paddle.move(0, -4);
       } else if (value == 39){ // right arrow
         this.paddle.move(0, 4);
       } else {
         this.paddle.move(0, 0);
       }
   }
 };

 function Ball(x, y){
   this.x = x;
   this.y = y;
   this.x_speed = 3;
   this.y_speed = 1;
   this.width = 10;
   this.height = 10;
 }

 Ball.prototype.render = function(){
   ctx.beginPath();
   ctx.rect(this.x, this.y, this.width, this.height);
   ctx.fillStyle = "#fff";
   ctx.fill();
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
  } else if (this.y + 10 > 600) {
      this.y = 590;
      this.y_speed = -this.y_speed;
  }

  if (this.x < 0){
    points++;
    this.x_speed = 3;
    this.y_speed = 1;
    this.y = 300;
    this.x = 400;
  }

  if (this.x > 800){
    gameOver();
  }

  // if (this.x < 0 || this.x > 800) {
  //     if (this.x < 0) points++ ;
  //     this.x_speed = 3;
  //     this.y_speed = 1;
  //     this.y = 300;
  //     this.x = 400;
  // }
  if (top_x > 400) {
      if (top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x && top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y) {
          this.x_speed = -3;
          this.y_speed += (paddle2.y_speed / 2);
          this.x += this.x_speed;
      }
  } else {
      if (top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x && top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y) {
          this.x_speed = 3;
          this.y_speed += (paddle1.y_speed / 2);
          this.x += this.x_speed;
      }
  }
 };

 window.addEventListener("keydown", function(event){
   keysDown[event.keyCode] = true;
 });

 window.addEventListener("keyup", function(event){
   delete keysDown[event.keyCode];
 });
 
 startScreen();



