export const getUrlParam = param => {
    const url = new global.URL(global.location.href);
    return url.searchParams.get(param);
};
