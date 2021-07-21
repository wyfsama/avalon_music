import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import aplayer from 'vue-aplayer'

// import ElementUI from 'element-ui';
import {
  Button, Select, Autocomplete, Icon, Menu, MenuItem, Carousel, CarouselItem, Pagination, Table, TableColumn, ButtonGroup, Tabs,
  TabPane, Message, Tooltip, Switch
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/style/common/index.scss'
import request from '@/network/index'
import filters from '@/utils/filters'

Vue.config.productionTip = false
// Vue.use(ElementUI)
Vue
  .use(Button)
  .use(Select)
  .use(Autocomplete)
  .use(Icon)
  .use(Menu)
  .use(MenuItem)
  .use(Carousel)
  .use(CarouselItem)
  .use(Pagination)
  .use(Table)
  .use(TableColumn)
  .use(ButtonGroup)
  .use(Tabs)
  .use(TabPane)
  .use(Message)
  .use(Tooltip)
  .use(Switch)

Vue.mixin({
  methods: {
    request
  },
  ...filters,
  components: {
    aplayer
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
