var animate = window.requestAnimationFrame ||
   window.webkitRequestAnimationFrame ||
   window.mozRequestAnimationFrame ||
   window.oRequestAnimationFrame ||
   window.msRequestAnimationFrame ||
   function(callback) { window.setTimeout(callback, 1000/60)};

var c = document.getElementById('canvas');
var width = 800;
var height = 600;
c.width = width;
c.height = height; 
var ctx = c.getContext('2d'); 
var playerone = new PlayerOne();
var playertwo = new PlayerTwo();
var ball = new Ball(400, 300);

var keysDown = {};

window.onload = function(){
 animate(step);
};

var render = function(){
  ctx.fillStyle = "#339966";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#FFF"
  ctx.fillRect(400, 10, 4, 580);
  playerone.render();
  playertwo.render();
  ball.render();
};

var update = function(){
  playerone.update();
  playertwo.update();
  ball.update(playerone.paddle, playertwo.paddle);
};


var step = function(){
 update();
 render();
 animate(step);
};

 function Paddle(x, y, width, height){
   this.x = x;
   this.y = y;
   this.width = width;
   this.height = height;
   this.speed = 0;
   // this.color = color;
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

 function PlayerOne(){
   this.paddle = new Paddle(50, 250, 10, 80);
 }

 function PlayerTwo(){
   this.paddle = new Paddle(750, 250, 10, 80);
 }

 PlayerOne.prototype.render = function(){
   this.paddle.render();
 };

 PlayerTwo.prototype.render = function(){
   this.paddle.render();
 };

 PlayerOne.prototype.update = function(){
   for(var key in keysDown ){
     var value = Number(key);
       if(value == 37) { // left arrow 
         this.paddle.move(0, 4);
       } else if (value == 39){ // right arrow
         this.paddle.move(0, -4);
       } else {
         this.paddle.move(0, 0);
       }
   }
 };

 PlayerTwo.prototype.update = function(){
   for(var key in keysDown ){
     var value = Number(key);
       if(value == 188) { // left arrow 
         this.paddle.move(0, -4);
       } else if (value == 190){ // right arrow
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
 };

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

  if (this.x < 0 || this.x > 800) {
      this.x_speed = 3;
      this.y_speed = 1;
      this.y = 300;
      this.x = 400;
  }
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