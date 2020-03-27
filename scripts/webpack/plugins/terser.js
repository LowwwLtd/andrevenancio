const TerserPlugin = require('terser-webpack-plugin');

module.exports = new TerserPlugin({
    parallel: true,
    terserOptions: {
        ecma: 6,
    },
});
