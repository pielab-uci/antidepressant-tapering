const path = require("path");

module.exports = {
  mode: "development",
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },

  entry: {
    app: "./index",
  },

  module: {
    rules: [{ test: /.tsx?$/, loader: "awesome-typescript-loader" }],
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
