// Enemy Class
class Enemy {
    constructor(player, canvasWidth, canvasHeight) {
        this.player = player;
        this.x = canvasWidth - 300;
        this.y = canvasHeight - player.height - 150; // Adjusted to match the player ground location
        this.width = player.width;
        this.height = player.height;
        this.speed = 2;
        this.gravity = 0.5;
        this.velocityY = 0;
        this.health = 100;
        this.maxHealth = 100;
        this.grounded = false;
        this.isAttacking = false;
        this.isMoving = false; // Flag to track if the enemy is moving
        this.lastDirection = 'left'; // Track the last direction
        this.attackWidth = 30; // Define the attack width
        this.attackHeight = 10; // Define the attack height

        // Load sprite sheets
        this.sprites = {
            standing: new Image(),
            runningR: new Image(),
            runningL: new Image(),
            attackingR: new Image(),
            attackingL: new Image(),
            deadwizard: new Image()
        };
        this.sprites.standing.src = '/Users/waeelkhoury/Desktop/game-development/Wizard/Idle.png'; // Replace with the actual path
        this.sprites.runningR.src = '/Users/waeelkhoury/Desktop/game-development/Wizard/Run.png'; // Replace with the actual path
        this.sprites.runningL.src = '/Users/waeelkhoury/Desktop/game-development/Wizard/RunL.png'; // Replace with the actual path
        this.sprites.attackingR.src = '/Users/waeelkhoury/Desktop/game-development/Wizard/Attack_3.png'; // Replace with the actual path
        this.sprites.attackingL.src = '/Users/waeelkhoury/Desktop/game-development/Wizard/Attack_1.png'; // Add your left attack sprite path
        this.sprites.deadwizard.src = '/Users/waeelkhoury/Desktop/game-development/Wizard/DeadWizard.png';

        // Animation properties
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = 10; // Adjust this value to control the animation speed
        this.frameCounts = {
            standing: 6, // Number of frames in the standing animation
            runningL: 8,  // Number of frames in the running left animation
            runningR: 8,  // Number of frames in the running right animation
            attackingR: 7, // Number of frames in the attacking right animation
            attackingL: 10 , // Number of frames in the attacking left animation
            deadwizard: 4
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
        } else {
            console.error(`Sprite not loaded for animation: ${this.currentAnimation}`);
        }
        console.log(`Enemy position: x=${this.x}, y=${this.y}, animation=${this.currentAnimation}, frameIndex=${this.frameIndex}`); // Enhanced debugging statement
    }
    
    

    followPlayer() {
        const attackRange = 0; // Define the range within which the enemy will attack
        if (this.player.x + (this.player.width / 2)  < this.x) {
            this.x -= this.speed;
            this.lastDirection = 'left';
            this.currentAnimation = 'runningL';
        } else if (this.player.x > this.x + (this.width/2)) {
            this.x += this.speed;
            this.lastDirection = 'right';
            this.currentAnimation = 'runningR';
        } else {
            this.attack();
        }
        this.isMoving = true;
    }

    stopMoving() {
        this.isMoving = false;
        if (!this.isAttacking) {
            this.currentAnimation = 'standing';
        }
    }

    jump() {
        if (this.grounded) {
            this.velocityY = -10; // Adjust jump strength as needed
            this.grounded = false;
            this.currentAnimation = this.lastDirection === 'right' ? 'runningR' : 'runningL';
        }
    }

    applyGravity(canvasHeight, blocks) {
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Check collision with blocks
        blocks.forEach(block => {
            if (this.y + this.height <= block.y && this.y + this.height + this.velocityY >= block.y &&
                this.x < block.x + block.width && this.x + this.width > block.x) {
                this.y = block.y - this.height;
                this.velocityY = 0;
                this.grounded = true;
            }
        });

        if (this.y + this.height > canvasHeight - (200 * newscale)) {
            this.y = canvasHeight - this.height - (200 * newscale);
            this.velocityY = 0;
            this.grounded = true;
        }

        if (!this.isAttacking && this.grounded && !this.isMoving) {
            this.currentAnimation = 'standing';
        }
    }

    attack() {
        if (!this.isAttacking) {
            this.isAttacking = true;
            this.frameIndex = 0; // Reset frame index to start the attack animation from the beginning
            this.currentAnimation = this.lastDirection === 'right' ? 'attackingR' : 'attackingL';
            setTimeout(() => {
                this.isAttacking = false;
                if (!this.isMoving) {
                    this.currentAnimation = 'standing';
                } else {
                    this.currentAnimation = this.lastDirection === 'right' ? 'runningR' : 'runningL';
                }
            }, 1000); // Attack lasts for 1000 milliseconds
        }
    }

    drawHealthBar(context, canvasWidth) {
        const healthBarWidth = 500 * newscale;
        const healthBarHeight = 30 * newscale;
        const healthBarX = canvasWidth - healthBarWidth - (10 * newscale); // Right-aligned
        const healthBarY = 50 * newscale; // Top of the canvas
    
        context.fillStyle = 'grey';
        context.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    
        const currentHealthWidth = (this.health / this.maxHealth) * healthBarWidth;
        context.fillStyle = 'red';
        context.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);
    }
}