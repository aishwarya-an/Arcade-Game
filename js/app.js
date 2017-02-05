// Constants
var PLAYER_BOTTOM_BOUNDARY = 405;
var PLAYER_RIGHT_BOUNDARY = 900;
var PLAYER_X = 400;
var LIVES = 3;

// Global variables
// Audio files needed to indicate collision
var collisionAudio = new Audio('audio/loseLife.wav');
var getGemAudio = new Audio('audio/getGem.wav');
// Variable representing the game state
var playing = false;
// Variable representing the character the player selects
var selectedPlayer;
// Array containing all player characters
var characters = ['images/char-boy.png',
  'images/char-cat-girl.png',
  'images/char-horn-girl.png',
  'images/char-pink-girl.png',
  'images/char-princess-girl.png'
];


/*******************  Selector class ****************/
/* @description The selector used for character selection
 * @constructor
 */
var Selector = function() {
  this.sprite = 'images/Selector.png';
  this.x = 152;
  this.y = 380;
  // selected represents the column of the character selected.
  this.selected = 0;
};

// @description Renders the selector to the page
Selector.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* @description Handles the movement ofthe seleector and on pressing 'enter'
 * the game begins. Called by EventListener
 * @param {string} input - the value of the keypress
 */
Selector.prototype.handleInput = function(input) {
  if (input == 'left' && this.x - 101 >= 152) {
    this.x -= 101;
    this.selected--;
  } else if (input == 'right' && this.x + 101 <= 566) {
    this.x += 101;
    this.selected++;
  } else if (input == 'enter') {
    // On pressing enter, a new game begins with 3 lives and 0 score.
    selectedPlayer = this.selected;
    playing = true;
    playerLife.lives = LIVES;
    score.score = 0;
    player.reset();
  }
};
/********************End of selector class********************/


/******************Enemy class*************************/
/* @description Enemies our player must avoid
 * @constructor
 * @param {number} y - the y-co-ordinate of the enemy
 * @param {number} speed - the speed of enemy moving
 */
var Enemy = function(y, speed) {
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  this.x = 0;
  this.y = y;
  this.speed = speed;
  this.width = 80;
  this.height = 70;
};


/* @description Updates the enemy's position, required method for game
 * @param {number} dt - a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
  // The dt parameter will ensure the game runs at the same speed for
  // all computers.

  // Checking whether the enemy runs out of canvas
  if (this.x + (this.speed * 5 * dt) < 905)
    this.x += this.speed * 5 * dt;
  else
    this.x = -5;
};


// @description Draws the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/***********************End of Enemy class***********************/


/********************Player class**************************/
/* @description Player of the game
 * @constructor
 */
var Player = function() {
  this.x = PLAYER_X;
  this.y = PLAYER_BOTTOM_BOUNDARY;
  this.sprite = characters[selectedPlayer];
  this.width = 35;
  this.height = 40;
};


/* @description Updates the player's position if the player has moved out 
 * of boundary
 */
Player.prototype.update = function() {
  // If player has moved out of the left boundary
  if (this.x < 0)
    this.x = 0;
  // If the player has moved out of the right boundary
  else if (this.x > PLAYER_RIGHT_BOUNDARY)
    this.x = PLAYER_RIGHT_BOUNDARY;
  // If the player has reached the river, then increase score by 20
  if (this.y <= 0) {
    score.increase(20);
    this.reset();
    playing = false;
  } else if (this.y > PLAYER_BOTTOM_BOUNDARY)
    this.y = PLAYER_BOTTOM_BOUNDARY;

  // Check for collisions with enemies
  this.checkCollisions(allEnemies);

  // Check for collisions with gems
  this.catchGems(allGems);
};


// @description Draws the player on the screen
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/* @description Moves the player in case of key presses. 
 * Called by the document's EventListener() for key presses.
 * @param {string} input - a string containing the value of keypress
 */
Player.prototype.handleInput = function(input) {
  if (input == 'left' && this.x - 100 >= 0)
    this.x -= 100;
  if (input == 'up' && this.y - 70 >= 0)
    this.y -= 83;
  if (input == 'right' && this.x + 100 < PLAYER_RIGHT_BOUNDARY)
    this.x += 100;
  if (input == 'down' && this.y + 83 <= PLAYER_BOTTOM_BOUNDARY)
    this.y += 83;
};


/* @description Resets the game, either in case of player reaching the river or 
 * in case of player colliding with enemy.
 */
Player.prototype.reset = function() {
  this.x = PLAYER_X;
  this.y = PLAYER_BOTTOM_BOUNDARY;
  this.sprite = characters[selectedPlayer];
};


/* @description Checks for collisions of the player with the enemies and 
 * resets the game if the player has collided with the enemy.
 * @param {Object[]} enemies - an array of all the enemies
 */
Player.prototype.checkCollisions = function(enemies) {
  // Iterate through every enemy
  for (var i = 0; i < enemies.length; i++) {
    // Check whether the player and the enemy collide 
    if (this.x < enemies[i].x + enemies[i].width &&
      this.x + this.width > enemies[i].x &&
      this.y < enemies[i].y + enemies[i].height &&
      this.y + this.height > enemies[i].y) {
      // If so, then reset the game after 100ms.
      playerLife.decrease();
      collisionAudio.play();
      this.reset();
    }
  }
};


/* @description Checks if the player got gems and increments score if yes.
 * @param {Object[]} gems - an array containing all the gems
 */
Player.prototype.catchGems = function(gems) {
  // Iterate through every gem
  for (var i = 0; i < gems.length; i++) {
    // Check whether the player and gem collide
    if (Math.abs(this.x - gems[i].x) < 30 &&
      Math.abs(this.y - gems[i].y) < 30) {
      // If so, increase score and remove the gem.
      score.increase(30);
      getGemAudio.play();
      gems[i].x = 1000;
    }
  }
};
/*********************End of Player class***************************/


/********************Life class****************************/
/* @description Life of the player
 * @constructor
 */
var Life = function() {
  this.lives = LIVES;
  this.sprite = 'images/Heart.png';
};


// description Draws the lives on the canvas
Life.prototype.render = function() {
  for (var i = 0, j = 10; i < this.lives; i++, j += 40)
    ctx.drawImage(Resources.get(this.sprite), j, 540, 40, 50);
};


/* @description Removes a life in case of collisions and resets the game
 * if the player loses all lives
 */
Life.prototype.decrease = function() {
  this.lives--;
  if (!this.lives) {
    // If the player loses all lives, then game ends.
    playing = false;
  }
};
/********************End of Life class***************************/


/*********************Score class************************/
/* @description Score of the game
 * @constructor
 */
var Score = function() {
  this.score = 0;
};

// @description Draws the score on the screen
Score.prototype.render = function() {
  ctx.font = "25pt Impact";
  ctx.strokeStyle = "white";
  ctx.fillStyle = "black";
  ctx.strokeText("SCORE:" + this.score.toString(), 360, 580);
  ctx.fillText("SCORE:" + this.score.toString(), 360, 580);
};

/* @description Increases the score if the player reaches the river(by 20) or 
 * gets a gem(by 30) or a key(by 50).
 * @param {number} points - Score gets incremented by this value. 
 */
Score.prototype.increase = function(points) {
  this.score += points;
};
/**********************End of Score class**************************/


/********************Gem class*****************************/
/* @description Gems that the player has to get
 * @constructor
 * @param {number} x - the x co-ordinate of the gem
 * @param {number} y - the y co-ordinate of the gem
 */
var Gem = function(x, y) {
  this.sprite = 'images/Gem\ Blue.png';
  this.x = x;
  this.y = y;
};


// @description Draws the gem on the canvas
Gem.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/*********************End of Gem class********************/


// @description Utility function
function initLoad() {
  selector = new Selector();
}

/* This function draws the main menu of the game. The main menu is used to 
 * choose the type of player. This is called at the end of the game i.e
 * if the player wins or loses.
 */
function menu() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 905, 606);
  // Displaying the game description
  var gameDescription1 =
    "Collect all Gems, avoid the Bugs and reach the Water to win!";
  var gameDescription2 = "Use arrow keys to move your player";
  var gameDescription3 = "...Good Luck!";
  var gameDescription4 = "Score increases by:";
  var gameDescription5 = "30 if you collect gems";
  var gameDescription6 = "20 if you reach the river";
  ctx.font = '15pt Verdana';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'black';
  ctx.fillText(gameDescription1, 400, 78);
  ctx.fillText(gameDescription2, 400, 110);
  ctx.fillText(gameDescription4, 400, 160);
  ctx.fillText(gameDescription5, 400, 200);
  ctx.fillText(gameDescription6, 400, 240);
  ctx.fillText(gameDescription3, 400, 310);
  ctx.font = "bold 15pt Verdana";
  ctx.fillText("YOUR SCORE IS: " + score.score, 400, 280);
  // Displaying the characters for the player to choose
  ctx.font = "bold 15pt Verdana";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText("Choose your Player using arrow keys. Press Enter to Start Game",
    400, 360);

  selector.render();
  for (var i = 0; i < characters.length; i++)
    ctx.drawImage(Resources.get(characters[i]), i * 101 + 152, 380);
}

// Instantiating the Enemy, Player, Life, Score and Gem class to run the game
var allEnemies = [new Enemy(60, 90), new Enemy(145, 50), new Enemy(225, 40),
  new Enemy(60, 25), new Enemy(145, 60), new Enemy(305, 85)
];
var player = new Player();
var playerLife = new Life();
var score = new Score();
var allGems = [new Gem(400, 60), new Gem(800, 145), new Gem(100, 145)];


/* @description Listens for key presses and sends the keys to the
 * player.handleInput() method.
 */
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    13: 'enter',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  
  // To check state of the game in which the keys are used and call the 
  // corresponding input handling method.
  if (playing)
    player.handleInput(allowedKeys[e.keyCode]);
  else
    selector.handleInput(allowedKeys[e.keyCode]);
});
