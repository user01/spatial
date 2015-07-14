//var webpack = require( 'webpack' ); //Comment this out if you want to use the noErrorsPlugin below

module.exports = {
    //The sources of this app are made from a Typescript file and a Less file,
    //These "entry points" will both respectively import their Typescript aand less dependencies
    entry: {
        app: [
            './tests/segment-tests.ts',
        ]
    },
    //The output is a single bundle of js and css which is loaded by index.html
    output: {
        path: './build/', //Path where bundle.js is generated on the file system
        publicPath: '', //Relative parent URL of the bundle
        filename: 'spatial.min.js'
    },
    //The list of extension that will be resolved for modules
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    // ts-jsx-loader: will transform the React.jsx calls with the passed JSX into React Typescript
    // ts-loader will transpile the Typescript into Javascript
    module: {
        loaders: [
            {test: /\.ts$/, loader: 'ts-loader?sourceMap'}
        ]
    }
};
