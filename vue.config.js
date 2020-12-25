const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  devServer: {
    proxy: {
      '^/.*': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
    }
  },
  chainWebpack: webpackConfig => {
    const assetsPath = 'static/';
    webpackConfig
        .output
        .filename(path.join(assetsPath, 'js/[name].[chunkhash:8].js'))
        .chunkFilename(path.join(assetsPath, '/js/chunk[id].[chunkhash:8].js'));
    // webpackConfig.module
    //     .rule('css')
    //     .test(/\.css$/)
    //     .use('mini-css')
    //       .loader(MiniCssExtractPlugin.loader)
    //       .end()
    //     .use('css-loader')
    //       .loader('css-loader')
    //       .end()

    webpackConfig.plugin('extract-css')
        .use(MiniCssExtractPlugin, [{
          filename: path.join(assetsPath, 'css/[name].[contenthash:8].css'),
        }]);
  }
}
