export default {
  filters: {
    // 格式化时间戳 补0  00：00
    formatDuration(duration) {
      const min = parseInt(duration / 1000 / 60).toString().padStart(2, '0')
      const second = parseInt(duration / 1000 % 60).toString().padStart(2, '0')
      return min + ':' + second
    },
    // 格式化时间
    formatTime(timestamp, format = 'y/m/d h:M:s') {
      const time = new Date(timestamp)
      const y = time.getFullYear()
      const m = time.getMonth() + 1
      const d = time.getDate()
      const h = time.getHours()
      const M = time.getMinutes()
      const s = time.getSeconds()
      const obj = {
        y, m, d, h, M, s
      }
      for (const key in obj) {
        const newNum = obj[key].toString().padStart(2, '0')
        format = format.replace(key, newNum)
      }
      return format
    },
    //  播放量省略 超过10W
    omitPlayCount(val) {
      if (val > 100000) {
        return parseInt(val / 10000) + '万'
      } else {
        return val
      }
    }
  }
}
