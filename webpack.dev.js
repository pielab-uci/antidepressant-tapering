const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: 'development',
  // devtool: 'source-map',
  devtool: 'eval',
  // output: {
  //   publicPath: '/dist/',
  // },
  devServer: {
    hot: true,
    publicPath: '/',
    historyApiFallback: {
      index: './dist/index.html'
    },
    writeToDisk: true,
  },
});
