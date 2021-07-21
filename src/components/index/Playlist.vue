<template>
  <div class="playlist-container">
    <div class="top">
      <div class="cover-wrapper">
        <img :src="playlistData.coverImgUrl" alt="" />
        <div class="playCount">{{ playlistData.playCount }}</div>
      </div>
      <div class="top-detail">
        <div class="playlist-title">{{ playlistData.name }}</div>
        <div class="creator-info">
          <div class="creator-avatar">
            <img :src="playlistData.creator.avatarUrl" alt="" />
          </div>
          <div class="creator-name">{{ playlistData.creator.nickname }}</div>
          <div class="create-date">
            {{ playlistData.createTime | formatTime('y-m-d') }} 创建
          </div>
        </div>
        <div class="top-button">
          <el-tooltip
            class="item"
            effect="dark"
            content="替换当前播放列表"
            placement="bottom"
          >
            <div class="playall-button" @click="push2List">播放全部</div>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="添加到当前播放列表"
            placement="right"
          >
            <div class="addall-button" @click="push2List1">+</div>
          </el-tooltip>
        </div>
        <div class="tags-wrapper">标签：{{ playlistData.tags.join('/') }}</div>
        <div class="description-wrapper">
          简介：{{ playlistData.description }}
        </div>
      </div>
    </div>
    <div class="playlist-main">
      <el-tabs>
        <el-tab-pane label="歌曲列表">
          <div class="playlist-table">
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column type="index" :index="indexMethod">
              </el-table-column>
              <el-table-column width="50">
                <template slot-scope="scope">
                  <span
                    class="playicon iconfont icon-bofang"
                    :style="list[0].id === scope.row.id ? { color: 'red' } : ''"
                    @click="getList({ id: scope.row.id, insert: true })"
                  ></span>
                </template>
              </el-table-column>
              <el-table-column label="封面" v-slot="scope">
                <img
                  class="cover"
                  :src="scope.row.al.picUrl"
                  alt=""
                  width="70"
                />
              </el-table-column>
              <el-table-column prop="name" label="音乐标题"> </el-table-column>
              <el-table-column prop="ar[0].name" label="歌手">
              </el-table-column>
              <el-table-column prop="al.name" label="专辑"> </el-table-column>
              <el-table-column label="时长" v-slot="scope">
                {{ scope.row.dt | formatDuration }}
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`评论(${commentTotal})`">
          <div class="hotComments">
            <h1>精彩评论({{ hotLength }})</h1>
            <div class="comment-list">
              <div
                class="commentlist-item"
                v-for="item in hotComments"
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
          <div class="comments">
            <div class="comments-wrapper">
              <h1>最新评论({{ commentTotal }})</h1>
              <div class="comment-list">
                <div
                  class="commentlist-item"
                  v-for="item in comments"
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
                :current-page="paginationData.currentPage"
                :page-sizes="[5, 10, 20, 30, 40, 50]"
                :page-size="paginationData.currentSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="commentTotal"
              >
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  created() {
    this.getData()
    this.getCommentData(
      this.paginationData.currentSize,
      this.paginationData.currentPage
    )
  },
  data() {
    return {
      playlistData: null,
      tableData: null,
      commentTotal: null,
      comments: null,
      hotComments: null,
      paginationData: {
        currentPage: 0,
        currentSize: 10,
      },
    }
  },
  computed: {
    ...mapState(['list']),
    hotLength() {
      return this.hotComments.length
    },
  },
  methods: {
    ...mapMutations(['clear']),
    ...mapActions(['getList']),
    async getData() {
      const {
        data: { playlist },
      } = await this.request({
        url: `/playlist/detail?id=${this.$route.query.id}`,
      })
      this.playlistData = playlist
      this.tableData = playlist.tracks
    },
    async getCommentData(limit, offset) {
      const { data } = await this.request({
        url: `comment/playlist?id=${this.$route.query.id}`,
        params: {
          limit,
          offset,
        },
      })
      this.commentTotal = data.total
      this.comments = data.comments
      if (offset === 0) {
        this.hotComments = data.hotComments
      }
    },

    handleSizeChange(val) {
      this.paginationData.currentSize = val
      this.getCommentData(
        this.paginationData.currentSize,
        this.paginationData.currentPage
      )
    },
    handleCurrentChange(val) {
      this.paginationData.currentPage = val
      this.getCommentData(
        this.paginationData.currentSize,
        this.paginationData.currentPage
      )
    },
    // 播放全部 替换
    push2List() {
      this.clear()
      this.tableData.forEach((i) => {
        // {id:scope.row.id,insert:true}
        this.getList({ id: i.id, insert: false })
        console.log(i.id)
      })
    },
    // 加号按钮
    push2List1() {
      this.tableData.forEach((i) => {
        // {id:scope.row.id,insert:true}
        this.getList({ id: i.id, insert: false })
        console.log(i.id)
      })
    },
  },
  components: {},
}
</script>

<style  lang="scss" scoped>
.playlist-container {
  width: 75%;
  display: flex;
  flex-direction: column;
  .top {
    display: flex;
    .cover-wrapper {
      width: 14.375rem;
      position: relative;
      img {
        width: 100%;
        border-radius: 0.9375rem;
      }
      .playCount {
        position: absolute;
        color: #fff;
        top: 0.3125rem;
        right: 0.3125rem;
      }
    }
    .top-detail {
      flex: 1;
      margin-left: 1.875rem;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      .creator-info {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .creator-avatar {
          width: 1.875rem;
          img {
            width: 100%;
            border-radius: 50%;
          }
        }
        .creator-name {
          margin: 0 0.625rem;
        }
        .create-date {
          font-size: 0.8rem;
          color: #999;
        }
      }
      .top-button {
        color: #fff;
        display: flex;
        align-items: center;
        height: 35px;
        .playall-button {
          cursor: pointer;
          height: 100%;
          padding: 0.3125rem 1.25rem 0.3125rem 0.625rem;
          border-radius: 0.625rem 0 0 0.625rem;
          background: linear-gradient(to right, #e85e4d, #c03a28);
        }
        .addall-button {
          cursor: pointer;
          height: 100%;
          background: linear-gradient(to left, #e85e4d, #c03a28);
          margin-left: 0.1875rem;
          font-size: 1.5rem;
          border-radius: 0 0.3125rem 0.3125rem 0;
          padding: 0 0.625rem;
        }
      }
    }
  }
  .playlist-main {
    margin-top: 1.5rem;
    .cover {
      border-radius: 0.3125rem;
    }
    .hotComments {
      h1 {
        font-size: 1rem;
      }
      .comment-list {
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
    .comments {
      margin-top: 60px;
      .comments-wrapper {
        h1 {
          font-size: 1rem;
        }
        .comment-list {
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
            }
          }
        }
      }
      .comments-pagination {
        width: 100%;
        margin: 30px 0;
        text-align: center;
      }
    }
  }
}
</style>
