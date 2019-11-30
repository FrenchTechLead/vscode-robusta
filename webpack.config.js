const path = require('path');

// devtool: 'source-map', option to debug
/**@type {import('webpack').Configuration}*/
const config = {
    devtool: 'source-map',
    target: 'node',

    entry: './src/extension.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'extension.js',
        libraryTarget: "commonjs2",
        devtoolModuleFilenameTemplate: "../[resource-path]",
    },
    externals: {
        vscode: "vscode"
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [{
                loader: 'ts-loader',
                options: {
                    compilerOptions: {
                        "module": "es6"
                    }
                }
            }]
        }]
    },
}

module.exports = config;