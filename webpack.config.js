const webpack = require("webpack");

module.exports = {
    entry: {
        main: "./src/index.ts",
    }, 
    output: {
        filename: "bundle.js",
        path: "./dist",
    },
    module: {
        rules: [
            {
                test:/\.ts$/,
                exclude: ["node_moudles", "public"],
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["env"],
                    },
                },
            },
        ],
    },
    plugins: [new webpack.optimize.UglifyJsPlugin()],
}