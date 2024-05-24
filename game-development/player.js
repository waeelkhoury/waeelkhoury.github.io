// Player Class
class Player {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width * 8 * newscale; // Adjust the size as needed
        this.height = height * 5 * newscale; // Adjust the size as needed
        this.speed = 30; // Increase speed for running
        this.gravity = 0.5;
        this.velocityY = 0;
        this.health = 10000;
        this.maxHealth = 10000;
        this.isAttacking = false;
        this.isMoving = false; // Flag to track if the player is moving
        this.lastDirection = 'right'; // Track the last direction
        this.attackWidth = 30; // Define the attack width
        this.attackHeight = 10; // Define the attack height
        this.grounded = false;

        // Load sprite sheets
        this.sprites = {
            standing: new Image(),
            runningR: new Image(),
            runningL: new Image(),
            attackingR: new Image(),
            attackingL: new Image()
        };
        this.sprites.standing.src = '/Users/waeelkhoury/Desktop/game-development/Musketeer/Idle.png';
        this.sprites.runningR.src = '/Users/waeelkhoury/Desktop/game-development/Musketeer/Run.png';
        this.sprites.runningL.src = '/Users/waeelkhoury/Desktop/game-development/Musketeer/RunL.png';
        this.sprites.attackingR.src = '/Users/waeelkhoury/Desktop/game-development/Musketeer/Attack_4.png';
        this.sprites.attackingL.src = '/Users/waeelkhoury/Desktop/game-development/Musketeer/Attack_4L.png'; // Add your left attack sprite path

        // Animation properties
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 10; // Adjust this value to control the animation speed
        this.frameCounts = {
            standing: 5, // Number of frames in the standing animation
            runningL: 8,  // Number of frames in the running left animation
            runningR: 8,  // Number of frames in the running right animation
            attackingR: 5, // Number of frames in the attacking right animation
            attackingL: 5  // Number of frames in the attacking left animation
        };
        this.currentAnimation = 'standing';
    }

    updateAnimation() {
        this.tickCount += 1;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.frameIndex = (this.frameIndex + 1) % this.frameCounts[this.currentAnimation];
        }
    }

    draw(context) {
        const sprite = this.sprites[this.currentAnimation];
        if (sprite.complete) { // Check if the image is loaded before drawing
            const frameWidth = sprite.width / this.frameCounts[this.currentAnimation];
            const frameHeight = sprite.height;

            context.drawImage(
                sprite,
                this.frameIndex * frameWidth,
                0,
                frameWidth,
                frameHeight,
                this.x,
                this.y,
                this.width,
                this.height
            );

            this.updateAnimation();
        }
    }

    moveRight(canvasWidth) {
        this.x += this.speed;
        if (this.x + this.width > canvasWidth) {
            this.x = canvasWidth - this.width;
        }
        this.isMoving = true;
        this.lastDirection = 'right';
        this.currentAnimation = 'runningR';
    }

    moveLeft() {
        this.x -= this.speed;
        if (this.x < 0) {
            this.x = 0;
        }
        this.isMoving = true;
        this.lastDirection = 'left';
        this.currentAnimation = 'runningL';
    }

    jump() {
        if (this.grounded) {
            this.gravity = 0.5;
            this.velocityY = -20 * newscale;
            this.grounded = false;
            this.currentAnimation = this.lastDirection === 'right' ? 'runningR' : 'runningL';
        }
    }

    applyGravity(canvasHeight, blocks) {
        
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        this.gravity = 0.5;

        // Check collision with blocks
        blocks.forEach(block => {
            if (this.y + this.height <= block.y && this.y + this.height + this.velocityY >= block.y &&
                this.x < block.x + (block.width / 5) && this.x + (this.width / 2) > block.x) {
                this.y = block.y - this.height ;
                this.velocityY = 0;
                this.gravity = 0;
                this.grounded = true;
            }
            if (this.y + this.height >= canvasHeight - (200 * newscale)) {
                this.y = canvasHeight - this.height - (200 * newscale);
                this.velocityY = 0;
                this.gravity = 0.5;
                this.grounded = true;
            }  
            
        });
        
        

        if (!this.isAttacking && this.grounded && !this.isMoving) {
            this.currentAnimation = 'standing';
        }
    }

    attack() {
        this.isAttacking = true;
        this.currentAnimation = this.lastDirection === 'right' ? 'attackingR' : 'attackingL';
        setTimeout(() => {
            this.isAttacking = false;
            if (!this.isMoving) {
                this.currentAnimation = 'standing';
            } else {
                this.currentAnimation = this.lastDirection === 'right' ? 'runningR' : 'runningL';
            }
        }, 200);
    }

    stopMoving() {
        this.isMoving = false;
        if (!this.isAttacking && this.grounded) {
            this.currentAnimation = 'standing';
        }
    }

    drawHealthBar(context) {
        const healthBarWidth = 500 * newscale;
        const healthBarHeight = 30 * newscale;
        const healthBarX = 10 * newscale;
        const healthBarY = 50 * newscale;

        context.fillStyle = 'grey';
        context.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

        const currentHealthWidth = (this.health / this.maxHealth) * healthBarWidth;
        context.fillStyle = 'red';
        context.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);
    }
}