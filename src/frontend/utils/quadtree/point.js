export class Point {
    constructor(x, y, userData = {}) {
        this.x = x || 0;
        this.y = y || 0;
        this.userData = userData;
    }
}
