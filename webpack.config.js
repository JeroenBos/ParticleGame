const nodeEnv = process.env.NODE_ENV || 'development';
const CleanWebpackPlugin = require('clean-webpack-plugin');



// var nodeExternals = require('webpack-node-externals');

var sharedConfig = {
    devtool: 'source-map',

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
        ]
    },

    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
    },
    // Suppress fatal error: Cannot resolve module 'fs'
    // @relative https://github.com/pugjs/pug-loader/issues/8
    // @see https://github.com/webpack/docs/wiki/Configuration#node
    node: {
        fs: 'empty',
        child_process: 'empty'
    },
    plugins: [
        new CleanWebpackPlugin(['dist'])
    ]
};


var mainConfig = {
    ...sharedConfig,
    // mode: process.env.NODE_ENV || 'development',
    name: 'main',
    entry: './index.tsx',
    output: { filename: './dist/particlegame.js' },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
};
var testConfig = {
    ...sharedConfig,
    // mode: 'development',
    name: 'test',
    entry: './test/index.ts',
    output: { filename: './dist/test.js' },
    // externals: [nodeExternals()]
};

module.exports = [mainConfig, testConfig];