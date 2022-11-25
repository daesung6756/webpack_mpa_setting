const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
require('style-loader');
const siteOption = require('./src/siteOption.json');

const devMode = process.env.NODE_ENV !== 'production';

// task
const { entry, htmlPlugins } = require('./task/entry-points');
const { generatePages } = require('./task/generate-pages');

const utilPlugins = [
    // new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
        filename: (pathData) => {
            let res;
            if(pathData.chunk.name === 'clientlib-common') {
                res = './assets/clientlib-common/css/main.css';
            } else {
                res = './components/[name]/clientlibs/css/main.css';
            }
            return res;
        },
        chunkFilename: '[id].css',
        ignoreOrder: false,
    }),

    new CopyPlugin({
        patterns: [
            { from: 'src/assets/clientlib-common/resources', to: 'assets/clientlib-common/resources' },
            { from: 'src/assets/clientlib-base/resources', to: 'assets/clientlib-base/resources' },
            { from: 'src/assets/clientlib-lang', to: 'assets/clientlib-lang' },
            { from: 'src/assets/clientlib-base/js/vendors.js', to: 'assets/clientlib-base/js/vendors.js' },
        ]
    }),
];

const pageHtmlPlugins = [
    new HtmlWebpackPlugin({
        inject: false,
        minify: false,
        template: './src/index.html',
        filename: './index.html',
    })
];

const pages = generatePages(siteOption);
const plugins = utilPlugins.concat(pageHtmlPlugins).concat(htmlPlugins).concat(pages);

module.exports = {
    mode: devMode ? 'development' : 'production',
    devtool: devMode ? 'source-map' : false,
    entry: entry,
    output: {
        path: path.resolve(__dirname, './build'),
        filename: (pathData) => {
            let res;
            if(pathData.chunk.name === 'clientlib-common') {
                res = './assets/clientlib-common/js/main.js';
            } else if(pathData.chunk.name === 'vendors') {
                res = './assets/clientlib-base/js/[name].js';
            } else {
                res = './components/[name]/clientlibs/js/main.js';
            }

            return res;
        },
    },
    optimization: {
        minimize: false,
    },
    externals: {
        'jquery': 'jQuery',
        'gsap': 'gsap',
        'gsap/all': 'window',
        'gsap/ScrollTrigger': 'window',
        'locomotive-scroll': 'LocomotiveScroll',
        'swiper': 'Swiper',
    },
    module: {
        rules: [
            { test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            { test: /\.s[ac]ss$/,
                use: [
                    // devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            url: false
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                outputStyle: 'expanded'
                            }
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(html|hbs)$/,
                loader: 'handlebars-loader',
                options: {
                    runtime: path.resolve(__dirname, './task/handlebars-helper'),
                    precompileOptions: {
                        knownHelpersOnly: false,
                    }
                },
                exclude: /node_modules/
            },
            { test: /\.(png|jpe?g|gif|mp4)$/i, loader: 'file-loader', options: {
                    name: '[name].[ext]',
                    outputPath: './assets/img',
                    publicPath: './assets/',
                }},
        ]
    },
    plugins: plugins,
    devServer: {
        static: {
            directory: path.join(__dirname, 'src'),
        },
        port: 3000,
        historyApiFallback: {
            index: 'index.html'
        },
        open: true,
    },
};