const webpack = require('webpack');

const { VERSION, NAME } = require('../config.js');

module.exports = new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(VERSION),
    __NAME__: JSON.stringify(NAME),
    __NODE_ENV__: JSON.stringify(process.env.NODE_ENV || 'development'),
    __PRODUCTION__: process.env.NODE_ENV === 'production',
});
