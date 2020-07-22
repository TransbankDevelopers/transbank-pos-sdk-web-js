const path = require('path');

module.exports = [
    'source-map'
].map(devtool => ({
    mode: 'production',
    entry: './src/pos.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'pos.js',
        library: 'Transbank',
        libraryTarget: 'window',
        umdNamedDefine: true
    },
    node: {
        net: 'empty',
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    devtool,
    optimization: {
        minimize: true
    }
}));
