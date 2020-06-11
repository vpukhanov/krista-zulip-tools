const path = require('path');

module.exports = {
    entry: {
        'content-script': './src/content-script/index.js',
        options: './src/options/index.js',
        background: './src/background/index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/js')
    }
};
