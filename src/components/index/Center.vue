<template>
  <div class="center">
    <div
      class="userinfo"
      :style="{
        backgroundImage: `url(${userinfo.backgroundUrl})` || '',
      }"
    >
      <div class="simple-info">
        <div class="avatar">
          <img :src="userinfo.avatarUrl" alt="" />
        </div>
      </div>
      <div class="com-info">
        <div class="namelv">
          <div class="name">
            {{ userinfo.nickname }}
          </div>
          <div class="level">Lv {{ level }}</div>
        </div>
        <div class="baseinfo">
          <ul>
            <li>
              <div class="count">{{ userinfo.eventCount }}</div>
              <div class="desc">动态</div>
            </li>
            <li>
              <div class="count">{{ userinfo.followeds }}</div>
              <div class="desc">关注</div>
            </li>
            <li>
              <div class="count">{{ userinfo.follows }}</div>
              <div class="desc">粉丝</div>
            </li>
          </ul>
        </div>
        <div class="other">
          <div class="city">
            <span class="title">所在地区: </span>
            <span class="detail"
              >{{ userinfo.province | matchCity }}
              {{ userinfo.city | matchCity }}</span
            >
          </div>
          <div class="socialSoftArmor">
            <span class="title">社交软件: </span>
            <span class="detail"></span>
          </div>
          <div class="desc">
            <span class="title">个人介绍: </span>
            <span class="detail">{{ userinfo.signature }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="tab-content">
      <h1>你的前十歌单</h1>
      <ul>
        <li v-for="item in userplaylist" :key="item.id">
          <div class="sl-cover" @click="toPlaylistDetail(item.id)">
            <img :src="item.coverImgUrl" alt="" />
            <div class="tag">播放量：{{ item.playCount }}</div>
          </div>
          <div class="name">{{ item.name }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.getLv()
    this.getUserInfo()
    this.getUserPlaylistCount()
  },
  data() {
    return {
      userinfo: '',
      level: '',
      userplaylist: [],
    }
  },
  methods: {
    getUserInfo() {
      this.userinfo = JSON.parse(sessionStorage.getItem('userinfo'))
      this.getUserPlaylist()
    },
    async getLv() {
      const {
        data: {
          data: { level },
        },
      } = await this.request('/user/level')
      this.level = level
    },
    async getUserPlaylist(limit, offset = 0) {
      const {
        data: { playlist },
      } = await this.request({
        url: `/user/playlist?uid=${this.userinfo.userId}`,
        params: {
          limit,
          offset,
        },
      })
      this.userplaylist = playlist.splice(1, 10)
    },
    toPlaylistDetail(id) {
      this.$router.push(`/playlist?id=${id}`)
    },
    // async getUserPlaylistCount() {
    //   const {
    //     data: { createdPlaylistCount, subPlaylistCount },
    //   } = await this.request('/user/subcount')
    //   this.paginationData.total = createdPlaylistCount + subPlaylistCount
    // },
    // handleSizeChange(val) {
    //   this.paginationData.size = val
    //   this.getUserPlaylist(this.paginationData.size, this.paginationData.page)
    // },
    // handleCurrentChange(val) {
    //   this.paginationData.page = val
    //   this.getUserPlaylist(this.paginationData.size, this.paginationData.page)
    // },
  },
  components: {},
}
</script>

<style  lang="scss" scoped>
.el-pagination {
  text-align: center;
  margin-top: 0.625rem;
}
.center {
  display: flex;
  flex-direction: column;
  width: 75%;
  .userinfo {
    border-radius: 20px;
    padding: 10px;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: cover;
    .simple-info {
      .avatar {
        width: 250px;
        img {
          width: 100%;
          border-radius: 100%;
        }
      }
    }
    .com-info {
      flex: 1;
      margin-left: 20px;
      .namelv {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        border-bottom: 1px solid #eee;
        padding-bottom: 20px;
        .name {
          color: #eee;
          font: 800 25px '';
          margin-bottom: 20px;
        }
        .level {
          width: fit-content;
          font-size: 12px;
          padding: 0 6px;
          border-radius: 10px;
          background-color: #eee;
        }
      }
      .baseinfo {
        margin-top: 10px;
        ul {
          display: flex;
          li {
            flex: 1;
            text-align: center;
            &:nth-child(2) {
              border-left: 1px solid #eee;
              border-right: 1px solid #eee;
            }
            .count {
              color: #eee;
              font: 600 1.2rem '';
            }
            .desc {
              font-size: 12.5px;
              color: #999;
            }
          }
        }
      }
      .other {
        color: #eee;
        & > div {
          margin: 20px 0;
          font-size: 12.5px;
        }
      }
    }
  }
  .tab-content {
    margin-top: 20px;
    h1 {
      margin: 20px 0;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      li {
        width: 20%;
        padding: 0.9375rem;
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
</style>
