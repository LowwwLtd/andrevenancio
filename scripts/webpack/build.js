const path = require('path');

const { PATH_DIST, PATH_SOURCE, VERSION } = require('./config');
const rules = require('./rules');
const plugins = require('./plugins');

module.exports = {
    entry: path.join(PATH_SOURCE, 'frontend', 'index.js'),

    output: {
        path: PATH_DIST,
        filename: `js/app-${VERSION}.js`,
        publicPath: '/',
    },

    resolve: {
        alias: {
            app: PATH_SOURCE,
        },
    },

    optimization: {
        minimizer: [plugins.terser, plugins.cssoptimise],
    },

    performance: {
        hints: false,
    },

    module: {
        rules: [rules.scss.production, rules.jsx],
    },

    plugins: [
        plugins.core,
        plugins.clean,
        plugins.copy,
        plugins.css,
        plugins.html,
    ],
};
