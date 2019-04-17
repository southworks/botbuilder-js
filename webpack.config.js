const path = require('path');

module.exports = {
    entry: path.join(__dirname, '/libraries/botframework-connector/src'),
    output: {
        filename: 'index.js',
        path: path.join(__dirname, '/libraries/botframework-connector/lib')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
};