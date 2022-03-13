# 前言
本项目基于 [bailicangdu/vue2-elm](https://github.com/bailicangdu/vue2-elm) 进行开发，接口全部来源于 [node-elm](https://github.com/bailicangdu/node-elm/blob/master/API.md)，项目的样式借鉴了原项目大致布局思路，使用了最近流行的CSS框架 tailwindCSS 进行页面开发，使用vue3对vue2代码进行完全重构。同时引入vant代替了项目中部分逻辑相对复杂的组件，移除了部分不涉及交互逻辑的静态页面，降低了项目的整体难度，更加利于初学者学习。

# 为什么要做这个项目？
[bailicangdu/vue2-elm](https://github.com/bailicangdu/vue2-elm) 是一个非常优秀的开源项目，购物车和下单的部分复杂交互逻辑通过 vuex 由前端来实现，整体项目的难度相对较高。通过学习这个项目我对vuex和vue2有了更加深刻的理解。但是可惜原项目的发布时间较早，前端技术在最近几年发展迅速，项目所用到的技术栈相对于2022年来说稍显落后，所以在学习vue3的时候，我思考能否通过vue3来完整实现这个项目🤔

# 技术栈
vue3 + vite + tailwindCSS + vant + vuex + vue-router + axios

# 通过这个项目可以学到什么？
🐂 使用vue3完整开发一个大型项目，熟练vue3基本语法，熟悉vue3开发模式  
🐂 vue-router基本使用，路由懒加载，keep-alive缓存路由组件  
🐂 vuex的基本使用，复杂项目数据状态管理，如何防止页面刷新vuex数据丢失  
🐂 使用tailwindCSS快速开发规范美观的页面  
🐂 vite的基本使用  
🐂 按需引入vant，二次开发vant组件，vant样式重写

# 优化功能
1.使用vant的TreeSelect组件重写店铺页商品菜单逻辑，实现简易的菜单栏双向导航定位  
2.滑动加载列表实现上拉加载，下拉刷新  
3.优化部分bug  

# 线上Demo
http://182.92.202.161:3000/  
(请使用Chrome浏览器移动端模式查看)  
由于axios跨域问题无法携带cookies导致验证码失效，因此线上Demo暂不开放登录注册功能  
请本地启动项目体验完整功能

# 项目运行
```
本项目使用yarn进行依赖管理
yarn install
yarn dev
访问 http://localhost:3000/
```

# 说明
此项目接口全部来源于[node-elm](https://github.com/bailicangdu/node-elm/blob/master/API.md)，若接口出现异常请去原项目提Issue  

> 如果有任何问题，欢迎提Issue👏 如果本项目对您有帮助 麻烦点个star支持一下✨ 谢谢！ ^_^
