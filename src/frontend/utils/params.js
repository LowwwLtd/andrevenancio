export const getParam = (name) => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regexS = `[\\?&]${name}=([^&#]*)`;
    const regex = new RegExp(regexS);

    let results = regex.exec(global.location.search);
    if (!results) results = regex.exec(global.location.hash);
    if (!results) return '';

    return decodeURIComponent(results[1].replace(/\+/g, ' '));
};
