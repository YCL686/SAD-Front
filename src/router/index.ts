// index.ts
import { createRouter, createWebHashHistory } from 'vue-router'
//作品展示页面
import opus from '../components/opus.vue'
//首页 即最新发布页面
import index from '../components/latest.vue'
//发布作品页面
import publish from '../components/publish.vue'
//热门
import hot from '../components/hot.vue'
//推荐
import recommand from '../components/recommand.vue'
//个人中心 非链上业务合集 如我的作品 我的消息 我的关注 我的收藏等
import myCenter from '../components/myCenter.vue'
//加密资产中心 链上业务合集 如我的余额 流水 提现 充值 我的NFT 我的DeFi
import myCrypotoProperty from '../components/myCrypotoProperty.vue'
//NFT页面 如NFT交易市场
import NFT from '../components/NFT.vue'
//DeFi页面
import DeFi from '../components/DeFi.vue'
//admin页面 子页面包括配置管理 审核管理 统计管理 用户管理等
import admin from '../components/admin/index.vue'

const routes = [{
  path: '/:opusId',
  name: 'opus',
  component: opus
}, {
  path: '/index',
  name: 'index',
  component: index
}, {
  path: '/publish',
  name: 'publish',
  component: publish
}, {
  path: '/hot',
  name: 'hot',
  component: hot
}, {
  path: '/recommand',
  name: 'recommand',
  component: recommand
}, {
  path: '/myCenter',
  name: 'myCenter',
  component: myCrypotoProperty
}, {
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
  history: createWebHashHistory(),
  routes
})
