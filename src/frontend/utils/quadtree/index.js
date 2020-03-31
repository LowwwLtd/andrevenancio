/* eslint-disable max-len */
import { Rectangle } from './rectangle';
import { Point } from './point';

class QuadTree {
    constructor(boundary, n = 4) {
        this.boundary = boundary;
        this.n = n;
        this.points = [];
        this.divided = false;
    }

    insert(point) {
        if (this.boundary.constains(point)) {
            if (this.points.length < this.n) {
                this.points.push(point);
            } else {
                if (!this.divided) {
                    this.subdivide();
                }

                this.nw.insert(point);
                this.ne.insert(point);
                this.sw.insert(point);
                this.se.insert(point);
            }
        }
    }

    subdivide() {
        const { x, y, width, height } = this.boundary;

        const nw = new Rectangle(x, y, width / 2, height / 2);
        const ne = new Rectangle(x + width / 2, y, width / 2, height / 2);
        const sw = new Rectangle(x, y + height / 2, width / 2, height / 2);
        const se = new Rectangle(
            x + width / 2,
            y + height / 2,
            width / 2,
            height / 2
        );

        this.nw = new QuadTree(nw, this.n);
        this.ne = new QuadTree(ne, this.n);
        this.sw = new QuadTree(sw, this.n);
        this.se = new QuadTree(se, this.n);
        this.divided = true;
    }

    query(range, found = []) {
        if (this.boundary.intersects(range)) {
            for (const p of this.points) {
                if (range.constains(p)) {
                    found.push(p);
                }
            }

            if (this.divided) {
                this.nw.query(range, found);
                this.ne.query(range, found);
                this.sw.query(range, found);
                this.se.query(range, found);
            }
        }

        return found;
    }

    debug(context) {
        const { x, y, width, height } = this.boundary;

        context.beginPath();
        context.strokeStyle = '#666';
        context.lineWidth = 1;
        context.rect(x, y, width, height);
        context.stroke();
        context.closePath();

        for (let i = 0; i < this.points.length; i++) {
            context.beginPath();
            context.fillStyle = '#f00';
            context.arc(this.points[i].x, this.points[i].y, 2, 0, 2 * Math.PI);
            context.fill();
            context.closePath();
        }

        if (this.divided) {
            this.nw.debug(context);
            this.ne.debug(context);
            this.sw.debug(context);
            this.se.debug(context);
        }
    }

    borders(context) {
        const { x, y, width, height } = this.boundary;

        context.beginPath();
        context.strokeStyle = '#222';
        context.lineWidth = 1;
        context.rect(x, y, width, height);
        context.stroke();
        context.closePath();

        if (this.divided) {
            this.nw.borders(context);
            this.ne.borders(context);
            this.sw.borders(context);
            this.se.borders(context);
        }
    }
}

export default QuadTree;
export { Rectangle, Point };
