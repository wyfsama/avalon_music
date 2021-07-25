<template>
  <div class="head-container">
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
      <div class="avatar">
        <img :src="userinfo.avatarUrl" alt="" v-if="!userinfo.user" />
        <div class="shouldLogin" v-if="userinfo.user">游客</div>
        <div class="userinfo">
          <div class="visitorshouldknow" v-if="userinfo.user">
            <h3>若需享受更多功能，请登录~</h3>
            <div class="loginbtn" @click="tologin">登录</div>
          </div>
          <div class="userinfo-wrap" v-if="!userinfo.user">
            <div class="name">
              {{ userinfo.nickname }}
            </div>
            <div class="signature">
              {{ userinfo.signature }}
            </div>
            <div class="baseinfo">
              <ul>
                <li>
                  <div class="desc">动态</div>
                  <div class="count">{{ userinfo.eventCount }}</div>
                </li>
                <li>
                  <div class="desc">关注</div>
                  <div class="count">{{ userinfo.followeds }}</div>
                </li>
                <li>
                  <div class="desc">粉丝</div>
                  <div class="count">{{ userinfo.follows }}</div>
                </li>
              </ul>
            </div>
            <div class="table">
              <div class="center" @click="change2center">
                <span class="el-icon-user"></span>
                个人中心
              </div>
              <div class="out" @click="logout">
                <span class="iconfont icon-zhuxiao"></span>
                <span>退出</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
</template>

<script>
export default {
  created() {
    this.getUserInfo()
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
      userinfo: '',
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
    // sessionStorage中取信息
    getUserInfo() {
      this.userinfo = JSON.parse(sessionStorage.getItem('userinfo'))
    },
    logout() {
      sessionStorage.removeItem('userinfo')
      this.$router.push('/login')
      this.$message({
        message: '已退出',
        type: 'warning',
      })
      this.logout1()
    },
    logout1() {
      this.request('/logout')
      this.request('/login/refresh')
    },
    tologin() {
      console.log(1)
      sessionStorage.clear()
      this.$router.push('/login')
    },
    change2center() {
      this.$router.push('/center')
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
  z-index: 2001;
  display: flex;
  align-items: center;
  // justify-content: space-evenly;
  .right {
    height: 100%;
    padding: 3px;
    margin-right: 180px;
    img {
      height: 100%;
    }
  }
  .middle {
    // margin: 0 auto;
    display: flex;
    justify-content: center;
    flex: 1;
  }
  .left {
    display: flex;
    align-items: center;
    margin-right: 80px;
    .avatar {
      display: flex;
      align-items: center;
      width: 40px;
      margin-right: 30px;
      position: relative;
      transition: all 0.2s ease-in-out;
      // height: 25px;
      img {
        border-radius: 50%;
        width: 100%;
      }
      .shouldLogin {
        font-size: 12px;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        text-align: center;
        line-height: 2.5rem;
        background: #dee1e6;
        box-shadow: 13px 13px 30px #babdc1, -13px -13px 30px #ffffff;
      }
      &:hover {
        transform: translateY(50%) scale(1.2, 1.2);
      }
      &:hover .userinfo {
        display: block;
      }
      .userinfo {
        left: -60px;
        top: 50%;
        width: 160px;
        position: absolute;
        z-index: -1;
        height: 200px;
        display: none;
        background: #ffffff;
        box-shadow: 0 0 3px #999;
        border-radius: 5px;
        .visitorshouldknow {
          h3 {
            font-size: 18px;
            text-align: center;
            margin-top: 30px;
          }
          .loginbtn {
            cursor: pointer;
            width: 80%;
            margin: 20px auto;
            font-size: 1rem;
            color: #999;
            text-align: center;
            border-radius: 0.625rem;
            padding: 10px;
            background: linear-gradient(
              135deg,
              rgba(230, 230, 230, 1) 0%,
              rgba(246, 246, 246, 1) 100%
            );
            box-shadow: -4px -4px 10px -8px rgba(255, 255, 255, 1),
              4px 4px 10px -8px rgba(0, 0, 0, 0.3);
            &:active {
              box-shadow: -4px -4px 10px -8px rgba(255, 255, 255, 1) inset,
                4px 4px 10px -8px rgba(0, 0, 0, 0.3) inset;
            }
          }
        }
        .userinfo-wrap {
          margin-top: 1.125rem;
          .name {
            text-align: center;
            font: 800 14px '';
            padding: 3px 0;
          }
          .signature {
            margin: 8px 0;
            font-size: 12px;
            color: #999;
            text-align: center;
          }
          .baseinfo {
            ul {
              display: flex;
              li {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                .desc {
                  font-size: 0.75rem;
                  color: #999;
                }
                .count {
                  font-size: 0.875rem;
                  font-weight: 600;
                }
              }
            }
          }
          .table {
            & > div {
              cursor: pointer;
              padding: 10px;
              font-size: 8px;
              &:hover {
                background-color: #f4f4f4;
              }
            }
            .out {
              .iconfont {
                font-size: 8px;
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
  }
  .el-autocomplete {
    width: 25rem;
  }
}
</style>
