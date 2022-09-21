# 前言
本项目基于 [bailicangdu/vue2-elm](https://github.com/bailicangdu/vue2-elm) 进行开发，接口全部来源于 [node-elm](https://github.com/bailicangdu/node-elm/blob/master/API.md)，项目的样式借鉴了原项目大致布局思路，使用了最近流行的CSS框架 TailWindCSS 进行页面开发，使用vue3对vue2代码进行完全重构。同时引入vant代替了项目中部分逻辑相对复杂的组件，移除了部分不涉及数据交互逻辑的静态页面，降低了项目的整体难度，更加利于初学者学习。

# 为什么要做这个项目？
[bailicangdu/vue2-elm](https://github.com/bailicangdu/vue2-elm) 是一个非常优秀的开源项目，购物车和下单的部分复杂交互逻辑通过 vuex 由前端来实现，整体项目的难度相对较高。通过学习这个项目我对vuex和vue2有了更加深刻的理解。但是可惜原项目的发布时间较早，前端技术在最近几年发展迅速，项目所用到的技术栈相对于2022年来说稍显落后，所以在学习vue3的时候，我思考能否通过vue3来完整实现这个项目🤔

# 22/09/21更新 Vue3+TS+Element-Plus开发配套后台管理系统
线上Demo
http://182.92.202.161:3001/

# 技术栈
vue3 + vite + TailWindCSS + vant + vuex + vue-router + axios

# 涉及技术点
🐂 vue3开发一个大型前端项目的完整流程，熟悉vue3基本语法和开发模式  
🐂 vue-router路由懒加载，keep-alive缓存路由组件  
🐂 本项目通过vuex实现购物车增删改查逻辑，难度较大  
🐂 通过TailWindCSS快速书写CSS样式
🐂 按需引入vant组件库，二次开发vant组件，vant样式重写

# 优化功能
1.使用vant的TreeSelect组件重写店铺页商品菜单逻辑，实现店铺菜单栏双向导航定位（左侧切换，右侧自动定位；右侧滑动，左侧自动定位且保持居中） 
2.滑动加载数据列表实现上拉加载，下拉刷新
3.优化部分bug  

# 线上Demo
http://182.92.202.161:3000/  
(请使用Chrome浏览器移动端模式查看)  

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

# 部分页面展示
<div style="display:flex;justify-content:center">
  <span>
    <img width="275" alt="截屏2022-04-17 下午11 12 38" src="https://user-images.githubusercontent.com/56568751/163741469-cf32331a-b755-47b5-928c-deeaf800b9ec.png">
  </span>
  <span>
     <img width="273" alt="截屏2022-04-17 下午11 17 56" src="https://user-images.githubusercontent.com/56568751/163741569-55c22593-7155-4006-bff5-c52aa8a3d01c.png">
  </span>
  <span>
      <img width="273" alt="截屏2022-04-17 下午11 18 20" src="https://user-images.githubusercontent.com/56568751/163741987-e12cdd86-7b15-4b87-9ff2-3ba448dfed72.png">
  </span>
  <span>
      <img width="272" alt="截屏2022-04-17 下午11 18 58" src="https://user-images.githubusercontent.com/56568751/163742059-0c6b56ed-f30e-4d62-9751-f90b76a9b209.png">
  </span>
  <span>
      <img width="273" alt="截屏2022-04-17 下午11 19 21" src="https://user-images.githubusercontent.com/56568751/163742134-659ab3fe-ec05-43d2-98fe-1a228413f0f2.png">
  </span>
</div>

