import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Dashboard from '@/components/Dashboard'

import UserList from '@/components/users/list'

//import UserChangePwd from '@/components/setting/changepwd'
import UserProfile from '@/components/setting/profile'

import DeviceList from '@/components/devices/list'
import DeviceCategory from '@/components/devices/devicecategory'
import RepairRegister from '@/components/repairs/register'
import RepairNotes from '@/components/repairs/notes'


// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/components/Login'], resolve)

Vue.use(Router)

let router = new Router({
// mode: 'history',
  routes: [
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/dashboard',
      leaf: true, // 只有一个节点
      menuShow: true,
      iconCls: 'iconfont icon-home', // 图标样式class
      children: [
        {path: '/dashboard', component: Dashboard, name: '首页', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '设备管理',
      menuShow: true,
      //leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-icon_machine-cluster-big', // 图标样式class
      children: [
        {path: '/device/list', component: DeviceList, name: '设备列表', menuShow: true},
        {path: '/device/category', component: DeviceCategory, name: '设备分类', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '用户管理',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-users', // 图标样式class
      children: [
        {path: '/user/list', component: UserList, name: '用户管理', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '设备报修',
      menuShow: true,
      iconCls: 'iconfont icon-repairfill',
      children: [
        {path: '/repairs/register', component: RepairRegister, name: '报修登记', menuShow: true},
        {path: '/repairs/notes', component: RepairNotes, name: '报修记录 ', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '设置',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'iconfont icon-setting',
      children: [
        {path: '/setting/profile', component: UserProfile, name: '个人信息', menuShow: true}
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log('to:' + to.path)
  if (to.path.startsWith('/login')) {
    window.localStorage.removeItem('access-user')
    next()
  } else {
    let user = JSON.parse(window.localStorage.getItem('access-user'))
    if (!user) {
      next({path: '/login'})
    } else {
      next()
    }
  }
})

export default router
