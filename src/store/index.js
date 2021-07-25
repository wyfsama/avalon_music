import Vue from 'vue'
import Vuex from 'vuex'
import request from '../network/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    list: [
      {
        id: 1861640530,
        title: '变废为宝',
        artist: '薛之谦',
        src: 'https://audio04.dmhmusic.com/71_53_T10061435731_128_4_1_0_sdk-cpm/cn/0101/M00/63/0A/ChR45WDxF1qAMO5hAEQr-QH1jSU801.mp3?xcode=c019d4c9d20e1274895ca638e1a81722d705e50',
        pic: 'https://img01.dmhmusic.com/0104/M00/63/13/ChR45GD2fb2ATkJeAFF4sAIDw5g588.jpg',
        lrc: '[00:00.000] 作词 : 薛之谦/茶茶\n[00:01.000] 作曲 : 茶茶\n[00:02.000] 编曲 : 茶茶\n[00:03.000] 制作人 : 茶茶 @NayyaTea Studio\n[00:14.85]我希望\n[00:18.42]有一天我会长出翅膀\n[00:25.80]遨游在浩瀚宇宙的海洋\n[00:30.81]不用氧只靠光\n[00:37.29]我多么希望\n[00:41.52]世界上不会再有争吵\n[00:48.93]等到世间万物睡个好觉\n[00:53.97]再把你拥抱\n[01:00.03]有那一天\n[01:05.22]燕子在浪里奔跑\n[01:11.04]大人们都在傻笑\n[01:17.19]温度也刚刚好\n[01:22.89]会有那一天\n[01:28.32]你把我变废为宝\n[01:34.17]等到我们都释怀不少\n[01:40.26]就把你忘掉\n[02:07.71]我希望\n[02:11.25]有一天我们有个收场\n[02:18.39]先去趟所有没去的地方\n[02:23.49]看蓝雨看极光\n[02:30.09]我多么希望\n[02:34.35]有一天人们开始和好\n[02:41.58]不用再确认万物都睡着\n[02:46.50]才能给你拥抱\n[02:52.71]有那一天\n[02:57.78]你会拽着我逃跑\n[03:03.57]你先长出了羽毛\n[03:09.66]成为我的困扰\n[03:15.45]会有那一天\n[03:20.82]你把我变废为宝\n[03:26.67]等到我们都释怀不少\n[03:32.70]就会把你忘掉\n[03:55.80]会有那一天\n[04:01.35]你把我变废为宝\n[04:07.17]反正还是次千了百了\n[04:16.89]就别重归于好\n[04:18.652] 吉他 : 劳国贤\n[04:21.215] 和声 : 茶茶/迪迪\n[04:23.778] 弦乐团 : 国际首席爱乐乐团\n[04:26.341] 大提琴独奏 : 郎莹\n[04:28.904] 弦乐监制 : 胡静成\n[04:31.467] 弦乐录音 : 王小四 @金田录音棚\n[04:34.030] 人声录音 : 何欣 @音合百纳\n[04:36.593] 人声编辑 : 何欣/汝文博 @SBMS Beijing\n[04:39.156] 混音/母带 : 赵靖 @SBMS Beijing\n'
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
