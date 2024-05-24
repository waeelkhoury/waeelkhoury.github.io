// Block Class
class Block {
    constructor(x, y, width, height, imageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    draw(context) {
        if (this.image.complete) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            // Optional: Draw a placeholder rectangle if the image hasn't loaded yet
            context.fillStyle = 'brown';
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}