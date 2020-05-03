export const fade = ({ duration = 0.5 } = {}) => {
    return {
        in: {
            duration,
            from: { opacity: 1, height: '100%' },
            to: { opacity: 0, ease: 'Power2.easeInOut' },
        },
        out: {
            duration,
            from: { opacity: 0, height: '100%' },
            to: { opacity: 1, ease: 'Power2.easeInOut' },
        },
    };
};

export const verticalSlide = ({ duration = 0.5 } = {}) => {
    return {
        in: {
            duration,
            from: { top: 'initial', bottom: 0 },
            to: { height: '0%', ease: 'Power2.easeInOut' },
        },
        out: {
            duration,
            from: { top: 0, bottom: 'initial' },
            to: { height: '100%', ease: 'Power2.easeInOut' },
        },
    };
};
