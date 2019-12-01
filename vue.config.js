// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  productionSourceMap: true,
  transpileDependencies: ["buefy"],
  lintOnSave: true,
  filenameHashing: true,
  // pluginOptions: {
  //   webpackBundleAnalyzer: {
  //     openAnalyzer: false
  //   }
  // }
  configureWebpack: {
    optimization: {
      splitChunks: {
        minSize: 50000,
        maxSize: 250000
      }
    },
    plugins: [
      new CompressionPlugin({
        test: /\.js(\?.*)?$/i,
        filename: "[path].gz[query]",
        algorithm: "gzip"
      })
    ]
  }
};