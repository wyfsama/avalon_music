<template>
  <div class="palylists-container">
    <div class="top-card">
      <div class="icon-wrap">
        <img :src="playlists[0].coverImgUrl" alt="" />
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <div class="desc">{{ playlists[0].name }}</div>
        <div class="div info">{{ playlists[0].description }}</div>
      </div>
      <img class="bg" :src="playlists[0].coverImgUrl" alt="" />
      <div class="bg-mask"></div>
    </div>
    <div class="tab-container">
      <div class="tab-bar">
        <span
          :class="selected === '全部' ? 'active' : ''"
          @click="selected = '全部'"
          >全部</span
        >
        <span
          :class="selected === '欧美' ? 'active' : ''"
          @click="selected = '欧美'"
          >欧美</span
        >
        <span
          :class="selected === '华语' ? 'active' : ''"
          @click="selected = '华语'"
          >华语</span
        >
        <span
          :class="selected === '流行' ? 'active' : ''"
          @click="selected = '流行'"
          >流行</span
        >
        <span
          :class="selected === '说唱' ? 'active' : ''"
          @click="selected = '说唱'"
          >说唱</span
        >
        <span
          :class="selected === '摇滚' ? 'active' : ''"
          @click="selected = '摇滚'"
          >摇滚</span
        >
        <span
          :class="selected === '民谣' ? 'active' : ''"
          @click="selected = '民谣'"
          >民谣</span
        >
        <span
          :class="selected === '电子' ? 'active' : ''"
          @click="selected = '电子'"
          >电子</span
        >
        <span
          :class="selected === '轻音乐' ? 'active' : ''"
          @click="selected = '轻音乐'"
          >轻音乐</span
        >
        <span
          :class="selected === '影视原声' ? 'active' : ''"
          @click="selected = '影视原声'"
          >影视原声</span
        >
        <span
          :class="selected === 'ACG' ? 'active' : ''"
          @click="selected = 'ACG'"
          >ACG</span
        >
        <span
          :class="selected === '怀旧' ? 'active' : ''"
          @click="selected = '怀旧'"
          >怀旧</span
        >
      </div>
      <div class="tab-content">
        <ul>
          <li v-for="item in list" :key="item.id">
            <div class="sl-cover" @click="toPlaylistDetail(item.id)">
              <img :src="item.coverImgUrl" alt="" />
              <div class="tag">播放量：{{ item.playCount }}</div>
            </div>
            <div class="name">{{ item.name }}</div>
          </li>
        </ul>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="2"
        :page-sizes="[5, 10, 15, 20, 25]"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginationData.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.getTop(1, this.selected)
    this.getPlayLists(10, this.selected)
  },
  data() {
    return {
      // 顶部
      playlists: null,
      // 主体部分
      list: null,
      selected: '全部',
      paginationData: {
        total: 0,
        page: 0,
        size: 10,
      },
    }
  },
  watch: {
    selected(val) {
      this.getTop(1, val)
      this.getPlayLists(10, val)
    },
  },
  methods: {
    async getTop(limit, cat) {
      const {
        data: { playlists },
      } = await this.request({
        url: '/top/playlist/highquality',
        params: {
          limit,
          cat,
        },
      })
      this.playlists = playlists
    },
    async getPlayLists(limit, cat, offset = 0) {
      const { data } = await this.request({
        url: '/top/playlist',
        params: {
          limit,
          cat,
          offset,
        },
      })
      this.list = data.playlists
      this.paginationData.total = data.total
      // console.log(data)
    },
    handleSizeChange(val) {
      this.paginationData.size = val
      this.getPlayLists(this.paginationData.size, this.selected)
    },
    handleCurrentChange(val) {
      this.paginationData.page = val
      this.getPlayLists(
        this.paginationData.size,
        this.selected,
        this.paginationData.page
      )
    },
    toPlaylistDetail(id) {
      this.$router.push(`/playlist?id=${id}`)
    },
  },
  components: {},
}
</script>

<style  lang="scss" scoped>
.palylists-container {
  width: 75%;
  display: flex;
  flex-direction: column;
  // overflow: hidden;
  .top-card {
    padding: 1.25rem;
    height: 12.5rem;
    display: flex;
    background: #999;
    border-radius: 0.625rem;
    overflow: hidden;
    position: relative;
    .icon-wrap {
      z-index: 1;
      img {
        width: 10rem;
      }
    }
    .content-wrap {
      margin-left: 0.9375rem;
      flex: 1;
      z-index: 1;

      .tag {
        border-radius: 0.25rem;
        padding: 0.25rem 0.625rem;
        text-align: center;
        width: 5.5rem;
        color: #dfac67;
        border: 1px solid #dfac67;
      }
      .desc {
        color: #fff;
        font-weight: 200;
        margin-top: 0.3125rem;
      }
      .info {
        color: #999;
        font-size: 0.875rem;
        font-weight: 200;
        margin-top: 0.3125rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
      }
    }
    .bg {
      position: absolute;
      width: 100%;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      filter: blur(20px);
      // z-index: 0;
    }
    .bg-mask {
      z-index: 0;
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
  .tab-container {
    margin: 1.875rem 0;
    .tab-bar {
      display: flex;
      justify-content: flex-end;
      span {
        margin: 0 0.3125rem;
        font-size: 0.875rem;
        color: #999;
        cursor: pointer;
        user-select: none;
      }
      .active {
        color: red;
      }
    }
    .tab-content {
      ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        li {
          width: 12.5rem;
          margin: 0.9375rem;
          font-size: 0.875rem;
          .sl-cover {
            cursor: pointer;
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
              border-radius: 0.3125rem;
              // height: 250px;
            }
            &:hover .tag {
              top: 0;
            }
          }
        }
      }
    }
  }
  .el-pagination {
    text-align: center;
    margin-top: 0.625rem;
  }
}
</style>
