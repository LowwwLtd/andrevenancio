/* eslint-disable no-undef */
import { map } from 'app/utils/math';

const MIN_DISTANCE = 40;
const SPRING = 0.04;
const FRICTION = 0.9;

export class Canvas {
    constructor(context) {
        this.context = context;

        this.width = global.innerWidth * global.devicePixelRatio;
        this.height = global.innerHeight * global.devicePixelRatio;
        this.ratio = global.devicePixelRatio;

        this.particles = [
            {
                x: 100,
                y: 100,
            },
            {
                x: 120,
                y: 100,
            },
            {
                x: 140,
                y: 100,
            },
            {
                x: 160,
                y: 100,
            },
            {
                x: 180,
                y: 100,
            },
            {
                x: 180,
                y: 120,
            },
            {
                x: 180,
                y: 140,
            },
            {
                x: 180,
                y: 160,
            },
            {
                x: 180,
                y: 180,
            },
            {
                x: 180,
                y: 200,
            },
            {
                x: 180,
                y: 220,
            },
            {
                x: 180,
                y: 240,
            },
            {
                x: 180,
                y: 260,
            },
            {
                x: 180,
                y: 280,
            },
            {
                x: 180,
                y: 300,
            },
            {
                x: 180,
                y: 320,
            },
            {
                x: 180,
                y: 340,
            },
            {
                x: 180,
                y: 360,
            },
            {
                x: 180,
                y: 380,
            },
            {
                x: 160,
                y: 380,
            },
            {
                x: 140,
                y: 380,
            },
            {
                x: 120,
                y: 380,
            },
            {
                x: 100,
                y: 380,
            },
            {
                x: 100,
                y: 360,
            },
            {
                x: 100,
                y: 340,
            },
            {
                x: 100,
                y: 320,
            },
            {
                x: 100,
                y: 300,
            },
            {
                x: 100,
                y: 280,
            },
            {
                x: 100,
                y: 260,
            },
            {
                x: 100,
                y: 240,
            },
            {
                x: 100,
                y: 220,
            },
            {
                x: 100,
                y: 200,
            },
            {
                x: 100,
                y: 180,
            },
            {
                x: 100,
                y: 160,
            },
            {
                x: 100,
                y: 140,
            },
            {
                x: 100,
                y: 120,
            },
        ];

        const img = new Image();
        img.onload = () => {
            // const canvas = document.createElement('canvas');
            // canvas.width = img.naturalWidth + 100;
            // canvas.height = img.naturalHeight + 100;
            // canvas.style.position = 'absolute';
            // canvas.style.top = 0;
            // canvas.style.border = '1px dashed red';
            // document.body.appendChild(canvas);
            // const ctx = canvas.getContext('2d');
            // ctx.drawImage(img, 50, 50);
            // const points = edgeDetection(
            //     ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height),
            //     1
            // );
            // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            // for (let i = 0; i < points.length; i++) {
            //     ctx.beginPath();
            //     ctx.fillStyle = 'white';
            //     ctx.fillRect(points[i].x, points[i].y, 1, 1);
            // }
            // this.particles = points;
        };
        img.src = '/img/saves-me-time-from-drawing-in-canvas.png';
    }

    resize(width, height, ratio) {
        this.ratio = ratio;
        this.width = width;
        this.height = height;
    }

    test(x, y) {
        this.mouseX = x;
        this.mouseY = y;
    }

    update() {
        this.context.clearRect(0, 0, this.width, this.height);

        // calculate
        for (let i = 0; i < this.particles.length; i++) {
            if (this.particles[i].vx === undefined) {
                // velocity
                this.particles[i].vx = 0;
                this.particles[i].vy = 0;
                // current
                this.particles[i].cx = this.particles[i].x;
                this.particles[i].cy = this.particles[i].y;
                // target
                this.particles[i].tx = this.particles[i].x;
                this.particles[i].ty = this.particles[i].y;
            }

            this.particles[i].vx +=
                (this.particles[i].tx - this.particles[i].cx) * SPRING;
            this.particles[i].vy +=
                (this.particles[i].ty - this.particles[i].cy) * SPRING;

            // calc dist
            const dx = this.mouseX - this.particles[i].cx;
            const dy = this.mouseY - this.particles[i].cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MIN_DISTANCE * 2) {
                this.particles[i].tx = map(
                    dist,
                    0,
                    MIN_DISTANCE,
                    this.particles[i].x,
                    this.mouseX
                );
                this.particles[i].ty = map(
                    dist,
                    0,
                    MIN_DISTANCE,
                    this.particles[i].y,
                    this.mouseY
                );

                // this.particles[i].vx +=
                //     (this.particles[i].tx - this.particles[i].cx) * 0.2;
                // this.particles[i].vy +=
                //     (this.particles[i].ty - this.particles[i].cy) * 0.2;
            } else {
                this.particles[i].tx = this.particles[i].x;
                this.particles[i].ty = this.particles[i].y;
            }

            this.particles[i].vx *= FRICTION;
            this.particles[i].vy *= FRICTION;
            this.particles[i].cx += this.particles[i].vx;
            this.particles[i].cy += this.particles[i].vy;
        }

        // mouse
        this.context.beginPath();
        this.context.fillStyle = 'rgba(0,255,255,0.5)';
        this.context.arc(
            this.mouseX,
            this.mouseY,
            MIN_DISTANCE,
            0,
            2 * Math.PI,
            false
        );
        this.context.fill();

        this.context.beginPath();
        this.context.fillStyle = 'white';
        this.context.moveTo(this.particles[0].cx, this.particles[0].cy);
        for (let i = 1; i < this.particles.length; i++) {
            this.context.lineTo(this.particles[i].cx, this.particles[i].cy);
        }
        this.context.lineTo(this.particles[0].cx, this.particles[0].cy);
        this.context.fill();

        for (let i = 0; i < this.particles.length; i++) {
            this.context.beginPath();
            this.context.fillStyle = 'red';
            this.context.arc(
                this.particles[i].cx,
                this.particles[i].cy,
                2,
                0,
                2 * Math.PI,
                false
            );
            this.context.fill();
        }
    }
}
