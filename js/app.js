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
    this.x = 0;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Place the player object in a variable called player

// Placing all enemies in an array.
var allEnemies = [new Enemy(60, 100), new Enemy(145, 50), new Enemy(225, 80), 
    new Enemy(60, 25), new Enemy(145, 150)];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

// player.handleInput(allowedKeys[e.keyCode]);
});
