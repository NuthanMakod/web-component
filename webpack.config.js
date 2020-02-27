const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); //installed via npm
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "my-first-webpack.bundle.js"
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "css-loader"
          //   {
          //     loader: "css-loader",
          //     options: {
          //       modules: {
          //         localIdentName: "[local]"
          //       }
          //     }
          //   }
        ]
      },
      {
        test: /\.html$/i,
        loader: "html-loader"
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "[name].css" }),
    new HtmlWebpackPlugin({ template: "./src/index.html" })
  ]
};
