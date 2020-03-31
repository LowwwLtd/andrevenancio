export const debounce = (fn, wait) => {
    let t;
    return function yo() {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, arguments), wait);
    };
};
