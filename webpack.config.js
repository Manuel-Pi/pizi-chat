const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    mode: "production",

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    entry: [
        "./src/api/index.tsx"
    ],

    output:{
        libraryTarget: 'umd',
        globalObject: 'this',
        path: path.resolve(__dirname, 'api')
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx",".js", ".jsx", ".less"]
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.less$/,
                use: [
                    'to-string-loader',
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    "less-loader"
                ]
            }
        ]
    },
    plugins:[
        /*new webpack.DefinePlugin({
            ENV_PORT: JSON.stringify(process.env.PORT),
        }),*/
        new CopyPlugin({
            patterns: [
                {
                    from: "src/server",
                    to: "server"
                }
            ],
        })
    ],

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
}
