module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/avalon_music/dist/'
    : '/',
  devServer: {
    port: 1111,
    open: true
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Avalon Music-一个好用的音乐播放器'
        return args
      })
  }
}
