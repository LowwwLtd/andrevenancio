const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { PATH_SOURCE } = require('../config');

module.exports = new HTMLWebpackPlugin({
    title: '',
    inject: true,
    hash: true,
    minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
    },
    template: path.join(PATH_SOURCE, 'frontend', 'template.html'),
});
