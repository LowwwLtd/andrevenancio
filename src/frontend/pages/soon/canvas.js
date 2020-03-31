/* eslint-disable no-undef */
import { loadFontFace } from 'app/utils/canvas';
import { map } from 'app/utils/math';
import { Text } from './text';

const MIN_DISTANCE = 40;
const SPRING = 0.2; // original: 0.04
const FRICTION = 0.9;
const SKIP = 1;

export class Canvas {
    constructor(context) {
        this.context = context;
        this.ready = false;

        this.ratio = global.devicePixelRatio;
        this.width = global.innerWidth * this.ratio;
        this.height = global.innerHeight * this.ratio;

        this.text = new Text();
        loadFontFace('SpaceGrotesk-Bold', '/fonts/SpaceGrotesk-Bold.ttf').then(
            () => {
                this.ready = true;
                this.rebuild();
            }
        );
    }

    resize(width, height, ratio) {
        this.ratio = ratio;
        this.width = width;
        this.height = height;

        if (this.ready) {
            this.rebuild();
        }
    }

    test(x, y) {
        this.mouseX = x;
        this.mouseY = y;
    }

    rebuild() {
        this.text.rebuild();
        // add physics props to existing particles
        for (let i = 0; i < this.text.letters.length; i++) {
            for (let j = 0; j < this.text.letters[i].length; j++) {
                // velocity
                this.text.letters[i][j].vx = 0;
                this.text.letters[i][j].vy = 0;
                // current
                this.text.letters[i][j].cx = this.text.letters[i][j].x;
                this.text.letters[i][j].cy = this.text.letters[i][j].y;
                // target
                this.text.letters[i][j].tx = this.text.letters[i][j].x;
                this.text.letters[i][j].ty = this.text.letters[i][j].y;
            }
        }
    }

    calculate() {
        for (let letter = 0; letter < this.text.letters.length; letter++) {
            for (let i = 0; i < this.text.letters[letter].length; i++) {
                if (this.text.letters[letter][i].vx === undefined) {
                    // velocity
                    this.text.letters[letter][i].vx = 0;
                    this.text.letters[letter][i].vy = 0;
                    // current
                    this.text.letters[letter][i].cx = this.text.letters[letter][
                        i
                    ].x;
                    this.text.letters[letter][i].cy = this.text.letters[letter][
                        i
                    ].y;
                    // target
                    this.text.letters[letter][i].tx = this.text.letters[letter][
                        i
                    ].x;
                    this.text.letters[letter][i].ty = this.text.letters[letter][
                        i
                    ].y;
                }

                this.text.letters[letter][i].vx +=
                    (this.text.letters[letter][i].tx -
                        this.text.letters[letter][i].cx) *
                    SPRING;
                this.text.letters[letter][i].vy +=
                    (this.text.letters[letter][i].ty -
                        this.text.letters[letter][i].cy) *
                    SPRING;

                // calc dist
                if (i % SKIP === 0) {
                    const dx = this.mouseX - this.text.letters[letter][i].cx;
                    const dy = this.mouseY - this.text.letters[letter][i].cy;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MIN_DISTANCE * 2) {
                        this.text.letters[letter][i].tx = map(
                            dist,
                            0,
                            MIN_DISTANCE,
                            this.text.letters[letter][i].x,
                            this.mouseX
                        );
                        this.text.letters[letter][i].ty = map(
                            dist,
                            0,
                            MIN_DISTANCE,
                            this.text.letters[letter][i].y,
                            this.mouseY
                        );

                        this.text.letters[letter][i].vx +=
                            (this.text.letters[letter][i].tx -
                                this.text.letters[letter][i].cx) *
                            0.2;
                        this.text.letters[letter][i].vy +=
                            (this.text.letters[letter][i].ty -
                                this.text.letters[letter][i].cy) *
                            0.2;
                    }
                }
                this.text.letters[letter][i].tx = this.text.letters[letter][
                    i
                ].x;
                this.text.letters[letter][i].ty = this.text.letters[letter][
                    i
                ].y;

                this.text.letters[letter][i].vx *= FRICTION;
                this.text.letters[letter][i].vy *= FRICTION;
                this.text.letters[letter][i].cx += this.text.letters[letter][
                    i
                ].vx;
                this.text.letters[letter][i].cy += this.text.letters[letter][
                    i
                ].vy;
            }
        }
    }

    draw() {
        this.context.beginPath();
        this.context.fillStyle = 'white';
        for (let letter = 0; letter < this.text.letters.length; letter++) {
            // draw each letter through looping the points (p)
            for (let p = 0; p < this.text.letters[letter].length; p++) {
                // console.log('letter', letter);

                this.context.moveTo(
                    this.text.letters[letter][0].cx,
                    this.text.letters[letter][0].cy
                );
                // next point (np)
                for (let np = 1; np < this.text.letters[letter].length; np++) {
                    this.context.lineTo(
                        this.text.letters[letter][np].cx,
                        this.text.letters[letter][np].cy
                    );
                }
                this.context.lineTo(
                    this.text.letters[letter][0].cx,
                    this.text.letters[letter][0].cy
                );
            }

            // debug points (dp)
            // for (let dp = 0; dp < this.text.letters[letter].length; dp++) {
            //     this.context.beginPath();
            //     this.context.fillStyle = 'red';
            //     this.context.arc(
            //         this.text.letters[letter][dp].cx,
            //         this.text.letters[letter][dp].cy,
            //         2,
            //         0,
            //         2 * Math.PI,
            //         false
            //     );
            //     this.context.fill();
            // }
        }
        this.context.fill();
    }

    update() {
        this.context.clearRect(0, 0, this.width, this.height);

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

        this.calculate();
        this.draw();
    }
}
