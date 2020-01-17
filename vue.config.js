// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const { BugsnagBuildReporterPlugin } = require('webpack-bugsnag-plugins');
const version = require('./package.json').version;

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
      moduleIds: 'hashed',
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
          apiKey: 'edc6bef4ba5072a2d6781cd94c75be7c',
          appVersion: version
        },
        {
          /* opts */
        }
      )
    ]
  }
};
