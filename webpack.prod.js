const {merge} = require("webpack-merge")
const common = require("./webpack.common")
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
  mode: 'production',
  devtool: 'hidden-source-map',
  output: {
    // publicPath: '/',
    publicPath: '/antidepressant-tapering/'
  },
  module: {
    rules: [
      // {test: /.css$/, use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader']},
      {test: /.tsx?$/, loader: 'awesome-typescript-loader'},
      {
        test: /.css$/, use: [
          {loader: MiniCssExtractPlugin.loader, options: {esModule: false}},
          {loader: 'css-loader'}
        ]
      },
      {
        test: /\.(woff|woff2)$/i,
        type: 'asset/resource',
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ],
    splitChunks: {
      chunks: 'all',
    }
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ]
});
