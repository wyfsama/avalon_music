<template>
  <div class="dailysl">
    <h1 class="title">推荐歌单</h1>
    <div class="content">
      <ul>
        <li v-for="item in dailySonglist" :key="item.id">
          <div class="sl-cover" @click="toPlaylistDetail(item.id)">
            <img :src="item.picUrl" alt="" />
            <div class="tag">热门推荐</div>
          </div>
          <div class="sl-introduction">
            {{ item.name }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dailySonglist: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {}
  },
  methods: {
    toPlaylistDetail(id) {
      this.$router.push(`/playlist?id=${id}`)
    },
  },
  components: {},
}
</script>

<style  lang="scss" scoped>
.dailysl {
  padding: 0 0.3125rem;
  .title {
    font-size: 1.25rem;
    font-weight: 400;
  }
  .content {
    display: flex;
    justify-content: center;
    margin: 0.5rem auto;
    ul {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      font-size: 0.875rem;
      li {
        width: 15rem;
        padding: 0.625rem;
        .sl-cover {
          position: relative;
          overflow: hidden;
          border-radius: 0.5rem;
          .tag {
            position: absolute;
            background: rgba(6, 6, 6, 0.5);
            top: -2rem;
            left: 0;
            right: 0;
            color: #eee;
            height: 2rem;
            line-height: 2rem;
            text-align: center;
            transition: all 0.3s ease-in-out;
          }
          img {
            width: 100%;
            border-radius: 0.5rem;
            cursor: pointer;
          }
          &:hover .tag {
            top: 0;
          }
        }
      }
    }
  }
}
</style>
