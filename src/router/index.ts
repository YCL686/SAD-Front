// index.ts
import { createRouter, createWebHashHistory } from 'vue-router'
//作品展示页面
import opus from '../components/opus.vue'
//首页 即最新发布页面
import latest from '../components/latest.vue'
//发布作品页面
import publish from '../components/publish.vue'
//热门
import hot from '../components/hot.vue'
//推荐
import recommand from '../components/recommand.vue'
//个人中心 非链上业务合集 如我的作品 我的消息 我的关注 我的收藏等
import myCenter from '../components/myCenter.vue'
//加密资产中心 链上业务合集 如我的余额 流水 提现 充值 我的NFT 我的DeFi
import myToken from '../components/myCrypotoProperty.vue'
//NFT页面 如NFT交易市场
import NFT from '../components/NFT.vue'
//DeFi页面
import DeFi from '../components/DeFi.vue'
//admin页面 子页面包括配置管理 审核管理 统计管理 用户管理等
import admin from '../components/admin/index.vue'

import profile from '../components/profile.vue'

//移动端
import myCenterMobile from '../components/mobile/myCenterMobile.vue'

import latestMobile from '../components/mobile/latestMobile.vue'

import publishMobile from '../components/mobile/publishMobile.vue'

import opusMobile from '../components/mobile/opusMobile.vue'


const isMobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)

const routes = [{
  path: '/profile/:userId',
  name: 'profile',
  component: profile
},
  {
  path: '/opus/:opusId',
  name: 'opus',
  component: isMobile? opusMobile : opus
}, {
  path: '/index',
  name: 'index',
  component: isMobile? latestMobile :  latest
}, {
  path: '/publish',
  name: 'publish',
  component: isMobile? publishMobile : publish
}, {
  path: '/hot',
  name: 'hot',
  component: isMobile? latestMobile :  latest
}, {
  path: '/recommand',
  name: 'recommand',
  component: recommand
}, {
  path: '/myCenter',
  name: 'myCenter',
  component: myCenter
}, {
  path: '/myToken',
  name: 'myToken',
  component: myToken
},{
  path: '/NFT',
  name: 'NFT',
  component: NFT
}, {
  path: '/DeFi',
  name: 'DeFi',
  component: DeFi
}, {
  path:'/admin',
  name:'admin',
  component: admin,
  children:[{
    path:'configuration',
    name:'configuration',
    component:() => import('../components/admin/configuration.vue')
  },{
    path:'audit',
    name:'audit',
    component:() => import('../components/admin/audit.vue')
  },{
    path:'statistics',
    name:'statistics',
    component:() => import('../components/admin/statistics.vue')
  },{
    path:'user',
    name:'user',
    component:() => import('../components/admin/user.vue')
  }]
}]

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})
