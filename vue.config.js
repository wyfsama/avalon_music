module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/avalon_music/dist/'
    : '/',
  devServer: {
    port: 1111,
    open: true
  }
}
