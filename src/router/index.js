import Vue from 'vue'
import VueRouter from 'vue-router'
import Discovery from '@/components/index/Discovery'
import Playlists from '@/components/index/Playlists'
import Playlist from '@/components/index/Playlist'
import Mvs from '@/components/index/Mvs'
import Mv from '@/components/index/Mv'
import Songs from '@/components/index/Songs'
import Result from '@/components/index/Result'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/discovery' },
  { path: '/discovery', component: Discovery },
  { path: '/playlists', component: Playlists },
  { path: '/playlist', component: Playlist },
  { path: '/mvs', component: Mvs },
  { path: '/mv', component: Mv },
  { path: '/songs', component: Songs },
  { path: '/result', component: Result }
]

const router = new VueRouter({
  routes
})

export default router
