<template>
  <div class="mv-container">
    <div class="filters-wrapper">
      <div class="tab area-wrapper">
        <section>地区：</section>
        <ul>
          <li>
            <span
              :class="selected.area === '全部' ? 'active' : ''"
              @click="selected.area = '全部'"
              >全部</span
            >
          </li>
          <li>
            <span
              :class="selected.area === '内地' ? 'active' : ''"
              @click="selected.area = '内地'"
              >内地</span
            >
          </li>
          <li>
            <span
              :class="selected.area === '港台' ? 'active' : ''"
              @click="selected.area = '港台'"
              >港台</span
            >
          </li>
          <li>
            <span
              :class="selected.area === '欧美' ? 'active' : ''"
              @click="selected.area = '欧美'"
              >欧美</span
            >
          </li>
          <li>
            <span
              :class="selected.area === '日本' ? 'active' : ''"
              @click="selected.area = '日本'"
              >日本</span
            >
          </li>
          <li>
            <span
              :class="selected.area === '韩国' ? 'active' : ''"
              @click="selected.area = '韩国'"
              >韩国</span
            >
          </li>
        </ul>
      </div>
      <div class="tab type-wrapper">
        <section>类型：</section>
        <ul>
          <li>
            <span
              :class="selected.type === '全部' ? 'active' : ''"
              @click="selected.type = '全部'"
              >全部</span
            >
          </li>
          <li>
            <span
              :class="selected.type === '官方版' ? 'active' : ''"
              @click="selected.type = '官方版'"
              >官方版</span
            >
          </li>
          <li>
            <span
              :class="selected.type === '原生' ? 'active' : ''"
              @click="selected.type = '原生'"
              >原生</span
            >
          </li>
          <li>
            <span
              :class="selected.type === '现场版' ? 'active' : ''"
              @click="selected.type = '现场版'"
              >现场版</span
            >
          </li>
          <li>
            <span
              :class="selected.type === '网易出品' ? 'active' : ''"
              @click="selected.type = '网易出品'"
              >网易出品</span
            >
          </li>
        </ul>
      </div>
      <div class="tab order-wrapper">
        <section>排序：</section>
        <ul>
          <li>
            <span
              :class="selected.order === '上升最快' ? 'active' : ''"
              @click="selected.order = '上升最快'"
              >上升最快</span
            >
          </li>
          <li>
            <span
              :class="selected.order === '最热' ? 'active' : ''"
              @click="selected.order = '最热'"
              >最热</span
            >
          </li>
          <li>
            <span
              :class="selected.order === '最新' ? 'active' : ''"
              @click="selected.order = '最新'"
              >最新</span
            >
          </li>
        </ul>
      </div>
    </div>
    <div class="mv-list">
      <div class="mv-item" v-for="item in mvData" :key="item.id">
        <div class="img-wrap" @click="toMvDetail(item.id)">
          <img :src="item.cover" alt="" width="100%" />
          <div class="count">{{ item.playCount }}</div>
        </div>
        <div class="mv-title">{{ item.name }}</div>
        <div class="mv-artist">{{ item.artistName }}</div>
      </div>
    </div>
    <div class="page-counter">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageCount.current"
        :page-sizes="[4, 8, 12, 16, 20, 40]"
        :page-size="pageCount.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageCount.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: {
        area: '全部',
        type: '全部',
        order: '上升最快',
      },
      pageCount: {
        total: 0,
        current: 0,
        size: 8,
      },
      mvData: null,
    }
  },
  created() {
    this.getData()
  },
  watch: {
    selected: {
      handler(val) {
        this.getData(
          this.pageCount.size,
          this.pageCount.current - 1,
          val.area,
          val.order,
          val.type
        )
      },
      deep: true,
    },
  },
  methods: {
    async getData(limit = 8, offset = 0, area, order, type) {
      const {
        data: { count, data },
      } = await this.request({
        url: '/mv/all',
        params: {
          area,
          order,
          type,
          limit,
          offset,
        },
      })
      this.mvData = data
      if (count) {
        this.pageCount.total = count
        console.log(count)
      }
    },
    handleSizeChange(val) {
      this.pageCount.size = val
      this.getData(this.pageCount.size, this.pageCount.current)
    },
    handleCurrentChange(val) {
      // console.log(val)
      this.pageCount.current = val
      this.getData(this.pageCount.size, this.pageCount.current)
    },
    toMvDetail(id) {
      this.$router.push(`/mv?id=${id}`)
    },
  },
  components: {},
}
</script>

<style  lang="scss" scoped>
.active {
  color: red !important;
  background-color: #fcf6f5;
}
.mv-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 75%;
  .filters-wrapper {
    user-select: none;
    margin-top: 1.25rem;
    font-size: 0.875rem;
    width: 100%;
    .tab {
      display: flex;
      margin-bottom: 1.25rem;
      section {
        font-weight: bold;
        padding: 0.3125rem 1.25rem;
      }
      ul {
        display: flex;
        align-items: center;
        li {
          border-right: 1px solid #ccc;
          &:last-child {
            border-right: none;
          }
          span {
            cursor: pointer;
            color: #999;
            padding: 0.3125rem 1.25rem;
            margin: 0 1.25rem;
            border-radius: 0.9375rem;
          }
        }
      }
    }
  }
  .mv-list {
    display: flex;
    flex-flow: wrap;
    justify-content: space-evenly;
    .mv-item {
      width: 15.625rem;
      margin: 1.875rem 1rem;
      .img-wrap {
        position: relative;
        cursor: pointer;
        img {
          border-radius: 0.3125rem;
          margin-bottom: 0.3125rem;
        }
        .count {
          position: absolute;
          color: #fff;
          top: 0.3125rem;
          right: 0.3125rem;
        }
      }
      .mv-title {
        font-size: 0.875rem;
      }
      .mv-artist {
        font-size: 0.8125rem;
        color: #999;
      }
    }
  }
}
</style>
