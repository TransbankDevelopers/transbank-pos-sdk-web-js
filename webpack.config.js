const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = [
  {
    mode: "production",
    entry: "./src/pos.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "pos.js",
      library: "Transbank",
      libraryTarget: "umd",
      globalObject: "this"
    },
    module: {
      rules: [
      ]
    },
    devtool: "source-map",
    optimization: {
      minimize: true
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [{ from: "types", to: "." }]
      })
    ]
  },
  {
    mode: "production",
    entry: "./src/pos.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "pos.esm.js",
      library: {
        type: "module"
      }
    },
    module: {
      rules: [
      ]
    },
    devtool: "source-map",
    optimization: {
      minimize: true
    },
    experiments: {
      outputModule: true
    }
  }
];
