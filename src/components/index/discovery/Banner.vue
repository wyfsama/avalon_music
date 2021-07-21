<template>
  <div class="banner">
    <el-carousel :interval="3000" type="card" height="250px">
      <el-carousel-item v-for="item in picList" :key="item.bannerId">
        <img :src="item.pic" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  props: {
    picList: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {}
  },
  components: {},
}
</script>

<style  lang="scss" scoped>
.el-carousel__item {
  border-radius: 8px;
  img {
    height: 100%;
  }

}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
