<template>
  <div class="mv-container">
    <div class="mv-detail">
      <h1>mv详情</h1>
      <div class="video">
        <video :src="mvUrl" controls></video>
      </div>
      <div class="artist">
        <div class="avatar">
          <img :src="artistInfo.artist.cover" alt="" />
        </div>
        <div class="artist-name">{{ artistInfo.artist.name }}</div>
      </div>
      <div class="mv-info">
        <div class="mv-name">{{ mvInfo.name }}</div>
        <div class="mv-count">
          <div class="mv-date">发行时间： {{ mvInfo.publishTime }}</div>
          <div class="mv-playcount">播放量： {{ mvInfo.playCount }}</div>
        </div>
        <div class="mv-description">{{ mvInfo.desc }}</div>
      </div>
      <div class="mv-comment">
        <div class="hotComments" v-show="commentInfo.hotComments.length">
          <h1>最热评论({{ commentInfo.hotComments.length }})</h1>
          <div class="comment-list">
            <div
              class="commentlist-item"
              v-for="item in commentInfo.hotComments"
              :key="item.commentId"
            >
              <div class="user-avatar">
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="user-comment">
                <div class="user-info">
                  <span class="nickname">{{ item.user.nickname }}:</span>
                  <span class="comment-content"> {{ item.content }}</span>
                </div>
                <div class="comment-date">
                  {{ item.time | formatTime }}
                </div>
                <div class="iconfont icon-zan1">{{ item.likedCount }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="comments" v-show="commentInfo.total">
          <div class="comments-wrapper">
            <h1>最新评论({{ commentInfo.total }})</h1>
            <div class="comment-list">
              <div
                class="commentlist-item"
                v-for="item in commentInfo.comments"
                :key="item.commentId"
              >
                <div class="user-avatar">
                  <img :src="item.user.avatarUrl" alt="" />
                </div>
                <div class="user-comment">
                  <div class="user-info">
                    <span class="nickname">{{ item.user.nickname }}:</span>
                    <span class="comment-content"> {{ item.content }}</span>
                  </div>
                  <div class="comment-date">
                    {{ item.time | formatTime }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="comments-pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.offset"
              :page-sizes="[5, 10, 20, 30, 40, 50]"
              :page-size="queryInfo.limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="commentInfo.total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="mv-recommend">
      <h1>相关推荐</h1>
      <ul>
        <li
          v-for="item in recommendMvs"
          :key="item.id"
          @click="toMvDetail(item.id)"
        >
          <img :src="item.cover" alt="" />
          <div class="mv-info">
            <div class="mv-name">{{ item.name }}</div>
            <div class="artist-name">{{ item.artistName }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mvUrl: null,
      artistInfo: null,
      mvInfo: null,
      queryInfo: {
        limit: 20,
        offset: 0,
      },
      commentInfo: null,
      recommendMvs: null,
    }
  },
  created() {
    this.init(this.$route.query.id)
  },
  methods: {
    init(id) {
      this.getMv(id)
      this.getMvInfo(id)
      this.getMvComments(id)
      this.getSimilarMv(id)
    },
    async getMv(id) {
      const {
        data: { data },
      } = await this.request(`/mv/url?id=${id}`)
      this.mvUrl = data.url
    },
    async getMvInfo(id) {
      const {
        data: { data },
      } = await this.request(`/mv/detail?mvid=${id}`)
      // 获取歌手id
      this.mvInfo = data
      const artistID = data.artists[0].id
      this.getArtistInfo(artistID)
    },
    async getArtistInfo(id) {
      const {
        data: { data },
      } = await this.request(`/artist/detail?id=${id}`)
      this.artistInfo = data
    },
    async getMvComments(id) {
      const { data } = await this.request({
        url: '/comment/mv',
        params: {
          id,
          limit: this.queryInfo.limit,
          offset: this.queryInfo.offset,
        },
      })
      this.commentInfo = data
    },
    async getSimilarMv(id) {
      const {
        data: { mvs },
      } = await this.request(`/simi/mv?mvid=${id}`)
      this.recommendMvs = mvs
      console.log(mvs)
    },
    handleSizeChange(val) {
      this.queryInfo.limit = val
      this.getMvComments(this.$route.query.id)
    },
    handleCurrentChange(val) {
      this.queryInfo.offset = val
      this.getMvComments(this.$route.query.id)
    },
    toMvDetail(id) {
      this.$router.push(`/mv?id=${id}`)
      this.init(id)
    },
  },
  components: {},
}
</script>

<style  lang="scss" scoped>
.mv-container {
  display: flex;
  width: 75%;
  .mv-detail {
    width: 65%;
    h1 {
      font-size: 1rem;
      margin-bottom: 1rem;
    }
    .video {
      width: 80%;
      video {
        border-radius: 0.3125rem;
        width: 100%;
      }
    }
    .artist {
      display: flex;
      align-items: center;
      margin: 0.625rem 0 1.25rem 0;
      .avatar {
        width: 4.375rem;
        height: 4.375rem;
        img {
          width: inherit;
          height: inherit;
          object-fit: cover;
          border-radius: 50%;
        }
      }
      .artist-name {
        margin-left: 0.625rem;
      }
    }
    .mv-info {
      .mv-name {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 1.875rem;
      }
      .mv-count {
        display: flex;
        margin-bottom: 1rem;
        .mv-date {
          margin-right: 1.875rem;
          font-size: 0.875rem;
          color: #999;
        }
      }
    }
    .mv-comment {
      width: 80%;
      .comment-list {
        margin: 2.1875rem 0;
        .commentlist-item {
          margin-top: 1.25rem;
          display: flex;
          .user-avatar {
            width: 3.125rem;
            padding-bottom: 0.9375rem;
            img {
              width: 100%;
              border-radius: 50%;
            }
          }
          .user-comment {
            position: relative;
            margin-left: 1.25rem;
            flex: 1;
            border-bottom: 1px solid #eee;
            .user-info {
              margin-bottom: 0.625rem;
              font-size: 0.875rem;
              .nickname {
                color: #517eaf;
              }
            }
            .comment-date {
              color: #999;
              font-size: 0.875rem;
            }
            .iconfont {
              color: rgb(223, 24, 24);
              position: absolute;
              bottom: 1rem;
              right: 0.5rem;
            }
          }
        }
      }
    }
  }
  .mv-recommend {
    flex: 1;
    h1 {
      font-size: 1rem;
    }
    ul {
      display: flex;
      flex-direction: column;
      li {
        display: flex;
        align-items: center;
        margin: 0.625rem 0;
        &:hover {
          background-color: #eee;
          cursor: pointer;
        }
        img {
          width: 12.5rem;
          border-radius: 0.625rem;
        }
        .mv-info {
          flex: 1;
          margin-left: 0.625rem;
          .mv-name {
            margin: 0.3125rem 0;
            font-size: 0.9375rem;
          }
          .artist-name {
            font-size: 0.7813rem;
            color: #999;
          }
        }
      }
    }
  }
}
</style>
