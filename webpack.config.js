const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');


module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './main.js',
  output: {
    filename: '[name].[chunkhash].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        presets: ['es2015']
      }
    }]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, 'dist/index.html'),
      template: './index.html',
      inject: 'body',
      minify: {
        removeComments: true,
        collapseWhitespace: false      
      }
    })
  ],
  devServer: {
    contentBase: './dist',
    inline: true,
    progress: true
  }
}