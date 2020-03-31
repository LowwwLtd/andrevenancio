const CopyWebpackPlugin = require('copy-webpack-plugin');

const { PATH_STATIC, PATH_DIST } = require('../config.js');

module.exports = new CopyWebpackPlugin([
    {
        from: PATH_STATIC,
        to: PATH_DIST,
        ignore: ['.DS_Store'],
    },
]);
