const path = require('path');

const { PATH_DIST, PATH_SOURCE } = require('./config');
const rules = require('./rules');
const plugins = require('./plugins');

module.exports = {
    entry: path.join(PATH_SOURCE, 'frontend', 'index.js'),

    output: {
        path: PATH_DIST,
        filename: 'js/app.js',
        publicPath: '/',
    },

    resolve: {
        alias: {
            app: PATH_SOURCE,
        },
    },

    devServer: {
        historyApiFallback: true,
    },

    module: {
        rules: [rules.scss.dev, rules.jsx],
    },

    plugins: [
        plugins.core,
        plugins.clean,
        plugins.copy,
        plugins.css,
        plugins.html,
    ],
};
