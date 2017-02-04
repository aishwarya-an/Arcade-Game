// Constants
var PLAYER_BOTTOM_BOUNDARY = 405;
var PLAYER_RIGHT_BOUNDARY = 500;
var PLAYER_X = 200;


// Enemies our player must avoid
// Parameter: y, the y-co-ordinate of the enemy
// Parameter: speed, the speed of enemy moving
var Enemy = function(y, speed) {
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  this.x = 0;
  this.y = y;
  this.speed = speed;
  this.width = 50;
  this.height = 70;
};


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // The dt parameter will ensure the game runs at the same speed for
  // all computers.

  // Checking whether the enemy runs out of canvas
  if(this.x + (this.speed * 5 * dt) < 505)
    this.x += this.speed * 5 * dt;
  else
    this.x = -5;
};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Player class 
var Player = function() {
  this.x = PLAYER_X;
  this.y = PLAYER_BOTTOM_BOUNDARY;
  this.sprite = 'images/char-cat-girl.png';
  this.width = 35;
  this.height = 40;
};


// Update the player's position if the player has moved out of boundary
Player.prototype.update = function() {
  // If player has moved out of the left boundary
  if(this.x < 0)
    this.x = 0;
  // If the player has moved out of the right boundary
  else if(this.x > PLAYER_RIGHT_BOUNDARY)
    this.x = PLAYER_RIGHT_BOUNDARY;
  // If the player has reached the river, then reset the game after 500ms
  if(this.y <= 0){
    // p is used in the setTimeout callback instead of 'this' because the
    // 'this' in setTimeout callback does not refer to the Player instance
    // Hence, 'this' is stored in p.
    var p = this;
    setTimeout(function(){
        p.reset();
        }, 500);
  }
  else if(this.y > PLAYER_BOTTOM_BOUNDARY)
    this.y = PLAYER_BOTTOM_BOUNDARY;

  // Check for collisions with enemies
  this.checkCollisions(allEnemies);
};


// Draw the player on the screen
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Moves the player in case of key presses.
// Called by the document's EventListener() for key presses.
// Parameter: input, a string containing the value of keypress
Player.prototype.handleInput = function(input) {
  if(input == 'left' && this.x - 100 >= 0)
    this.x -= 100;
  if(input == 'up' && this.y - 70 >= 0)
    this.y -= 83;
  if(input == 'right' && this.x + 100 < PLAYER_RIGHT_BOUNDARY)
    this.x += 100;
  if(input == 'down' && this.y + 83 < PLAYER_BOTTOM_BOUNDARY)
    this.y += 83;
};


// Resets the game, either in case of player reaching the river or 
// in case of player colliding with enemy.
Player.prototype.reset = function(){
  this.x = PLAYER_X;
  this.y = PLAYER_BOTTOM_BOUNDARY;
};


// Checks for collisions of the player with the enemies and resets the game
// the player has collided with the enemy.
// Parameter: enemies, an array of all the enemies
Player.prototype.checkCollisions = function(enemies){
  // player stores 'this' so that it can be used in the setTimeout callback
  // with the correct binding.
  var player = this;

  // Iterate through every enemy
  for(var i = 0; i < enemies.length; i++){
    // Check whether the player and the enemy collide 
    if(player.x < enemies[i].x + enemies[i].width && 
        player.x + player.width > enemies[i].x &&
        player.y < enemies[i].y + enemies[i].height &&
        player.y + player.height > enemies[i].y){
      // If so, then reset the game after 100ms.
      setTimeout(function(){
          player.reset();
          }, 100);
    }
  }
};


// Placing all enemies in an array.
var allEnemies = [new Enemy(60, 90), new Enemy(145, 50), new Enemy(225, 40), 
    new Enemy(60, 25), new Enemy(145, 60)];

// Instantiating the Player class. 
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};
  
  player.handleInput(allowedKeys[e.keyCode]);
});
