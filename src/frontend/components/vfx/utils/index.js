const offset = { x: 0, y: 0 };
/* returns document offset */
export const setPageOffset = (x, y) => {
    offset.x = x;
    offset.y = y;
};

export const getPageOffset = () => {
    // if (!global.window || !document) {
    //     return { x: 0, y: 0 };
    // }
    // if body is what we need to measure
    // value.x =
    //     global.pageXOffset ||
    //     document.documentElement.scrollLeft ||
    //     document.body.scrollLeft ||
    //     0;
    // value.y =
    //     global.pageYOffset ||
    //     document.documentElement.scrollTop ||
    //     document.body.scrollTop ||
    //     0;
    // return value

    return offset;
};

/* returns x, y offset of a dom element */
export const getElementOffset = (element) => {
    const value = { x: 0, y: 0 };

    do {
        value.x += element.offsetLeft || 0;
        value.y += element.offsetTop || 0;
        element = element.offsetParent;
    } while (element);

    return value;
};

export const getElementRect = (element) => {
    const position = getElementOffset(element);
    const dimensions = element.getBoundingClientRect();
    return {
        x: position.x,
        y: position.y,
        width: dimensions.width,
        height: dimensions.height,
    };
};
