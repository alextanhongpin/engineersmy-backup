import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/page/Home'
import Login from '@/components/page/LoginAuth0'
import Admin from '@/components/page/Admin'
import Create from '@/components/page/Create'
import Callback from '@/components/page/Callback'
import Photos from '@/components/page/Photos'
// import Developers from '@/components/page/Developer'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '',
      alias: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/create',
      name: 'Create',
      component: Create
    },
    {
      path: '/callback',
      name: 'Callback',
      component: Callback
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/photos',
      name: 'Photos',
      component: Photos
    }
    // {
    //   path: '/developers',
    //   name: 'Developers',
    //   component: Developers
    // }
  ]
})
