const path = require("path");

module.exports = {
  mode: "development",
  devtool: "source-map",
  // devtool: "eval",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },

  entry: {
    app: "./index",
  },

  module: {
    rules: [
      {test: /.tsx?$/, loader: "awesome-typescript-loader"},
      {test: /.css$/, use: ['style-loader', 'css-loader']}],
  },

  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist"),
    publicPath: "/dist/",
  },

  devServer: {
    hot: true,
    publicPath: "/dist/",
  },
};
