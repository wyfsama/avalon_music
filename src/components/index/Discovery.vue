<template>
  <div class="discovery">
    <!-- 轮播图 -->
    <Banner :pic-list="picList" />
    <dailySongList :daily-songlist="dailySongList" />
    <newSongs :new-song="newsong" />
    <rcmMv :rcm-mv="rcmMv"/>
  </div>
</template>

<script>
import Banner from '@/components/index/discovery/Banner'
import dailySongList from '@/components/index/discovery/dailySongList'
import newSongs from '@/components/index/discovery/newSongs'
import rcmMv from '@/components/index/discovery/rcmMv'
export default {
  async created() {
    // 获取banner
    const {
      data: { banners },
    } = await this.request('/banner?type=2')
    this.picList = banners.splice(0, 6)
    // 获取每日歌单
    const {
      data: { result },
    } = await this.request('/personalized?limit=15')
    this.dailySongList = result.splice(0, 15)
    // 最新音乐
    const {
      data: { result: newsongRes },
    } = await this.request('/personalized/newsong')
    this.newsong = newsongRes
    // mv
    const {
      data: { result: rcmMv },
    } = await this.request('/personalized/mv')
    this.rcmMv = rcmMv
  },
  data() {
    return {
      picList: null,
      dailySongList: null,
      newsong: null,
      rcmMv: null
    }
  },
  components: {
    Banner,
    dailySongList,
    newSongs,
    rcmMv
  },
}
</script>

<style  lang="scss" scoped>
.discovery {
  width: 75%;
  display: flex;
  flex-direction: column;
  // align-items: center;
}
</style>
