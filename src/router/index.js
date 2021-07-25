import Vue from 'vue'
import VueRouter from 'vue-router'
import Discovery from '@/components/index/Discovery'
import Playlists from '@/components/index/Playlists'
import Playlist from '@/components/index/Playlist'
import Mvs from '@/components/index/Mvs'
import Mv from '@/components/index/Mv'
import Songs from '@/components/index/Songs'
import Result from '@/components/index/Result'
import Center from '@/components/index/Center'
import Main from '@/views/Main'
import Login from '@/views/Login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Main,
    redirect: '/discovery',
    children: [
      { path: '/discovery', component: Discovery },
      { path: '/playlists', component: Playlists },
      { path: '/playlist', component: Playlist },
      { path: '/mvs', component: Mvs },
      { path: '/mv', component: Mv },
      { path: '/songs', component: Songs },
      { path: '/result', component: Result },
      { path: '/center', component: Center },
    ]
  },
  {
    path: '/login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  console.log(to)
  if (to.path !== '/login' && !sessionStorage.getItem('userinfo')) {
    console.log(to)
    next('/login')
  } else {
    next()
  }
})

export default router
