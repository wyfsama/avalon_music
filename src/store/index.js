import Vue from 'vue'
import Vuex from 'vuex'
import request from '../network/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: [
      {
        id: 515143066,
        title: 'Time after time ～花舞う街で～',
        artist: '倉木麻衣',
        src: 'http://m8.music.126.net/20210721233736/e62c7e4d66fd17a2cb0d7f28bfa775f7/ymusic/d55d/2230/85d2/70528193634799ac251c4be2fe71d08a.mp3',
        pic: 'https://p1.music.126.net/XbDlX1f7r0cgY42O2yyoaw==/109951163049831563.jpg',
        lrc: '[00:00.000] 作词 : 倉木麻衣\n[00:01.000] 作曲 : 大野爱果\n[00:11.20]もしも君にめぐり逢えたら\n[00:16.40]二度と君の手を離さない\n[00:21.20]春の終わり告げる\n[00:24.90]花御堂\n[00:26.20]霞む花一枚\n[00:31.80]蘇る思い出の歌\n[00:37.90]この胸に今も優しく\n[00:44.50]Time after time\n[00:46.00]君と出逢った奇跡\n[00:49.20]緩やかな風吹く街で\n[00:54.20]そっと手を繋ぎ歩いた坂道\n[01:00.60]今も忘れない約束\n[01:21.80]風に君の声が聞こえる\n[01:27.00]薄氷冴返る遠い記憶\n[01:31.10]傷付く怖さを知らず誓った\n[01:36.70]いつかまたこの場所で\n[01:41.50]巡り逢おう薄紅色の\n[01:46.10]季節が来る日に笑顔で\n[01:54.50]Time after time\n[01:55.90]ひとり花舞う街で\n[01:59.90]散らざるときは戻らないけれど\n[02:04.60]あの日と同じ変わらない景色に\n[02:10.40]涙ひらり待っていたよ\n[02:20.40]風舞う花びらが\n[02:26.60]水面を撫でるように\n[02:31.80]大切に想うほど切なく\n[02:43.30]人は皆孤独と言うけれど\n[02:48.50]探さずにはいられない誰かを\n[02:54.60]儚く壊れやすいものばかり\n[02:59.60]追い求めてしまう\n[03:06.00]Time after time\n[03:07.20]君と色づく街で出逢えたら\n[03:13.40]もう約束はいらない\n[03:16.70]誰よりもずっと\n[03:19.50]傷付きやすい君の\n[03:22.30]そばにいたい今度は\n[03:26.70]きっと\n'
      }
    ]
  },
  mutations: {
    // 添加 前面插入音乐
    addMusic(state, item) {
      state.list = state.list.filter((i) => i.id !== item.id)
      state.list.unshift(item)
    },
    // 后面插入
    addMusic1(state, item) {
      state.list = state.list.filter((i) => i.id !== item.id)
      state.list.push(item)
    },
    // 清除当前歌单
    clear(state) {
      state.list = []
    }
  },
  actions: {
    // 获取所有
    async getList(context, payload) {
      // const res = {}
      // console.log(payload)
      // payload={id,insert:true} true单曲 前面插入   false歌单 后面加入
      const [{ data: data1 }, { data: data2 }, { data: data3 }] = await Promise.all([
        context.dispatch('getSrc', payload.id),
        context.dispatch('getInfo', payload.id),
        context.dispatch('getLyric', payload.id)
      ])
      console.log(data3)
      const lrc = data3.nolyric || data3.uncollected ? '[00:00.000]暂时没有歌词，需热心网友提供' : data3.lrc.lyric
      const res = {
        id: payload.id,
        title: data2.songs[0].name,
        artist: data2.songs[0].ar[0].name,
        src: data1.data[0].url,
        pic: data2.songs[0].al.picUrl,
        lrc
      }
      console.log(res)
      if (payload.insert) {
        context.commit('addMusic', res)
      } else {
        context.commit('addMusic1', res)
      }
    },
    // 获取歌曲src  /song/url?id=33894312
    getSrc(context, id) {
      return new Promise((resolve, reject) => {
        request(`/song/url?id=${id}`).then(res => resolve(res), err => reject(err))
      })
    },
    // 获取歌曲其他信息 title pic artist /song/detail?ids=347230
    getInfo(context, id) {
      return new Promise((resolve, reject) => {
        request(`/song/detail?ids=${id}`).then(res => resolve(res), err => reject(err))
      })
    },
    // 获取歌词
    getLyric(context, id) {
      return new Promise((resolve, reject) => {
        request(`/lyric?id=${id}`).then(res => resolve(res), err => reject(err))
      })
    },
  },
  modules: {

  }
})
