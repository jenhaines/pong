var animate = window.requestAnimationFrame ||
   window.webkitRequestAnimationFrame ||
   window.mozRequestAnimationFrame ||
   window.oRequestAnimationFrame ||
   window.msRequestAnimationFrame ||
   function(callback) { window.setTimeout(callback, 1000/60)};

window.onload = function(){
 animate(step);
};

var step = function(){
 update();
 render();
 animate(step);
};

var update = function(){
};


var c = document.getElementById('canvas');
var width = 600;
var height = 500;
c.width = width;
c.height = height; 
var ctx = c.getContext('2d'); 

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

 function PlayerOne(){
   this.paddle = new Paddle(40, 250, 10, 80);
 }

 function PlayerTwo(){
   this.paddle = new Paddle(550, 250, 10, 80);
 }

 PlayerOne.prototype.render = function(){
   this.paddle.render();
 };

 PlayerTwo.prototype.render = function(){
   this.paddle.render();
 };

 var keysDown = {};

 window.addEventListener("keydown", function(event){
   keysDown[event.keyCode] = true;
 });

 window.addEventListener("keyup", function(event){
   delete keysDown[event.keyCode];
 });

 PlayerOne.prototype.update = function(){
   for(var key in keysDown ){
     var value = Number(key);
       if(value == 37) { // left arrow 
         this.paddle.move(-4);
       } else if (value == 39){ // right arrow
         this.paddle.move(4);
       } else {
         this.paddle.move(0);
       }
   }
 };

 PlayerTwo.prototype.update = function(){
   for(var key in keysDown ){
     var value = Number(key);
       if(value == 188) { // left arrow 
         this.paddle.move(-4);
       } else if (value == 190){ // right arrow
         this.paddle.move(4);
       } else {
         this.paddle.move(0);
       }
   }
 };


 Paddle.prototype.move = function(y) {
   this.y += y;
   this.speed = y;
   if(this.y < 0) {
     this.y = 0;
     this.speed = 0;
   } else if (this.y + this.height > 500) {
     this.y = 500 - this.height;
     this.speed = 0;
   }
 };

 function Ball(x, y){
   this.x = x;
   this.y = y;
   this.x_speed = 0;
   this.y_speed = 3;
   this.width = 8;
   this.height = 8;
 };

 Ball.prototype.render = function(){
   ctx.beginPath();
   ctx.rect(this.x, this.y, this.width, this.height);
   ctx.fillStyle = "#fff";
   ctx.fill();
 };

 Ball.prototype.update = function(){
  this.x += this.x_speed;
  this.y += this.y_speed;
  var top_x = this.x - 5;
  var top_y = this.y - 5;
  var bottom_x = this.x + 5;
  var bottom_y = this.y + 5;

  if (this.y - 5 < 0) {
      this.y = 5;
      this.y_speed = -this.y_speed;
  } else if (this.y + 5 > 500) {
      this.y = 495;
      this.y_speed = -this.y_speed;
  }

  if (this.x < 0 || this.x > 60) {
      this.y_speed = 0;
      this.x_speed = 3;
      this.y = 0;
      this.x = 0;
  }

  if (top_x > 300) {
      if (top_x < (PlayerOne.x + PlayerOne.height) && bottom_x > PlayerOne.x && top_y < (PlayerOne.y + PlayerOne.width) && bottom_y > PlayerOne.y) {
          this.x_speed = -3;
          this.y_speed += (PlayerOne.y_speed / 2);
          this.x += this.x_speed;
      }
  } else {
      if (top_x < (PlayerTwo.x + PlayerTwo.height) && bottom_x > PlayerTwo.x && top_y < (PlayerTwo.y + PlayerTwo.width) && bottom_y > PlayerTwo.y) {
          this.x_speed = 3;
          this.y_speed += (PlayerTwo.y_speed / 2);
          this.x += this.x_speed;
      }
  }
 };

 var playerone = new PlayerOne();
 var playertwo = new PlayerTwo();
 var ball = new Ball(300, 0);

 var render = function(){
   ctx.fillStyle = "#339966";
   ctx.fillRect(0, 0, width, height);
   ctx.fillStyle = "#FFF"
   ctx.fillRect(300, 10, 4, 480);
   playerone.render();
   playertwo.render();
   ball.render();
 };

 var update = function(){
   playerone.update();
   playertwo.update();
   ball.update();
 };
