// Coin Class
class Coin {
    constructor(x, y, width, height, imageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.coin = new Image();
        this.coin.src = imageSrc;
        this.collected = false; // Flag to check if the coin is collected
        this.frameCount = 4;
        this.ticksPerFrame = 12;
        this.tickCount = 0;
        this.frameIndex = 0;
    }

    updateAnimation() {
        this.tickCount += 1;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.frameIndex = (this.frameIndex + 1) % this.frameCount;
        }
    }

    draw(context) {
        if (this.coin.complete && !this.collected) {
            const frameWidth = this.coin.width / this.frameCount;
            context.drawImage(
                this.coin,
                this.frameIndex * frameWidth,
                0,
                frameWidth,
                this.coin.height,
                this.x,
                this.y,
                this.width,
                this.height
            );
            this.updateAnimation();
        } else if (!this.collected) {
            
            context.fillStyle = 'gold';
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    collect(player) {
       
        if (!this.collected &&
            player.x  < this.x + this.width - (200 * newscale)  &&
            player.x + player.width > this.x + (200 * newscale) &&
            player.y < this.y + this.height - (400 * newscale) && 
            player.y + player.height > this.y  
        ) {
            this.collected = true;
            return true; // Coin is collected
        }
        return false;
    }
}
