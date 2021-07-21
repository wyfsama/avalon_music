<template>
  <div class="index flex">
    <div class="nav">
      <el-menu
        :default-active="this.$route.path.slice(1)"
        class="el-menu-demo"
        @select="handleSelect"
        background-color="#f9f9f9"
        router
        text-color="#111"
      >
        <el-menu-item index="discovery">发现音乐</el-menu-item>
        <el-menu-item index="playlists">推荐歌单</el-menu-item>
        <el-menu-item index="songs">最新音乐</el-menu-item>
        <el-menu-item index="mvs">最新MV</el-menu-item>
      </el-menu>
      <div class="player">
        <aplayer
          :showLrc="true"
          :mini="mimi"
          :volume="0.2"
          :controls="true"
          :list="list"
          :listFolded="true"
          :music="list[0]"
          :autoplay="true"
          theme="pic"
        ></aplayer>
      </div>
    </div>
    <div class="main">
      <router-view></router-view>
      <div class="block"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(['list']),
    mimi() {
      if (this.$parent.$children[0].value === '正常') {
        return false
      } else {
        return true
      }
    },
  },
  components: {},
}
</script>

<style  lang="scss">
.index {
  overflow: auto;
  // height: 100%;
  // overflow: auto;
  margin-top: 3rem;
  .nav {
    user-select: none;
    width: 12.5rem;
    position: fixed;
    z-index: 99;
    top: 2.5rem;
    left: 0;
    bottom: 0;
    .el-menu {
      height: 100%;
      overflow: hidden;
    }
    .player {
      // width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      .aplayer {
        margin: 0;
      }
    }
  }
  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    margin-left: 12.5rem;
    width: 100%;
    padding: 0.625rem 1.25rem;
    .block {
      height: 4.375rem;
    }
  }
}
</style>
