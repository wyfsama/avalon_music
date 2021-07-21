<template>
  <div class="result">
    <div class="query-info">
      <div class="query-name">{{ queryName }}</div>
      <div class="query-count">
        共找到{{ this.queryData[this.type + 'Count'] }}个结果
      </div>
    </div>
    <div class="query-list">
      <el-tabs v-model="activeName">
        <!-- 搜索歌曲 -->
        <el-tab-pane label="歌曲" name="1">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" :index="indexMethod">
            </el-table-column>
            <el-table-column width="50">
              <template slot-scope="scope">
                <span
                  class="playicon iconfont icon-bofang"
                  @click="getList({id:scope.row.id,insert:true})"
                ></span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="音乐标题"></el-table-column>
            <el-table-column prop="artist" label="歌手"> </el-table-column>
            <el-table-column prop="album" label="专辑"></el-table-column>
            <el-table-column label="时长">
              <template slot-scope="scope">
                <span>{{ scope.row.duration | formatDuration }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 搜索歌单 -->
        <el-tab-pane label="歌单" name="1000">
          <div class="playlist-wrap">
            <div
              @click="toPlaylistDetail(i.id)"
              class="playlist-item"
              v-for="i in queryData.playlists"
              :key="i.id"
            >
              <img :src="i.coverImgUrl" alt="" />
              <div class="playCount">
                播放量: {{ i.playCount | omitPlayCount }}
              </div>
            </div>
          </div>
        </el-tab-pane>
        <!-- 搜索mv -->
        <el-tab-pane label="MV" name="1004">
          <div class="mv-wrap">
            <div
              class="mv-item"
              v-for="i in queryData.mvs"
              :key="i.id"
              @click="toMvDetail(i.id)"
            >
              <img :src="i.cover" alt="" />
              <div class="playtime">
                播放量: {{ i.playCount | omitPlayCount }}
              </div>
              <div class="duration">{{ i.duration | formatDuration }}</div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination[type].currentPage"
        :page-sizes="[5, 10, 20, 30, 40, 50]"
        :page-size="pagination[type].currentSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="
          queryData.playlistCount || queryData.songCount || queryData.videoCount
        "
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  created() {
    this.getQueryResult(
      this.$route.query.q,
      this.activeName,
      this.pagination[this.type].currentSize,
      this.pagination[this.type].currentPage
    )
  },
  computed: {
    counts() {
      if (!this.queryData) {
        return this.queryData[this.type + 'Count']
      } else {
        return null
      }
    },
    queryName() {
      return this.$route.query.q
    },
  },
  watch: {
    queryName(val) {
      console.log(val)
      this.getQueryResult(
        this.$route.query.q,
        this.activeName,
        this.pagination[this.type].currentSize,
        this.pagination[this.type].currentPage
      )
    },
    activeName(val) {
      console.log(val)
      switch (val) {
        case '1':
          this.type = 'song'
          break
        case '1000':
          this.type = 'playlist'
          break
        case '1004':
          this.type = 'mv'
          break
        default:
          break
      }
      this.getQueryResult(
        this.$route.query.q,
        this.activeName,
        this.pagination[this.type].currentSize,
        this.pagination[this.type].currentPage
      )
    },
  },
  data() {
    return {
      type: 'song',
      queryData: null,
      activeName: '1',
      tableData: null,
      pagination: {
        song: { currentPage: 0, currentSize: 5 },
        playlist: { currentPage: 0, currentSize: 5 },
        mv: { currentPage: 0, currentSize: 5 },
      },
    }
  },
  methods: {
    async getQueryResult(keywords, type, limit, offset) {
      const {
        data: { result },
      } = await this.request({
        url: '/search',
        params: {
          keywords,
          type,
          limit,
          offset,
        },
      })
      this.queryData = result
      this.tableData = this.queryData.songs.map((i) => {
        return {
          id: i.id,
          name: i.name,
          artist: i.artists[0].name,
          album: i.album.name,
          duration: i.duration,
        }
      })
    },
    handleSizeChange(val) {
      this.pagination[this.type].currentSize = val
      this.getQueryResult(
        this.$route.query.q,
        this.activeName,
        this.pagination[this.type].currentSize,
        this.pagination[this.type].currentPage
      )
    },
    handleCurrentChange(val) {
      this.pagination[this.type].currentPage = val
      this.getQueryResult(
        this.$route.query.q,
        this.activeName,
        this.pagination[this.type].currentSize,
        this.pagination[this.type].currentPage
      )
    },
    toPlaylistDetail(id) {
      this.$router.push(`/playlist?id=${id}`)
    },
    toMvDetail(id) {
      this.$router.push(`/mv?id=${id}`)
    },
    ...mapActions(['getList']),
  },
  components: {},
}
</script>

<style  lang="scss" scoped>
.player {
  cursor: pointer;
}
.pagination {
  margin-top: 20px;
  text-align: center;
}
.result {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 75%;
  .query-info {
    display: flex;
    width: 100%;
    align-items: center;
    margin-bottom: 0.625rem;
    .query-name {
      font-size: 1.54rem;
      font-weight: 700;
      margin-right: 1.25rem;
    }
    .query-count {
      color: #999;
      font-size: 0.5rem;
    }
  }
  .query-list {
    width: 100%;
    .playlist-wrap {
      display: flex;
      flex-wrap: wrap;
      .playlist-item {
        cursor: pointer;
        width: 20%;
        padding: 10px;
        position: relative;
        img {
          width: 100%;
          border-radius: 10px;
        }
        .playCount {
          position: absolute;
          font-size: 0.75rem;
          color: #fff;
          top: 1rem;
          right: 1rem;
        }
      }
    }
    .mv-wrap {
      display: flex;
      flex-wrap: wrap;
      .mv-item {
        width: 25%;
        height: 160px;
        padding: 10px;
        position: relative;
        cursor: pointer;
        img {
          border-radius: 10px;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .playtime {
          position: absolute;
          top: 15px;
          right: 15px;
          color: #fff;
          font-size: 12px;
        }
        .duration {
          position: absolute;
          bottom: 15px;
          right: 15px;
          color: #fff;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
