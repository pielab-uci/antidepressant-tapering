const {merge} = require("webpack-merge");
const common = require("./webpack.common");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  // devtool: 'eval',
  // output: {
  //   publicPath: '/dist/',
  // },
  module: {
    rules: [
      {test: /.tsx?$/, loader: 'awesome-typescript-loader'},
      {
        test: /.css$/, use: ['style-loader', 'css-loader'],
      },
      // {
      //   test: /\.(woff|woff2)$/i,
      //   type: 'asset/resource',
      // }
    ],
  },
  devServer: {
    hot: true,
    publicPath: '/',
    historyApiFallback: {
      index: './dist/index.html'
    },
    writeToDisk: true,
  },
  // plugins: [
  //   new BundleAnalyzerPlugin(),
  // ]
});
