<template>
  <div class="head-container flex a-c s-p">
    <div class="right">
      <img @click="$router.push('/')" src="../assets/logo.png" alt="" />
    </div>
    <div class="middle">
      <div>
        <el-autocomplete
          v-model="state"
          :placeholder="defaultKeyword.showKeyword"
          prefix-icon="el-icon-search"
          :fetch-suggestions="querySearchAsync"
          @select="handleSelect"
        >
          <i
            @click="clear"
            slot="suffix"
            :class="[
              'el-input__icon',
              state ? 'el-icon-error' : 'el-icon-circle-close',
            ]"
          ></i>
          <template slot-scope="{ item }">
            <span class="name">{{ item.value }}</span>
            <span v-show="item.artists"> | </span>
            <span class="addr">{{ item.artists }}</span>
          </template>
        </el-autocomplete>
      </div>
    </div>
    <div class="left">
      <div>
        <el-tooltip :content="'播放器模式: ' + value" placement="top">
          <el-switch
            v-model="value"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="正常"
            inactive-value="迷你"
          >
          </el-switch>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.getDefaultKeyword()
    // this.getSearchData()
    this.gethotSearch()
  },
  data() {
    return {
      defaultKeyword: null,
      state: '',
      searches: null,
      hots: null,
      value: '正常',
    }
  },
  methods: {
    async getDefaultKeyword() {
      const {
        data: { data },
      } = await this.request('/search/default')
      this.defaultKeyword = data
    },
    async querySearchAsync(queryString, cb) {
      // 有输入值
      if (this.state) {
        const { data } = await this.request({
          url: '/search',
          params: {
            keywords: queryString,
          },
        })
        this.searches = data.result.songs
        const searchRes = data.result.songs.map((i) => {
          return {
            value: i.name,
            artists: i.artists[0].name,
          }
        })

        cb(searchRes)
        // 没有输入值
      } else {
        const {
          data: {
            result: { hots },
          },
        } = await this.request('/search/hot')
        // console.log(hots)
        this.hots = hots
        const hotList = hots.map((i) => {
          return { value: i.first }
        })

        cb(hotList)
      }
    },
    handleSelect(e) {
      this.state = e.artists ? e.value + ' ' + e.artists : e.value
      this.$router.push(`/result?q=${this.state}`)
    },
    clear() {
      this.state = ''
    },
  },
  components: {},
}
</script>

<style lang="scss" scoped>
.head-container {
  height: 2.8125rem;
  background: #f9f9f9;
  box-shadow: 1px 1px 2px #eee;
  padding: 0 0.625rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  .right {
    height: 100%;
    padding: 3px;
    img {
      height: 100%;
    }
  }
  .el-autocomplete {
    width: 25rem;
  }
}
</style>
