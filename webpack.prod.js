const { merge } = require("webpack-merge")
const common = require("./webpack.common")
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
  mode: 'production',
  devtool: 'hidden-source-map',
  output: {
    // publicPath: '/',
    publicPath: '/antidepressant-tapering'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
  },
})
