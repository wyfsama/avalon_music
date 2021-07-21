<template>
  <div class="ns-container">
    <h1 class="title">最新音乐</h1>
    <div class="content">
      <ul>
        <li
          v-for="item in newSong"
          :key="item.id"
          @click="getList({ id: item.id, insert: true })"
        >
          <img :src="item.picUrl" alt="" />
          <div class="song-info">
            <div class="song">{{ item.name }}</div>
            <div class="singer">{{ item.song.artists[0].name }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    newSong: {
      type: Array,
      require: true,
    },
  },
  methods: {
    ...mapActions(['getList']),
  },
  data() {
    return {}
  },
  components: {},
}
</script>

<style  lang="scss" scoped>
.ns-container {
  padding: 0 0.3125rem;
  .title {
    font-size: 1.25rem;
    font-weight: 400;
  }
  .content {
    margin: 1.25rem 0.3125rem;
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      li {
        width: 33.75rem;
        display: flex;
        padding: 0.3125rem 0;
        img {
          width: 5rem;
        }
        .song-info {
          margin: 0 0 0 1rem;
          .singer {
            font-size: 0.875rem;
            color: #999;
            margin-top: 1.25rem;
          }
        }
        &:hover {
          cursor: pointer;
          background: #f5f5f5;
        }
      }
    }
  }
}
</style>
