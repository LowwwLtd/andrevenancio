const canvas = document.createElement('canvas');
const copy = canvas.getContext('2d');

export const trimContext = ctx => {
    const pixels = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const l = pixels.data.length;
    const bound = {
        top: null,
        left: null,
        right: null,
        bottom: null,
    };
    let x;
    let y;

    // Iterate over every pixel to find the highest
    // and where it ends on every axis ()
    for (let i = 0; i < l; i += 4) {
        if (pixels.data[i + 3] !== 0) {
            x = (i / 4) % ctx.canvas.width;
            y = ~~(i / 4 / ctx.canvas.width);

            if (bound.top === null) {
                bound.top = y;
            }

            if (bound.left === null) {
                bound.left = x;
            } else if (x < bound.left) {
                bound.left = x;
            }

            if (bound.right === null) {
                bound.right = x;
            } else if (bound.right < x) {
                bound.right = x;
            }

            if (bound.bottom === null) {
                bound.bottom = y;
            } else if (bound.bottom < y) {
                bound.bottom = y;
            }
        }
    }

    // Calculate the height and width of the content
    const trimHeight = bound.bottom - bound.top;
    const trimWidth = bound.right - bound.left;
    const trimmed = ctx.getImageData(
        bound.left,
        bound.top,
        trimWidth,
        trimHeight
    );

    canvas.width = trimWidth;
    canvas.height = trimHeight;
    copy.putImageData(trimmed, 0, 0);

    return copy;
};
