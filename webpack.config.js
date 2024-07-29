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
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader']
            }
        ]
    },
    devtool,
    optimization: {
        minimize: true
    }
}));
