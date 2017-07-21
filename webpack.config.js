var path =require('path');
module.exports = {
    watch:true,
    entry: {
        example:"./example/example.js"
    },
    output: {
        publicPath:'/dist/',
        path: path.join(__dirname,'dist'),
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: /\.js[x]?$/,
                loader: "babel-loader",
                exclude: /node_modules/
            }
        ],
        resolve: {
            extensions: ['', '.js', '.jsx']
        }
    }
};