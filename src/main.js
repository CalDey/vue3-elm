import { createApp } from 'vue'
import App from './App.vue'
import router from './router'   // vue-router
import store from './store/index'   // vuex
import axios from '@/utils/axios'
import './config/rem'   // rem
import './index.css'    // 引入tailwind css文件
// 按需引入vant及对应样式
import 'vant/lib/index.css'
import {
        Button, Toast, Grid, GridItem,
        Swipe, SwipeItem, Tag, Rate,
        Skeleton, PullRefresh, List, Cell,
        Empty, Icon, DropdownMenu, DropdownItem,
        TreeSelect, ConfigProvider, Checkbox, CheckboxGroup,
        Sticky, Tabs, Tab, Popup, Dialog, Image as VanImage
        } from 'vant'

// const router = new VueRouter({
//         routes,
//         mode: routerMode,
//         strict: process.env.NODE_ENV !== 'production',
//         // 缓存自动定位浏览位置
//         scrollBehavior (to, from, savedPosition) {
//                 if(savedPosition) {
//                         return savedPosition
//                 }else{
//                         if(from.meta.keepAlive) {
//                                 from.meta.savedPosition = document.body.scrollTop
//                         }
//                         return { x: 0, y: to.meta.savedPosition || 0 }
//                 }
//         }
// })

const app = createApp(App)
app.use(router)
app.use(store)
app.config.globalProperties.$http = axios   // 全局挂载axios
app.use(Button)
app.use(Toast)
app.use(Grid)
app.use(GridItem)
app.use(Swipe)
app.use(SwipeItem)
app.use(VanImage)
app.use(Tag)
app.use(Rate)
app.use(Skeleton)
app.use(PullRefresh)
app.use(List)
app.use(Cell)
app.use(Empty)
app.use(Icon)
app.use(DropdownMenu)
app.use(DropdownItem)
app.use(TreeSelect)
app.use(ConfigProvider)
app.use(Checkbox)
app.use(CheckboxGroup)
app.use(Sticky)
app.use(Tabs)
app.use(Tab)
app.use(Popup)
app.use(Dialog)
app.mount('#app')