import { Object3D } from 'three';

export const isString = value => {
    return Object.prototype.toString.call(value) === '[object String]';
};

export const css = (...args) => {
    let stylesList = [];

    args.filter(style => !!style) // remove any falsey values from our styles array and join our style classes.
        .forEach(style => {
            if (Array.isArray(style)) {
                stylesList = stylesList.concat(css(...style)); // Use recursion to handle nested array of styles.
            } else if (isString(style)) {
                stylesList.push(style); // Only add strings to our results
            }
        });

    return stylesList.join(' ');
};

export const RandomNumber = () => {
    return Math.round(Math.random() * 100);
};

export const domSize2viewSize = (el, viewSize = { width: 1, height: 1 }) => {
    return {
        width: (el.offsetWidth / global.innerWidth) * viewSize.width,
        height: (el.offsetHeight / global.innerHeight) * viewSize.height,
    };
};

export const domPosition2viewPosition = (
    el,
    viewSize = { width: 1, height: 1 },
    geoSize
) => {
    geoSize = geoSize || domSize2viewSize(el, viewSize);
    const box = el.getBoundingClientRect();
    return {
        x:
            (box.left / global.innerWidth) * viewSize.width -
            viewSize.width / 2 +
            geoSize.width / 2,
        y:
            viewSize.height -
            (box.top / global.innerHeight) * viewSize.height -
            viewSize.height / 2 -
            geoSize.height / 2,
    };
};

export const hashCode = s => {
    let h = 0;
    const l = s.length;
    let i = 0;
    if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
    return Math.abs(h);
};

export const createImageWebGL = (image, viewSize, scene) => {
    const geoSize = domSize2viewSize(image.el, viewSize);
    const meshPosition = domPosition2viewPosition(image.el, viewSize, geoSize);

    image.plane.position.set(meshPosition.x, meshPosition.y, 0);
    image.plane.scale.set(
        geoSize.width || 0.00001,
        geoSize.height || 0.00001,
        1
    );
    image.plane.name = image.id;
    const group = new Object3D();
    group.name = image.id;
    image.group = group;
    group.add(image.plane);
    scene.add(group);

    return image;
};
