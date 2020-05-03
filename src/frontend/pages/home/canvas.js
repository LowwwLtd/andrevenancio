/* eslint-disable no-undef */
import QuadTree, { Rectangle, Point } from 'app/utils/quadtree';
import { random } from 'app/utils/math';

const VELOCITY = 5;
const MAX_CONNECTIONS = 100;

let quadtree;
let point;

export class Canvas {
    constructor(context) {
        this.context = context;

        this.width = global.innerWidth * global.devicePixelRatio;
        this.height = global.innerHeight * global.devicePixelRatio;
        this.ratio = global.devicePixelRatio;
        this.settings = {
            particles: 100,
            distance: 300,
        };

        this.particles = [];
        for (let i = 0; i < this.settings.particles; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const vx = random(-VELOCITY, VELOCITY);
            const vy = random(-VELOCITY, VELOCITY);
            this.particles.push({
                x,
                y,
                vx,
                vy,
            });
        }
    }

    resize(width, height, ratio) {
        this.ratio = ratio;
        this.width = width;
        this.height = height;

        const max = Math.max(this.width, this.height);
        this.boundary = new Rectangle(0, 0, max, max);
    }

    update() {
        this.context.clearRect(0, 0, this.width, this.height);

        // move particles
        for (let i = 0; i < this.particles.length; i++) {
            const current = this.particles[i];
            if (current.x > this.width) {
                current.vx = -VELOCITY;
            } else if (current.x < 0) {
                current.vx = VELOCITY;
            } else {
                current.vx *= 1;
            }

            if (current.y >= this.height) {
                current.vy = -VELOCITY;
            } else if (current.y <= 0) {
                current.vy = VELOCITY;
            } else {
                current.vy *= 1;
            }

            current.x += current.vx;
            current.y += current.vy;

            this.context.beginPath();
            this.context.fillStyle = '#fff';
            this.context.arc(current.x, current.y, 2, 0, 2 * Math.PI);
            this.context.fill();
            this.context.closePath();
        }

        // add points to quad
        quadtree = new QuadTree(this.boundary, 2);
        for (let i = 0; i < this.particles.length; i++) {
            point = new Point(this.particles[i].x, this.particles[i].y);
            quadtree.insert(point);
        }

        // draw rectangles
        quadtree.borders(this.context);

        for (let i = 0; i < this.particles.length - 1; i++) {
            const width = this.settings.distance;
            const height = this.settings.distance;
            const x = this.particles[i].x - width / 2;
            const y = this.particles[i].y - height / 2;

            const bounds = new Rectangle(x, y, width, height);
            const selected = quadtree.query(bounds);

            for (let j = 0; j < selected.length; j++) {
                if (i < MAX_CONNECTIONS) {
                    this.connectDots(this.particles[i], selected[j]);
                }
            }
        }
    }

    connectDots(partA, partB) {
        const dx = partB.x - partA.x;
        const dy = partB.y - partA.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.settings.distance) {
            this.context.beginPath();
            this.context.strokeStyle = '#999';
            this.context.lineWidth = dist / this.settings.distance;
            this.context.moveTo(partA.x, partA.y);
            this.context.lineTo(partB.x, partB.y);
            this.context.stroke();
            this.context.closePath();

            const ax = dx * 0.0001;
            const ay = dy * 0.0001;

            partA.vx += ax;
            partA.vy += ay;
            partB.vx -= ax;
            partB.vy -= ay;
        }
    }
}
