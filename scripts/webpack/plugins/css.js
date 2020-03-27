const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VERSION } = require('../config');

module.exports = new MiniCssExtractPlugin({
    filename: `css/style-${VERSION}.css`,
    chunkFilename: '[id].css',
});
