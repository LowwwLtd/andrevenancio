import mobile from 'is-mobile';

let MOBILE = mobile();

export const setMobile = (value) => {
    MOBILE = value;
};

export const getMobile = () => {
    return MOBILE;
};
