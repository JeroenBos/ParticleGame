const nodeEnv = process.env.NODE_ENV || 'development';
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    // entry: './index.tsx', output: { filename: 'dist/particlegame.js' },
    entry: './test/test.ts', output: { filename: 'dist/test.js' },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },
    // uncommenting the following would be a performance optimization (use browser caching)
    // externals: {
    //     "react": "React",
    //     "react-dom": "ReactDOM"
    // },
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