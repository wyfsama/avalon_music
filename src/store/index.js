import Vue from 'vue'
import Vuex from 'vuex'
import request from '../network/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: [
      {
        id: 488267633,
        title: '記念撮影',
        artist: 'BUMP OF CHICKEN',
        src: 'http://qwud2atsk.hn-bkt.clouddn.com/BUMP%20OF%20CHICKEN%20-%20%E8%A8%98%E5%BF%B5%E6%92%AE%E5%BD%B1.mp3',
        pic: 'https://p2.music.126.net/SurEwKIT6cDcB2dL1UQTXg==/19012755067719432.jpg',
        lrc: '[00:00.000] 作词 : Motoo Fujiwara\n[00:01.000] 作曲 : Motoo Fujiwara\n[00:16.82]目的や理由のざわめきからはみ出した\n[00:20.75]名付けようのない時間の場所に\n[00:24.63]紙飛行機みたいに ふらふら飛び込んで\n[00:28.71]空の色が変わるのを見ていた\n[00:40.78]遠くに聞こえた 遠吠えとブレーキ\n[00:44.71]一本のコーラを挟んで座った\n[00:48.73]好きなだけ喋って 好きなだけ黙って\n[00:52.73]曖昧なメロディー 一緒になぞった\n[00:56.29]やりたい事がないわけじゃないはずだったと思うけど\n[01:04.45]思い出そうとしたら 笑顔とため息の事ばかり\n[01:11.27]ねぇ きっと迷子のままでも大丈夫\n[01:15.92]僕らはどこへでもいけると思う\n[01:19.66]君は知っていた 僕も気付いていた\n[01:23.83]終わる魔法の中にいた事\n[01:36.72]昨日と似たような繰り返しの普通に\n[01:40.75]少しずつこっそり時間削られた\n[01:44.66]瞬きの向こうに いろいろいくつも\n[01:48.76]見落としたり 見落としたふりしたり\n[01:52.76]あれほど近くて だけど触れなかった\n[01:56.67]冗談と沈黙の奥の何か\n[02:00.75]ポケットには鍵と 丸めたレシートと\n[02:04.85]面倒な本音を つっこんで隠していた\n[02:08.26]固まって待ったシャッター\n[02:11.93]レンズの前で並んで\n[02:16.35]とても楽しくて ずるくて\n[02:20.02]あまりに眩しかった\n[02:22.97]そして今 想像じゃない未来に立って\n[02:27.94]相変わらず同じ怪我をしたよ\n[02:31.97]掌の上の 動かない景色の中から\n[02:36.71]僕らが僕を見ている\n[03:12.84]目的や理由のざわめきに囲まれて\n[03:16.64]覚えて慣れて ベストを尽くして\n[03:20.58]聞こえた気がした 遠吠えとブレーキ\n[03:24.69]曖昧なメロディー 一人でなぞった\n[03:28.22]言葉に直せない全てを 紙飛行機みたいに\n[03:36.24]あの時二人で見つめた レンズの向こうの世界へ\n[03:45.35]投げたんだ\n[03:46.36]想像じゃない未来に立って\n[03:49.98]僕だけの昨日が積み重なっても\n[03:54.15]その昨日の下の 変わらない景色の中から\n[03:58.85]ここまで繋がっている\n[04:02.65]迷子のままでも大丈夫\n[04:05.96]僕らはどこへでもいけると思う\n[04:09.95]君は笑っていた 僕だってそうだった\n[04:14.11]終わる魔法の外に向けて\n[04:17.89]今僕がいる未来に向けて\n'
      }
    ],
    userData: {
      userInfo: '',
      islogin: false
    }
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
    },
    addUserData(state, item) {
      state.userInfo = item
      state.islogin = true
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
