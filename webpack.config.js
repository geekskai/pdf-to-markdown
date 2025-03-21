var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");

var SOURCE_DIR = path.resolve(__dirname, "src");
var JAVASCRIPT_DIR = SOURCE_DIR + "/javascript";
var BUILD_DIR = path.resolve(__dirname, "build");
var NODEMODULES_DIR = path.resolve(__dirname, "node_modules");

module.exports = {
  mode: "development",
  context: SOURCE_DIR,
  resolve: {
    modules: [path.resolve(JAVASCRIPT_DIR), path.resolve("./node_modules")],
  },
  entry: {
    app: "./javascript/index.jsx",
  },
  output: {
    path: BUILD_DIR,
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        // 在 module.rules 中找到处理 CSS 的部分，确保包含 postcss-loader
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.png$/,
        use: ["url-loader?limit=100000"],
      },
      {
        test: /\.jpg$/,
        loader: "file-loader",
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: ["url-loader?limit=10000&mimetype=application/font-woff"],
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: ["url-loader?limit=10000&mimetype=application/octet-stream"],
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: ["file-loader"],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: ["url-loader?limit=10000&mimetype=image/svg+xml"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    new webpack.DefinePlugin({
      "process.env": {
        version: JSON.stringify(process.env.npm_package_version),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development"),
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: NODEMODULES_DIR + "/pdfjs-dist/build/pdf.worker.js",
          to: "bundle.worker.js",
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: NODEMODULES_DIR + "/pdfjs-dist/cmaps",
          to: "cmaps",
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "favicons",
          to: "favicons",
        },
      ],
    }),
  ],
};
