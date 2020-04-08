/* returns document offset */
export const getPageOffset = () => {
    const value = { x: 0, y: 0 };
    if (!global.window || !document) {
        return { x: 0, y: 0 };
    }

    value.x =
        global.pageXOffset ||
        document.documentElement.scrollLeft ||
        document.body.scrollLeft ||
        0;

    value.y =
        global.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

    return value;
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
