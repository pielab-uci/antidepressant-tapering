const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  // devtool: "eval",
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  entry: {
    app: './src/index',
  },

  module: {
    rules: [
      { test: /.tsx?$/, loader: 'awesome-typescript-loader' },
      { test: /.css$/, use: ['style-loader', 'css-loader'] }],
  },

  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
  },

  plugins: [ new HtmlWebpackPlugin({
    filename: 'index.html',
    title: 'Supporting Tapering Antidepressants',
    template: './src/index.html'
  }) ],

  devServer: {
    hot: true,
    publicPath: '/dist/',
    historyApiFallback: {
      index: './dist/index.html'
    },
    writeToDisk: true,
  },
};
