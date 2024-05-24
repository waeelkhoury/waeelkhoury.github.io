let canvas, context, player, enemy, gameover, backgroundImage;
let blocks = []; // Array to hold the block objects

function gameInit() {
    canvas = document.getElementById('gameCanvas');
    context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    newscale = window.innerHeight / 1000;
    gameover = false;
    player = new Player(100, 0, 50, 100); 
    enemy = new Enemy(player, canvas.width, canvas.height);
    timer = 45;
    collectedCoins = 0;
    gameover = false;

    // Load background image
    backgroundImage = new Image();
    backgroundImage.src = 'https://waeelkhoury.github.io/game-development/Battleground2.png'; 

    // Create blocks
    blocks = [
        new Block(300 * newscale , canvas.height - (500 * newscale), 300 * newscale , 120 * newscale,'https://waeelkhoury.github.io/game-development/padd.png'),
        new Block(750 * newscale, canvas.height - (700 * newscale), 300 * newscale , 120 * newscale,'https://waeelkhoury.github.io/game-development/padd.png'),
        new Block(1200 * newscale, canvas.height - (500 * newscale), 300 * newscale, 120 * newscale,'https://waeelkhoury.github.io/game-development/padd.png')
        ];

    coins = [
        new Coin(500 * newscale , canvas.height - (700 * newscale), 70 * newscale, 230 * newscale, 'https://waeelkhoury.github.io/game-development/coin.png'),
        new Coin(840 * newscale, canvas.height - (870 * newscale), 70 * newscale, 230 * newscale, 'https://waeelkhoury.github.io/game-development/coin.png'),
        new Coin(840 * newscale, canvas.height - (400 * newscale), 70 * newscale, 230 * newscale, 'https://waeelkhoury.github.io/game-development/coin.png'),
        new Coin(1320 * newscale, canvas.height - (680 * newscale), 70 * newscale, 230 * newscale, 'https://waeelkhoury.github.io/game-development/coin.png'),
        new Coin(1320 * newscale, canvas.height - (400 * newscale), 70 * newscale, 230 * newscale, 'https://waeelkhoury.github.io/game-development/coin.png')
    ];
    

    // Ensure the background image is fully loaded before starting the game loop
    backgroundImage.onload = () => {
        gameUpdate();
    };

    setupEventListeners();  // Setup keyboard event listeners
    startTimer();
}

function gameUpdate()
 {
    if (gameover) {
        return; // Stop the game update loop if game is over
    }
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background image
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Draw blocks
    blocks.forEach(block => block.draw(context));

    coins.forEach(coin => {
        coin.draw(context);
        if (coin.collect(player)) {
            collectedCoins++;
            console.log('Coin collected! Total:', collectedCoins);
        }
    });

    // Apply gravity and update positions
    player.applyGravity(canvas.height, blocks);
    enemy.applyGravity(canvas.height, blocks);
    //timer 
    drawTimer(context);
    // Draw coin counter
    drawCoinCounter(context);
    // Draw player and enemy
    player.draw(context);
    player.drawHealthBar(context);
    enemy.followPlayer();
    enemy.draw(context);
    enemy.drawHealthBar(context, canvas.width);

    

    

    // Check for collisions and determine the winner
    checkCollision(player, enemy);
    if (checkWinner(enemy) || checkWinner(player)) {
        return;
    } else {
        requestAnimationFrame(gameUpdate);
    }
}

function drawCoinCounter(context) {
    context.fillStyle = 'yellow';
    context.font = `${40 * newscale}px Arial`;
    context.fillText(`Coins: ${collectedCoins}`, (canvas.width /2) - (70 * newscale) , 140 * newscale);
}


function startTimer()
 {
    timerInterval = setInterval(() => {
        timer--;
        if (timer <= 0) {
            clearInterval(timerInterval);
            gameover = true;
            showGameOver("Time's up! you won "+ collectedCoins + ' coins');
        }
    }, 1000);
}

function drawRoundedRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
    context.fill();
}

function drawTimer(context) 
{
    context.fillStyle = 'grey';
    drawRoundedRect(context, (canvas.width / 2) - (100 * newscale), 35 * newscale, 220 * newscale, 140 * newscale, 20 * newscale); context.fillStyle = 'white';
    context.font = `${50 * newscale}px Arial`;
    context.fillText(`Time: ${timer}`, (canvas.width /2) - (90 * newscale) , 90 * newscale);
}

function checkCollision(player, enemy) {
    if (player.isAttacking) {
        // Check collision on the right side
        const attackRight = {
            x: player.x + player.width,
            y: player.y + player.height / 2 - player.attackHeight / 2,
            width: player.attackWidth,
            height: player.attackHeight
        };

        // Check collision on the left side
        const attackLeft = {
            x: player.x - player.attackWidth,
            y: player.y + player.height / 2 - player.attackHeight / 2,
            width: player.attackWidth,
            height: player.attackHeight
        };

        if ((attackRight.x < enemy.x + enemy.width && attackRight.x + attackRight.width > enemy.x && attackRight.y < enemy.y + enemy.height && attackRight.y + attackRight.height > enemy.y) ||
            (attackLeft.x < enemy.x + enemy.width && attackLeft.x + attackLeft.width > enemy.x && attackLeft.y < enemy.y + enemy.height && attackLeft.y + attackLeft.height > enemy.y)) {
            if (enemy.health > 0) {
                enemy.health -= 1;
            }
        }
    }

    if (enemy.isAttacking) {
        // Check collision on the right side
        const attackRight = {
            x: enemy.x + enemy.width,
            y: enemy.y + enemy.height / 2 - enemy.attackHeight / 2,
            width: enemy.attackWidth,
            height: enemy.attackHeight
        };

        // Check collision on the left side
        const attackLeft = {
            x: enemy.x - enemy.attackWidth,
            y: enemy.y + enemy.height / 2 - enemy.attackHeight / 2,
            width: enemy.attackWidth,
            height: enemy.attackHeight
        };

        if ((attackRight.x < player.x + player.width && attackRight.x + attackRight.width > player.x && attackRight.y < player.y + player.height && attackRight.y + attackRight.height > player.y) ||
            (attackLeft.x < player.x + player.width && attackLeft.x + attackLeft.width > player.x && attackLeft.y < player.y + player.height && attackLeft.y + attackLeft.height > player.y)) {
            if (player.health > 0) {
                player.health -= 1;
            }
        }
    }
}

function showGameOver(message) {
    const gameOverModal = document.getElementById('gameOverModal');
    const gameOverMessage = document.getElementById('gameOverMessage');
    gameOverMessage.textContent = message;
    gameOverModal.style.display = 'flex';
}

function checkWinner(character) {
    if (character.health <= 0) {
        gameover = true;
        if (character === player) {
            showGameOver("You died.");
        } else {
            showGameOver("You won " + (collectedCoins + 10) + " coins");
        }
        return true;
    }
    return false;
}

const keysPressed = {};

function setupEventListeners() {
    window.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;

        if (keysPressed['d'] && keysPressed[' ']) {
            player.moveRight(canvas.width);
            player.jump();
        } else if (keysPressed['d']) {
            player.moveRight();
        } else if (keysPressed['a'] && keysPressed[' ']) {
            player.moveLeft(canvas.width);
            player.jump();
        } else if (keysPressed['a']) {
            player.moveLeft();
        } else if (keysPressed[' ']) {
            player.jump();
        }

        if (keysPressed['k']) {
            player.attack();
        }
    });

    window.addEventListener('keyup', (event) => {
        keysPressed[event.key] = false;
        if (!keysPressed['d'] && !keysPressed['a']) {
            player.stopMoving();
        }
    });
}

//window.onload = gameInit;