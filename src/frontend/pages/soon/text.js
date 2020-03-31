/*
This class is responsible for extracting points from a canvas.
This class should rebuild on 'resize' or 'text' change.

there's 2 canvas in play here.
1) Big Canvas. This canvas is the size of the browser window.
2) Cropped Canvas. (part of the utils/canvas) this canvas has only the necessary size to display the text

only call rebuild once fontface is loaded

usage:

const text = new Text();
text.rebuild();
console.log(text.letters);
*/
import { trimContext, flood, marching } from 'app/utils/canvas';

export class Text {
    constructor() {
        // text to extract the points
        this.text = 'Hello';
        // an array of letters, each letter with an array of points inside
        this.letters = [];
        // how much do we want to simplify the outline
        this.simplificationStep = 20;

        // fullscreen canvas to draw the text into
        this.bcanvas = document.createElement('canvas');
        this.bcanvas.width = global.innerWidth * global.devicePixelRatio;
        this.bcanvas.height = global.innerHeight * global.devicePixelRatio;
        this.bcanvas.style.position = 'absolute';
        this.bcanvas.style.top = 0;
        this.bcanvas.style.width = `${global.innerWidth}px`;
        this.bcanvas.style.height = `${global.innerHeight}px`;
        this.bcanvas.style.border = '1px dashed red';
        this.bcanvas.style.display = 'block';
        // document.body.appendChild(this.bcanvas);

        this.bcontext = this.bcanvas.getContext('2d');

        // temp canvas to draw each individual bitmapdata (from letters array)
        const temp = document.createElement('canvas');
        this.tempContext = temp.getContext('2d');
    }

    rebuild() {
        this.letters = [];

        // 1) draw text into the big canvas
        this.drawText();

        // 2) trims the big context and assigns it to a smaller context for speed
        const context = this.bcontext; // trimContext(this.bcontext);

        // 3) detect letters using flood-fill, which return an array of bitmapdata
        const letters = flood(context);

        // 4) running marching-squares to extract the outline of each letter
        for (let i = 0; i < letters.length; i++) {
            context.putImageData(letters[i], 0, 0);
            const pixelmatrix = {
                width: letters[i].width,
                height: letters[i].height,
                data: new Uint32Array(letters[i].data.buffer),
            };
            const outline = marching(pixelmatrix);

            const simplified = [];
            for (let j = 0; j < outline.length; j += this.simplificationStep) {
                simplified.push(outline[j]);
            }
            this.letters.push(simplified);
        }
    }

    drawText() {
        // clears big canvas and sets font
        this.bcontext.clearRect(0, 0, this.bcanvas.width, this.bcanvas.height);
        this.bcontext.font = '240px SpaceGrotesk-Bold';
        this.bcontext.fillStyle = 'white';
        this.bcontext.textBaseline = 'middle';
        this.bcontext.textAlign = 'center';

        // draws the text
        this.bcontext.fillText(
            this.text,
            this.bcanvas.width >> 1,
            this.bcanvas.height >> 1
        );

        trimContext(this.bcontext);
    }
}
