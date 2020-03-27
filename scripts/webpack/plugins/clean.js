const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const { PATH_DIST } = require('../config.js');

module.exports = new CleanWebpackPlugin(/*[PATH_DIST], {
    verbose: false,
    root: process.cwd(),
} */);
