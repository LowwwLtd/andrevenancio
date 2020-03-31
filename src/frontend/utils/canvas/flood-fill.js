// if the image has non transparent elements
// flood it to rgba(255,255,255,255);
// otherwise keep transparent rgba(0,0,0,0);
export const saturate = context => {
    const imagedata = context.getImageData(
        0,
        0,
        context.canvas.width,
        context.canvas.width
    );

    for (let i = 0; i < imagedata.data.length; i += 4) {
        const r = imagedata.data[i + 0];
        const g = imagedata.data[i + 1];
        const b = imagedata.data[i + 2];
        let c = 0;
        if (r !== 0 || g !== 0 || b !== 0) {
            c = 255;
        }

        imagedata.data[i + 0] = c;
        imagedata.data[i + 1] = c;
        imagedata.data[i + 2] = c;
        imagedata.data[i + 3] = c;
    }

    context.putImageData(imagedata, 0, 0);
};

export const getPixel = (pixeldata, x, y) => {
    if (x < 0 || y < 0 || x >= pixeldata.width || y >= pixeldata.height) {
        return -1; // impossible color
    }
    return pixeldata.data[y * pixeldata.width + x];
};

export const getFirstWhitePixelTopDown = context => {
    for (let y = 0; y < context.canvas.height; y++) {
        const rowData = context.getImageData(0, y, context.canvas.width, 1)
            .data;
        for (let i = 0; i < rowData.length; i += 4) {
            // console.log(rowData[i + 3]);
            if (rowData[i + 3] === 255) {
                return { x: i / 4, y };
            }
        }
    }
    return null;
};

// floods one area.
export const floodAlgorithm = (context, point, fillColor) => {
    // read the pixels in the canvas
    const imageData = context.getImageData(
        0,
        0,
        context.canvas.width,
        context.canvas.height
    );

    // make a Uint32Array view on the pixels so we can manipulate pixels
    // one 32bit value at a time instead of as 4 bytes per pixel
    const pixelData = {
        width: imageData.width,
        height: imageData.height,
        data: new Uint32Array(imageData.data.buffer),
    };

    // get the color we're filling
    const targetColor = getPixel(pixelData, point.x, point.y);

    // check we are actually filling a different color
    if (targetColor !== fillColor) {
        const pixelsToCheck = [point.x, point.y];
        while (pixelsToCheck.length > 0) {
            const y = pixelsToCheck.pop();
            const x = pixelsToCheck.pop();
            const currentColor = getPixel(pixelData, x, y);
            if (currentColor === targetColor) {
                pixelData.data[y * pixelData.width + x] = fillColor;
                pixelsToCheck.push(x + 1, y);
                pixelsToCheck.push(x - 1, y);
                pixelsToCheck.push(x, y + 1);
                pixelsToCheck.push(x, y - 1);
            }
        }

        // put the data back
        return imageData;
    }

    // return if nothing found
    return imageData;
};

/*
This algorithm is a mix of several techniques to achieve a clean detection of a font outline
so we can generate lines around the outline.

1)
To make this work, we need an empty transparent canvas and then draw a shape or text into it.

2) 
The second step is reduce antialias that gets naturally created. To do that we go through all the pixels
in the context, and if there is a non transparent pixel we saturate it to white.

3)
now we have antialias eliminated, and we need to start the floodfill algorithm. Because
we're dealing with text, its not guaranteed that all characters are continuous. and the floodfill algorith
just "paints" the pixels that are continuous. Which means that in a character like "o" we will end up with a hole.
In order to avoid this, we're continuously floodfilling white pixels with non white colours until we run out of white pixels

4)
now we end up with a couple of "blobs" which are groups of different colour created by the recursive floodfill algorithm
We go through all the "blobs" and if we find. Each blob is a distinc bitmapdata with only the blob area painted
*/

export const flood = context => {
    // copy context to offline context, so we dont manipulate the origin
    const temp = document.createElement('canvas');
    temp.width = context.canvas.width;
    temp.height = context.canvas.height;

    const tempContext = temp.getContext('2d');
    tempContext.drawImage(context.canvas, 0, 0, temp.width, temp.height);

    // step 2)
    saturate(tempContext);

    // step 3)
    let white = getFirstWhitePixelTopDown(tempContext);
    if (white === null) {
        console.warn('there are no more white pixels to flood image');
        return [];
    }

    // find all white pixels in data and flood them recursively
    let iterations = 0;
    while (white !== null) {
        const random = ~~(0xffffff * Math.random()) * 256 + 0xff;
        const imagedata = floodAlgorithm(tempContext, white, random);
        tempContext.putImageData(imagedata, 0, 0);

        white = getFirstWhitePixelTopDown(tempContext);
        iterations++;

        // fail safe
        if (iterations > 100) {
            white = null;
            console.warn('too many iterations, probably a silly error');
        }
    }

    // // step 4)
    const dictionary = {};
    const imagedata = tempContext.getImageData(
        0,
        0,
        tempContext.canvas.width,
        tempContext.canvas.height
    );

    // goest through the flooded image data, and adds each different colour to a dictionary
    for (let i = 0; i < imagedata.data.length; i += 4) {
        const r = imagedata.data[i + 0];
        const g = imagedata.data[i + 1];
        const b = imagedata.data[i + 2];
        const a = imagedata.data[i + 3];
        const id = `uid-${r}${g}${b}${a}`;
        if (dictionary[id] === undefined) {
            dictionary[id] = context.createImageData(
                context.canvas.width,
                context.canvas.height
            );
        }
        dictionary[id].data[i + 0] = 255;
        dictionary[id].data[i + 1] = 255;
        dictionary[id].data[i + 2] = 255;
        dictionary[id].data[i + 3] = 255;
    }

    // delete transparent pixel blob
    delete dictionary[`uid-0000`];

    // return all blobs
    return Object.keys(dictionary).map(id => dictionary[id]);
};
