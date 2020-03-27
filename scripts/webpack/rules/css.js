const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    server: {
        test: /\.scss$/,
        loader: 'ignore-loader',
    },
    dev: {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
    },
    production: {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
    },
};
