// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const { BugsnagBuildReporterPlugin } = require('webpack-bugsnag-plugins');

module.exports = {
  productionSourceMap: true,
  transpileDependencies: ['buefy'],
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
        filename: '[path].gz[query]',
        algorithm: 'gzip'
      }),
      new BugsnagBuildReporterPlugin(
        {
          apiKey: 'YOUR_API_KEY',
          appVersion: '0.0.2'
        },
        {
          /* opts */
        }
      )
    ]
  }
};
