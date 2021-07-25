<template>
  <div class="song-container">
    <div class="tab-bar">
      <div :class="['bar-item', type === 0 ? 'active' : '']" @click="type = 0">
        全部
      </div>
      <div :class="['bar-item', type === 7 ? 'active' : '']" @click="type = 7">
        华语
      </div>
      <div
        :class="['bar-item', type === 96 ? 'active' : '']"
        @click="type = 96"
      >
        欧美
      </div>
      <div :class="['bar-item', type === 8 ? 'active' : '']" @click="type = 8">
        日本
      </div>
      <div
        :class="['bar-item', type === 16 ? 'active' : '']"
        @click="type = 16"
      >
        韩国
      </div>
    </div>
    <div class="song-list">
      <el-table
        :data="tableData1"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="index" :index="indexMethod"> </el-table-column>
        <el-table-column width="50">
          <template slot-scope="scope">
            <span
              class="playicon iconfont icon-bofang"
              :style="list[0].id === scope.row.id ? { color: 'red' } : ''"
              @click="getList({ id: scope.row.id, insert: true })"
            ></span>
          </template>
        </el-table-column>
        <el-table-column prop="blurPicUrl" label="封面" width="130">
          <template slot-scope="scope">
            <img :src="scope.row.blurPicUrl" height="70" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="音乐标题" width="180">
        </el-table-column>
        <el-table-column prop="artists" label="歌手" width="180">
        </el-table-column>
        <el-table-column prop="album" label="专辑"> </el-table-column>
        <el-table-column label="时长">
          <template slot-scope="scope">
            <span>{{ scope.row.duration | formatDuration }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-counter">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paginationData.currentPage"
        :page-sizes="[5, 10, 15, 20, 30]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginationData.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      songsList: null,
      type: 0,
      tableData: null,
      tableData1: null,
      paginationData: {
        pageSize: 5,
        total: 0,
        currentPage: 1,
      },
      loading: '',
      songsList0: null,
      songsList7: null,
      songsList96: null,
      songsList8: null,
      songsList16: null,
      timer: null,
    }
  },
  computed: {
    ...mapState(['list']),
  },
  created() {
    this.getData(this.type)
  },
  watch: {
    type(v) {
      this.getData(v)
    },
  },
  methods: {
    async getData(type) {
      this.loading = true
      if (!sessionStorage.getItem(`songsList${type}`)) {
        const {
          data: { data },
        } = await this.request({
          url: '/top/song',
          params: {
            type,
          },
        })
        this[`songsList${type}`] = data
        sessionStorage.setItem(
          `songsList${type}`,
          JSON.stringify(this[`songsList${type}`])
        )
        // console.log(JSON.stringify(this[`songsList${type}`]))
        this.timer = Date.now()
      } else {
        console.log((Date.now() - this.timer) / 1000)
        if (Date.now() - this.timer > 30 * 1000) {
          sessionStorage.removeItem('songsList0')
          sessionStorage.removeItem('songsList8')
          sessionStorage.removeItem('songsList7')
          sessionStorage.removeItem('songsList16')
          sessionStorage.removeItem('songsList96')
          // sessionStorage.removeItem(`songsList${type}`)
          sessionStorage.setItem(
            `songsList${type}`,
            JSON.stringify(this[`songsList${type}`])
          )
          const {
            data: { data },
          } = await this.request({
            url: '/top/song',
            params: {
              type,
            },
          })
          this[`songsList${type}`] = data
          this.timer = Date.now()
        } else {
          this[`songsList${type}`] = JSON.parse(
            sessionStorage.getItem(`songsList${type}`)
          )
        }
      }
      this.loading = false
      this.tableData = this[`songsList${type}`].map((i) => {
        return {
          id: i.id,
          blurPicUrl: i.album.blurPicUrl,
          name: i.name,
          artists: i.artists[0].name,
          album: i.album.name,
          duration: i.duration,
        }
      })
      this.paginationData.total = this.tableData.length
      this.tableData1 = this.tableData.slice(0, this.paginationData.pageSize)
    },
    handleSizeChange(val) {
      this.paginationData.pageSize = val
      // 5 0-5 (1-1)*5 1*5
      // 10 0-10 (1-1)*10 1*10
      // 2 10 10-20 (2-1)*10 2*10
      this.$nextTick(() => {
        this.tableData1 = this.tableData.slice(
          (this.paginationData.currentPage - 1) * this.paginationData.pageSize,
          this.paginationData.currentPage * this.paginationData.pageSize
        )
      })
    },
    handleCurrentChange(val) {
      this.paginationData.currentPage = val
      this.$nextTick(() => {
        this.tableData1 = this.tableData.slice(
          (this.paginationData.currentPage - 1) * this.paginationData.pageSize,
          this.paginationData.currentPage * this.paginationData.pageSize
        )
      })
    },
    ...mapActions(['getList']),
  },
  components: {},
}
</script>

<style  lang="scss" scoped>
.playicon:link {
  color: red;
}
.player {
  cursor: pointer;
}
.active {
  color: red !important;
}
.song-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 75%;
  .tab-bar {
    font-size: 0.75rem;
    width: 100%;
    padding: 0.625rem;
    display: flex;
    justify-content: flex-end;
    // border: 1px solid black;
    .bar-item {
      color: #999;
      margin: 0 0.3125rem;
      cursor: pointer;
    }
  }
  .song-list {
    margin-top: 0.625rem;
    width: 100%;
  }
  .page-counter {
    margin-top: 1.25rem;
  }
}
</style>
