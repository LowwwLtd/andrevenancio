export class Rectangle {
    constructor(x = 0, y = 0, width = 1, height = 1) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    intersects(rectangle) {
        return (
            Math.max(this.x, rectangle.x) <
                Math.min(this.x + this.width, rectangle.x + rectangle.width) &&
            Math.max(this.y, rectangle.y) <
                Math.min(this.y + this.height, rectangle.y + rectangle.height)
        );
    }
}
