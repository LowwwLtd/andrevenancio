export const loadFontFace = (fontFamily, fontSource) =>
    new Promise((resolve, reject) => {
        const font = new FontFace(fontFamily, `url(${fontSource})`);
        font.load().then(() => {
            document.fonts
                .load(`240px ${fontFamily}`)
                .then(() => {
                    resolve();
                })
                .catch(e => reject(e));
        });
    });
