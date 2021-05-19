const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',

  devServer: {
    hot: true,
    publicPath: '/dist/',
    historyApiFallback: {
      index: './dist/index.html'
    },
  },
});
