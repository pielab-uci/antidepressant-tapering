const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', 'css'],
  },

  entry: {
    app: './src/index',
  },

  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
  },

  plugins: [new HtmlWebpackPlugin({
    filename: 'index.html',
    title: 'Supporting Tapering Antidepressants',
    template: './src/index.html'
  }),
  ],
}
