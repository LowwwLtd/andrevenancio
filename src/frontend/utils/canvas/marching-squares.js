/* eslint-disable */
const X = 0; // NONE
const N = 1; // NORTH
const D = 2; // DOWN
const L = 3; // LEFT
const R = 4; // RIGHT

const DIRECTIONS = new Uint32Array([
    R,
    N,
    R,
    R,
    D,
    N,
    D,
    D,
    L,
    N,
    L,
    R,
    L,
    N,
    L,
    X,
]);

/**
 * Returns a boolean value stating whether or not a coordinate
 * is out of bounds or equal to the provided target value.
 * @param {Array} matrix Array of values.
 * @param {Number} width Width of the matrix.
 * @param {Number} height Height of the matrix.
 * @param {Number} x X coordinate to assess.
 * @param {Number} y Y coordinate to assess.
 * @param {Object} target Arbitary value to compare coordinate value against.
 * @return {[type]} [description]
 */
const getBit = (matrix, width, height, x, y, target) => {
    if (
        x < 0 ||
        y < 0 ||
        x >= width ||
        y >= height ||
        matrix[getIndex(x, y, width)] !== target
    ) {
        return true;
    }
    return false;
};

/**
 * Returns the index of a coordinate within a flat matrix of values.
 * @param {Number} x X coordinate.
 * @param {Number} y Y coordinate.
 * @param {Number} width Width of the matrix.
 * @return {Number} Index of the coordinate.
 */
const getIndex = (x, y, width) => {
    return x + y * width;
};

export const getFirstWhitePixel = pixelmatrix => {
    const width = pixelmatrix.width;
    for (let i = 0; i < pixelmatrix.data.length; i++) {
        if (pixelmatrix.data[i] === 0xffffffff) {
            return {
                x: i % width,
                y: ~~(i / width),
            };
        }
    }

    return { x: 0, y: 0 };
};

/**
 * Returns a flat array of points that make up the
 * perimeter of a blob of values within a matrix.
 * Points returned in the format: [p0x,p0y, p1x,p1y, p2x,p2y]
 * @param {Array} matrix Flat array of values.
 * @param {Number} width Width of the matrix.
 * @param {Number} height Height of the matrix.
 * @param {Number} opt_x Optional x position of the target. Defaults to 0.
 * @param {Number} opt_y Optional y position of the target. Defaults to 0.
 * @return {Array} Flat array of perimeter points.
 */
export const marching = pixelmatrix => {
    const point = getFirstWhitePixel(pixelmatrix);
    if (point === null) {
        console.warn('no white point detected');
        return [];
    }
    var b0,
        b1,
        b2,
        b3,
        state,
        startX,
        startY,
        x = point.x,
        y = point.y,
        target = pixelmatrix.data[getIndex(x, y, pixelmatrix.width)],
        oldDirection,
        newDirection,
        perimeter = [],
        run = true;

    while (run) {
        // b0 b1
        // b3 b2
        b0 = getBit(
            pixelmatrix.data,
            pixelmatrix.width,
            pixelmatrix.height,
            x + 0,
            y + 0,
            target
        );
        b1 = getBit(
            pixelmatrix.data,
            pixelmatrix.width,
            pixelmatrix.height,
            x + 1,
            y + 0,
            target
        );
        b2 = getBit(
            pixelmatrix.data,
            pixelmatrix.width,
            pixelmatrix.height,
            x + 1,
            y + 1,
            target
        );
        b3 = getBit(
            pixelmatrix.data,
            pixelmatrix.width,
            pixelmatrix.height,
            x + 0,
            y + 1,
            target
        );

        // Build state.
        state = 0;
        if (b0) state += 1;
        if (b1) state += 2;
        if (b2) state += 4;
        if (b3) state += 8;

        // Set start x and y.
        if (!!state && !startX && !startY) {
            startX = x;
            startY = y;

            // Exit loop if back at the start of the perimeter.
        } else if (x === startX && y === startY) {
            run = false;
        }

        // Store perimeter coordinate if state in range.
        if (state > 0 && state < 15) perimeter.push({ x: x, y: y });

        // Set old and new directions.
        oldDirection = newDirection;
        newDirection = DIRECTIONS[state];

        // Handle diagonal cases.
        switch (state) {
            case 5:
                if (oldDirection === R) newDirection = D;
                break;
            case 10:
                if (oldDirection === N) newDirection = R;
                break;
        }

        // Set new x and y values.
        switch (newDirection) {
            case N:
                y--;
                break;
            case D:
                y++;
                break;
            case L:
                x--;
                break;
            case R:
                x++;
                break;
            default:
                run = false;
                break;
        }
    }

    // Return the perimeter coordinate array.
    return perimeter;
};
