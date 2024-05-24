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
    timer = 60;

    // Load background image
    backgroundImage = new Image();
    backgroundImage.src = 'https://waeelkhoury.github.io/game-development/Battleground2.png'; 

    // Create blocks
    blocks = [
        new Block(300 * newscale , canvas.height - (500 * newscale), 300 * newscale , 120 * newscale,'https://github.com/waeelkhoury/waeelkhoury.github.io/blob/main/game-development/padd.png'),
        new Block(750 * newscale, canvas.height - (700 * newscale), 300 * newscale , 120 * newscale,'https://github.com/waeelkhoury/waeelkhoury.github.io/blob/main/game-development/padd.png'),
        new Block(1200 * newscale, canvas.height - (500 * newscale), 300 * newscale, 120 * newscale,'https://github.com/waeelkhoury/waeelkhoury.github.io/blob/main/game-development/padd.png')
        ];
    

    // Ensure the background image is fully loaded before starting the game loop
    backgroundImage.onload = () => {
        gameUpdate();
    };

    setupEventListeners();  // Setup keyboard event listeners
    startTimer();
}

function gameUpdate() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background image
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Draw blocks
    blocks.forEach(block => block.draw(context));

    // Apply gravity and update positions
    player.applyGravity(canvas.height, blocks);
    enemy.applyGravity(canvas.height, blocks);

    // Draw player and enemy
    player.draw(context);
    player.drawHealthBar(context);
    enemy.followPlayer();
    enemy.draw(context);
    enemy.drawHealthBar(context, canvas.width);

    //timer 
    drawTimer(context);

    // Check for collisions and determine the winner
    checkCollision(player, enemy);
    if (checkWinner(enemy)) {
        alert("You won");
    } else if (checkWinner(player)) {
        alert("Game Over! The enemy won.");
    } else {
        requestAnimationFrame(gameUpdate);
    }
}

function startTimer()
 {
    timerInterval = setInterval(() => {
        timer--;
        if (timer <= 0) {
            clearInterval(timerInterval);
            gameover = true;
            alert("Time's up! Game Over.");
        }
    }, 1000);
}

function drawTimer(context) 
{
    context.fillStyle = 'white';
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

function checkWinner(character) {
    return character.health <= 0;
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

window.onload = gameInit;