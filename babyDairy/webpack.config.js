var path = require('path');
var webpack = require("webpack");
module.exports = {
    devtool: "source-map",
    // entry: ['webpack-dev-server/client?http://0.0.0.0:8080',//资源服务器地址
    //         'webpack/hot/only-dev-server',
    //         './src/main.js',
    //         './src/photomain.js'
    //         ],
    entry: {
            main:'./src/main.js',
            photomain:'./src/photomain.js'
            },
    output: {
        publicPath: "http://localhost:8080/dist/",
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        inline: true
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
            // use: ExtractTextPlugin.extract({
            //     use: 'css-loader'
            // })
            },
            {
              test: /\.js$/,
              exclude: /(node_modules)/,
              use: [{
                loader: 'babel-loader',
                options: {
                  presets: ['es2015', 'react'],
                  plugins: ['syntax-dynamic-import'
                            ]
                }
              }]
            }
        ]
    },
    resolve: {
        extensions: ['*','.jsx','.js'],
        alias: {
            'jquery': path.resolve(__dirname, 'lib/jquery/jquery.js'),
            // 'pubSubEvent': path.resolve(__dirname, 'lib/util/pubSubEvent.js'),
            // 'util': path.resolve(__dirname, 'lib/util/util.js')
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            // PubSubEvent: 'pubSubEvent',
            // Util: 'util'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
 };