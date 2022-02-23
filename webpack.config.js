const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');


module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: './js/main.js',
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        splitChunks: {
          chunks: 'all',
        },
    },
    devServer: {
        static: './dist',
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
        }),
        new CleanWebpackPlugin(),
        new FaviconsWebpackPlugin({
            logo: './img/favicon.png', 
            mode: 'webapp', 
            devMode: 'webapp', 
            // favicons: {
            //   appName: 'cinema',
            //   appDescription: 'Cinema',
            //   developerName: 'Cinema',
            //   developerURL: null, 
            //   background: '#ddd',
            //   theme_color: '#333',
            //   icons: {
            //     coast: false,
            //     yandex: false
            //   }
            // }
          })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: './css/'
                    }
                }],
            },
            {
                test: /\.css$/i,
                loader: 'css-loader',
                options: {
                  url: true,
                },
              },
            {
                test: /\.(png|svg|jpeg|gif)$/,
                use: [ {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: './img/'
                    }
                } ],

            },
        ]
    }
}