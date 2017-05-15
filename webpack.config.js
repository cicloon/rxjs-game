const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: '#inline-source-map',
  entry: [
    'webpack-dev-server/client?https://0.0.0.0:8080/',
    'webpack/hot/only-dev-server',
    './src/index.js'
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: this.srcPathAbsolute,
        loader: 'eslint-loader',
        enforce: 'pre'
      },
      {
        test: /\.(js|jsx)$/,
        include: path.resolve('./src'),

        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
    // new BundleAnalyzerPlugin()
  ],
  devServer: {
    contentBase: './src/',
    publicPath: '/',
    historyApiFallback: true,
    hot: true,
    inline: true
  },
  output: {
    path: path.resolve('./dev-build'),
    filename: 'app.js',
    // filename: '[name].[hash].js',
    sourceMapFilename: 'app.js.map',
    // chunkFilename: '[id].chunk.js',
    // publicPath: 'http://mycdn.com/'
    devtoolModuleFilenameTemplate: (info) => {
      return `file:///${info.absoluteResourcePath}`;
    }
  }
};

