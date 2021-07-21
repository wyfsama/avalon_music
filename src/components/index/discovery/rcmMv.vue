<template>
  <div class="container">
    <h1 class="title">推荐MV</h1>
    <ul>
      <li v-for="item in rcmMv" :key="item.id" @click="toMvDetail(item.id)">
        <div class="img-wrap">
          <img :src="item.picUrl" alt="" />
          <div class="count">{{ item.playCount }}</div>
        </div>
        <div class="mvInfo">
          <div class="dec">{{ item.name }}</div>
          <div class="artist">{{ item.artists[0].name }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    rcmMv: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {}
  },
  components: {},
  methods: {
    toMvDetail(id) {
      this.$router.push(`/mv?id=${id}`)
    },
  },
}
</script>

<style  lang="scss" scoped>
.container {
  padding: 0 0.3125rem;
  .title {
    font-size: 1.25rem;
    font-weight: 400;
  }
  ul {
    display: flex;
    justify-content: space-between;
    li {
      cursor: pointer;
      width: 15.625rem;
      margin-top: 1rem;
      .img-wrap {
        position: relative;
        img {
          width: 100%;
          border-radius: 0.625rem;
        }
        .count {
          position: absolute;
          color: #eee;
          top: 0.3125rem;
          right: 0.3125rem;
        }
      }
      .mvInfo {
        margin-top: 0.3125rem;
        .artist {
          color: #999;
          font-size: 0.875rem;
        }
      }
    }
  }
}
</style>
