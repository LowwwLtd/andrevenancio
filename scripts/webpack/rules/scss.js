const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { PATH_SOURCE } = require('../config');

module.exports = {
    dev: {
        test: /\.(sa|sc|c)ss$/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'sass-loader',
                options: {
                    sassOptions: {
                        includePaths: [path.resolve(PATH_SOURCE)],
                    },
                },
            },
        ],
    },
    production: {
        test: /\.(sa|sc|c)ss$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
                loader: 'sass-loader',
                options: {
                    sassOptions: {
                        includePaths: [path.resolve(PATH_SOURCE)],
                    },
                },
            },
        ],
    },
};
