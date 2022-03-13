<template>
    <div v-if="shopDetailData" style="height:100vh;">
        <div class="fixed flex flex-col right-0 left-0 overflow-hidden" style="height: 100%">
            <div id="shop_container" class="absolute right-0 left-0 blur h-full bg-no-repeat" :style="{
            backgroundImage: 'url(' + imgBaseUrl + shopDetailData.image_path + ')',
            backgroundSize: '100%'
            }">
            </div>
            <div class="flex flex-col header_bg">
                <!-- 返回按钮 -->
                <nav class="absolute top-0 left-0 w-full h-8 pt-1 pl-1 z-10">
                    <svg width="4rem" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1" @click="goback">
                        <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:3"/>
                    </svg>
                </nav>
                <!-- 顶部商铺信息区域 -->
                <section class="relative text-white ml-1">
                    <div class="flex">
                        <div class="flex justify-center items-center mx-1 mt-2">
                            <van-image width="3rem" height="3rem" :src="imgBaseUrl + shopDetailData.image_path"></van-image>
                        </div>
                        <div id="shop_detail_content" class="flex flex-col justify-center my-2 z-10 overflow-x-hidden">
                            <router-link to="/shop/shopDetail">
                                <p class="text-xxs truncate ...">{{shopDetailData.name}}</p>
                                <p class="my-1 text-3xs font-light">商家配送/{{shopDetailData.order_lead_time}}分钟送达/配送费¥{{shopDetailData.float_delivery_fee}}</p>
                                <p class="text-3xs w-full font-light truncate ...">公告:{{shopDetailData.promotion_info}}</p>
                            </router-link>
                        </div>
                        <!-- <svg width="24" height="24" class="absolute top-1/2 right-0 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" version="1.1" >
                            <path d="M0 0 L8 7 L0 14"  stroke="#fff" stroke-width="1" fill="none"/>
                        </svg> -->
                    </div>
                    <!-- 店铺活动 -->
                    <footer v-if="shopDetailData.activities.length" class="flex text-3xs m-1 justify-between font-light" @click="isShowActivity = true">
                        <div class="flex-1 truncate ...">
                            <span :style="{backgroundColor: '#' + shopDetailData.activities[0].icon_color, borderColor: '#' + shopDetailData.activities[0].icon_color}">{{shopDetailData.activities[0].icon_name}}</span>
                            <span>&nbsp;{{shopDetailData.activities[0].description}}（APP专享）</span>
                        </div>
                        <div class="flex items-center">
                            <span class="mr-2 leading-none">{{shopDetailData.activities.length}}个活动</span>
                            <svg class="footer_arrow w-2 h-2">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-left"></use>
                            </svg>
                        </div>
                    </footer>
                </section>
                <!-- 活动详情 -->
                <section v-if="isShowActivity" class="fixed top-0 right-0 bottom-0 left-0 flex flex-col items-center bg-gray-900 p-4 text-white" style="z-index: 999;">
                    <span class="mb-4">{{shopDetailData.name}}</span>
                    <van-rate class="mb-4" :size="12" allow-half readonly color="#ff9a0d" v-model="shopDetailData.rating" />
                    <div class="border rounded-xl text-xxs px-1 mb-4">优惠信息</div>
                    <div class="mb-4 text-xxs truncate ...">
                        <span :style="{backgroundColor: '#' + shopDetailData.activities[0].icon_color, borderColor: '#' + shopDetailData.activities[0].icon_color}">{{shopDetailData.activities[0].icon_name}}</span>
                        <span>&nbsp;{{shopDetailData.activities[0].description}}（APP专享）</span>
                    </div>
                    <div class="border rounded-xl text-xxs px-1 mb-4">商家公告</div>
                    <span class="text-xxs truncate ...">{{shopDetailData.promotion_info}}</span>
                    <div class="absolute bottom-5" @click="isShowActivity = false">
                        <van-icon size="2rem" name="close" />
                    </div>
                </section>
            </div>
            <!-- Tab切换栏 -->
            <div class="h-full" style="background-color: #f7f8fa;">
                <van-config-provider :theme-vars="themeVars">
                    <van-tabs border background="#F5F5F5" color="#3190e8" title-active-color="#3190e8" v-model:active="active">
                        <!-- 商品菜单 -->
                        <van-tab style="height: 100%;" title="商品">
                            <div v-if="foodMenuData.length > 0" style="height: 100%" ref="menuRef">
                                <van-tree-select
                                :height="foodMenuHeight"
                                v-model:active-id="activeId"
                                v-model:main-active-index="activeIndex"
                                :items="foodMenuData"
                                @click-nav="changeCategory"
                                class="pb-8"
                                >
                                    <template #content>
                                        <div ref="anchorPoint">
                                            <div v-for="(item, index) in foodMenuData" :id="'id'+index" class="anchor" :key="index">
                                                <div class="px-2 py-4" style="background-color: #f7f8fa;">
                                                    <span>{{item.text}}</span>
                                                    <span class="ml-2 font-light">{{item.description}}</span>
                                                </div>
                                                <div>
                                                    <ul v-for="foods in item.children" :key="foods._id">
                                                        <li>
                                                            <div id="shop-item-container" class="flex border-b">
                                                                <!-- img -->
                                                                <div class="m-1">
                                                                    <van-image width="46" height="46" style="vertical-align:bottom;display:block;" :src="imgBaseUrl + foods.image_path"></van-image>
                                                                </div>
                                                                <!-- 店铺名/描述/月销/好评率 -->
                                                                <div class="m-1 flex flex-col flex-1 overflow-x-hidden text-base">
                                                                    <span class="ml-1 w-full font-medium truncate ...">{{foods.name}}</span>
                                                                    <span class="ml-1 text-gray-400 w-full truncate ...">{{foods.description}}</span>
                                                                    <div class="ml-1">
                                                                        <span>月售{{foods.month_sales}}份</span>
                                                                        <span class="ml-2">好评率{{foods.satisfy_rate}}%</span>
                                                                    </div>
                                                                    <!-- 标签 -->
                                                                    <div class="ml-1">
                                                                        <van-tag v-if="foods.activity" plain round :color="'#' + foods.activity.icon_color" :text-color="'#' + foods.activity.image_text_color">{{foods.activity.image_text}}</van-tag>
                                                                    </div>
                                                                    <div class="flex m-1 justify-between">
                                                                        <!-- 单价 -->
                                                                        <div class="text-orange-600">
                                                                            <span class="text-xs">¥</span>
                                                                            <span>{{foods.specfoods[0].price}}</span>
                                                                            <!-- 如果该商品可自定义规格显示该字段 -->
                                                                            <span v-if="foods.specifications.length">起</span>
                                                                        </div>
                                                                        <!-- 添加购物车组件 -->
                                                                        <buy-cart :foods='foods' :shopId='shopId' @showCheckModal="showCheckModal" :shopCart="shopCart"></buy-cart>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </van-tree-select>
                                <!-- 购物车 -->
                                <div id="buy_cart_container" class="absolute bottom-0 left-0 w-full h-8 bg-gray-700" style="z-index: 9999" @click="showBuyCart">
                                    <div>
                                        <!-- icon -->
                                        <div id="cart_icon" class="absolute left-2 -top-3 w-8 h-8 flex justify-center items-center border-1 rounded-full" :class="totalNum > 0 ? 'bg-blue-400' : 'bg-gray-700'">
                                            <svg class="w-5 h-5">
                                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-icon"></use>
                                            </svg>
                                            <div class="absolute -top-1 right-0 bg-red-500
                                            rounded-full w-3 h-3 flex justify-center items-center
                                            text-xxs text-white">{{totalNum}}</div>
                                        </div>
                                        <!-- 结算价/配送费 -->
                                        <div class="absolute flex flex-col left-12 h-full text-xxs text-white">
                                            <span>¥{{totalPrice}}</span>
                                            <span>配送费¥{{deliveryFee}}</span>
                                        </div>
                                        <div class="absolute flex justify-center items-center right-0 h-full w-20 text-xxs text-white" :class="miniOrderAmount > 0 ? 'bg-gray-600' : 'bg-green-400'">
                                            <span v-if="miniOrderAmount > 0">还差¥{{miniOrderAmount}}起送</span>
                                            <router-link tag="span" :to="{path:'/confirmOrder', query:{geohash, shopId}}" v-else>去结算</router-link>
                                        </div>
                                    </div>
                                </div>
                                <!-- 购物车列表 -->
                                <van-popup v-model:show="isShowBuyCart" position="bottom" duration="0">
                                    <div class="text-gray-500">
                                        <header class="flex justify-between bg-gray-200 text-xxs p-2">
                                            <span>购物车</span>
                                            <div @click="clearCart">
                                                <van-icon name="delete" />
                                                <span>清空</span>
                                            </div>
                                        </header>
                                        <div class="flex flex-col mb-10 text-xxs p-2">
                                            <ul>
                                                <li v-for="(item, index) in shopCartList" :key="index" class="flex my-1">
                                                    <div class="flex-1 flex flex-col">
                                                        <span>{{item.name}}</span>
                                                        <span class="text-gray-400">{{item.specs}}</span>
                                                    </div>
                                                    <div class="flex">
                                                        <span class="mr-2 text-orange-600">¥{{item.price}}</span>
                                                        <span @click="removeOutCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)">
                                                            <svg class="w-4 h-4" style="fill: #3190e8;">
                                                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
                                                            </svg>
                                                        </span>
                                                        <span class="min-w-8 text-center">{{item.num}}</span>
                                                        <span @click="addToCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)">
                                                            <svg class="w-4 h-4" style="fill: #3190e8;">
                                                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </van-popup>
                            </div>
                        </van-tab>
                        <!-- 评价 -->
                        <van-tab title="评价">
                            <div :style="{
                                'height': foodMenuHeight + 'px',
                                'overflow-y': 'scroll',
                                'background-color': '#f7f8fa'
                            }">
                                <!-- 综合评价 -->
                                <div class="w-full flex justify-around py-2 bg-white mb-1">
                                    <div class="flex flex-col items-center">
                                        <span class="text-orange-500">{{shopDetailData.rating}}</span>
                                        <span class="text-xxs">综合评价</span>
                                        <span class="text-xxs text-gray-400">高于周围商家{{(ratingScoreData.compare_rating*100).toFixed(1)}}%</span>
                                    </div>
                                    <div class="flex flex-col text-xxs justify-center">
                                        <div>
                                            <span class="mr-1">服务态度</span>
                                            <van-rate :size="8" allow-half readonly color="#ff9a0d" v-model="ratingScoreData.service_score" />
                                            <span class="ml-2 text-orange-500">{{ratingScoreData.service_score.toFixed(1)}}</span>
                                        </div>
                                        <div>
                                            <span class="mr-1">菜品评价</span>
                                            <van-rate :size="8" allow-half readonly color="#ff9a0d" v-model="ratingScoreData.service_score" />
                                            <span class="ml-2 text-orange-500">{{ratingScoreData.food_score.toFixed(1)}}</span>
                                        </div>
                                        <div>
                                            <span class="mr-1">送达时间</span>
                                            <span>10分钟</span>
                                        </div>
                                    </div>
                                </div>
                                <!-- 用户评价 -->
                                <div class="bg-white p-2">
                                        <span v-for="(item, index) in ratingTagsList" :key="index" @click="chooseTag(index, item.name)" class="bg-blue-100 text-xxs p-1 m-1 inline-block rounded"
                                        :class="[item.unsatisfied && ratingTagIndex !== index ? 'bg-gray-100' : '', ratingTagIndex == index ? 'text-white bg-blue-500' : '']">{{item.name}}({{item.count}})</span>
                                        <van-list
                                        v-model:loading="loading"
                                        :offset="100"
                                        :finished="finished"
                                        finished-text="没有更多了"
                                        @load="onLoad"
                                        class="mt-2"
                                        >
                                            <div v-for="(item, index) in ratingList" :key="index" class="text-xxs border-t border-b py-2 flex">
                                                <div>
                                                    <van-image width="42" height="42" round :src="getImgPath(item.avatar)"></van-image>
                                                </div>
                                                <div class="relative flex-1 flex flex-col ml-2">
                                                    <span>{{item.username}}</span>
                                                    <div>
                                                        <van-rate :size="8" allow-half readonly color="#ff9a0d" v-model="item.rating_star" />
                                                        <span class="ml-2">{{item.time_spent_desc}}</span>
                                                    </div>
                                                    <div class="flex">
                                                        <div v-for="(item, index) in item.item_ratings" :key="index">
                                                            <van-image v-if="item.image_hash"  width="80" height="80" :src="getImgPath(item.image_hash)"></van-image>
                                                        </div>
                                                    </div>
                                                    <span class="absolute top-0 right-0 text-3xs text-gray-500">{{item.rated_at}}</span>
                                                </div>
                                            </div>
                                            <!-- 加载提示 -->
                                            <template #loading>
                                                <div>
                                                    <span>加载中...</span>
                                                </div>
                                            </template>
                                            <!-- 触底提示 -->
                                            <template #finished>
                                                <div>
                                                    <span>没有更多了</span>
                                                </div>
                                            </template>
                                        </van-list>
                                </div>
                            </div>
                        </van-tab>
                    </van-tabs>
                </van-config-provider>
            </div>
        </div>
        <!-- 多规格商品选择框 -->
        <van-popup v-model:show="isShow" class="relative w-2/3 text-xxs rounded-sm">
            <div class="absolute top-1 right-1 text-gray-500" @click="closeCheckModal">
                <van-icon name="cross" size="1rem"></van-icon>
            </div>
            <div class="mx-4 my-2">
                <div class="text-center truncate ...">{{selectedFoods.name}}</div>
            </div>
            <div class="mx-4 my-2">
                <div>{{selectedFoods.specifications[0].name}}</div>
                <div class="my-1">
                    <ul class="flex flex-wrap">
                        <li v-for="(item, index) in selectedFoods.specifications[0].values" :key="index" class="mr-2 mb-2 p-1 border rounded-sm"
                        :class="specsIndex == index ? 'text-blue-500 border-blue-500' : ''"
                        @click="chooseSpecs(index)">
                            <span v-if="item !== ''">{{item}}</span>
                            <span v-else>空</span>
                        </li>
                    </ul>
                </div>
            </div>
            <footer class="flex justify-between items-center bg-gray-200 px-2 py-1">
                <span class="text-orange-500">¥{{selectedFoods.specfoods[specsIndex].price}}</span>
                <van-button type="primary" size="mini" @click="addSpecs(selectedFoods.category_id, selectedFoods.item_id, selectedFoods.specfoods[specsIndex].food_id, selectedFoods.specfoods[specsIndex].name, selectedFoods.specfoods[specsIndex].price, selectedFoods.specifications[0].values[specsIndex], selectedFoods.specfoods[specsIndex].packing_fee, selectedFoods.specfoods[specsIndex].sku_id, selectedFoods.specfoods[specsIndex].stock)">加入购物车</van-button>
            </footer>
        </van-popup>
        <!-- loading -->
        <Loading v-if="showLoading" class="z-10"></Loading>
        <!-- 骨架屏 -->
        <section class="fixed w-full h-full" v-if="showLoading"
        >
           <img class="w-full h-full" src="@/assets/image/shop_back_svg.svg">
        </section>
        <!-- 子路由渲染 -->
        <router-view/>
    </div>
</template>

<script>
import { toRefs, ref, reactive, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { msiteAddress } from '@/api/msite/msite'
import { shopDetailData, foodMenu, ratingScores, ratingTags, getRatingList } from '@/api/shop/shop'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { imgBaseUrl } from '@/config/env'
import { getImgPath } from '@/config/utils'
import Loading from '@/components/Loading'
import BuyCart from '@/components/BuyCart'
export default {
    components: {
        Loading,
        BuyCart
    },
    setup() {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const useMutation = store._mutations
        const themeVars = {
            treeSelectNavItemPadding: '1.5rem',
            sidebarSelectedBorderColor: '#3190e8',
        }
        const menuRef = ref(null)   // 获取树状菜单DOM节点
        const anchorPoint = ref(null)   // 获取食品分类子项DOM节点
        const shopCart = computed(() => {   // 初始化购物车
            return Object.assign({}, store.state.cartList[state.shopId])
        })
        const miniOrderAmount = computed(() => {    // 最低起送价格
            if(state.shopDetailData) {
                return state.shopDetailData.float_minimum_order_amount - state.totalPrice
            }else{
                return null
            }
        })
        const deliveryFee = computed(() => {    // 配送费
            if(state.shopDetailData) {
                return state.shopDetailData.float_delivery_fee
            }else{
                return null
            }
        })
        const totalNum = computed(() => {   // 购物车商品总数
            let num = 0
            state.shopCartList.forEach((item) => {
                num += item.num
            })
            return num
        })
        const state = reactive({
            geohash: '',
            shopId: null,   // 商铺ID
            shopDetailData: null,   // 商铺详情信息
            imgBaseUrl,
            timer: [],
            active: 0,
            activeId: 1,
            activeIndex: 0,
            foodMenuData: [],
            isShowActivity: false,  // 是否展示活动详情页
            isShow: false,  // 是否显示多规格商品选择框
            isShowBuyCart: false,  // 是否显示购物车清单
            shopCartList: [], // 购物车清单
            totalPrice: null,   // 购物车总价
            selectedFoods: null,    // 当前选中的多规格商品
            showLoading: true,
            specsIndex: 0,
            // 树状菜单实现双向定位
            foodMenuHeight: null,
            foodMenuTop: null,  // 树状菜单与视口顶部距离
            documentHeight: null, // 视口高度
            nowLeftTopPosition: null,   // 记录左侧tab栏y轴当前位置
            nowRightTopPosition: null,   // 记录右侧菜单栏y轴当前位置
            changeCategoryStatus: false, // 是否选中左侧tag栏 (优化双向定位切换效果)
            foodMenuScroll: false,  // 右侧食品列表当前是否正处于滚动状态
            // 评价
            ratingScoreData: null,  // 评价数据
            ratingTagsList: [], // 评论标签列表
            ratingTagIndex: 0,  // 当前选中标签索引
            ratingOffset: 0,    // 评论数据分页
            ratingTagName: null,   // 评论标签名称
            ratingList: null, // 评论列表
            finished: false,
            loading: false, // 分页加载
        })
        watch(shopCart, (val) => {
            // console.log(val)
            initBuyCart()
        })
        onMounted(() => {
            useMutation.INIT_BUYCART[0]()
            initData()
            state.timer[0] = setInterval(() => {  // 300ms触发一次滑动事件监听
                if(!state.changeCategoryStatus) {
                    onScroll()
                }
            }, 300)
            nextTick(() => {
                window.addEventListener('scroll', onScroll)
            })
        })
        onUnmounted(() => { // 清除定时器
            clearInterval(state.timer[0])
            clearTimeout(state.timer[1])
            clearTimeout(state.timer[2])
            state.timer[0] = null
            state.timer[1] = null
            state.timer[2] = null
        })
        // 监听右侧商品列表滚动事件
        const onScroll = () => {
            if(anchorPoint.value) {
                // 获取右侧列表当前滚动高度，通过对比本次高度和上次高度判断当前是否正处于滚动状态
                let menuScrollTop = anchorPoint.value.getBoundingClientRect().top
                if(state.nowRightTopPosition && state.nowRightTopPosition !== menuScrollTop) {
                    state.foodMenuScroll = true
                }else {
                    state.foodMenuScroll = false
                }
                // 记录本次高度信息，用于下次监听事件触发式判断滚动状态
                state.nowRightTopPosition = menuScrollTop
                // console.log('当前距离' + menuScrollTop)
                // 获取所有食品锚点
                let itemScrollTop = document.querySelectorAll('.anchor')
                let categoryIndex = 0
                // 遍历所有锚点获取对应高度,对比当前滚动高度获取当前正处于屏幕内食品子类的索引，进而实现定位功能
                itemScrollTop.forEach((item, index) => {
                    if(parseInt(0 - (menuScrollTop - state.foodMenuTop)) >= item.offsetTop) {
                        categoryIndex = index
                    }
                })
                state.activeIndex = categoryIndex
                // 左侧导航栏自动跟随功能及超过导航栏1/2高度实现中心定位
                let selectedItemTop = document.querySelectorAll('.van-sidebar-item--select')[0] // 获取当前选中的左侧tab高度
                let halfScreenHeight = state.documentHeight/2   // 获取半屏高度
                // 上拉中心定位
                if(state.foodMenuScroll && state.nowLeftTopPosition && state.nowLeftTopPosition > selectedItemTop.getBoundingClientRect().top) {
                    selectedItemTop.scrollIntoView({block: "center",behavior: "smooth"})
                    return
                }
                // 下滑中心定位
                else if(state.foodMenuScroll && selectedItemTop.getBoundingClientRect().top > halfScreenHeight) {
                    state.nowLeftTopPosition = selectedItemTop.getBoundingClientRect().top
                    selectedItemTop.scrollIntoView({block: "center",behavior: "smooth"})
                }
            }else {
                return
            }
        }
        const initData = async() => {   // 初始化数据
            state.geohash = route.query.geohash
            state.shopId = route.query.id
            // 防止刷新页面数据丢失，若经纬度不存在时重新获取
            if(!store.state.latitude) {
                let res = await msiteAddress(state.geohash)
                useMutation.RECORD_ADDRESS[0](res.data)
            }
            // 获取商铺信息
            let shopDetail = await shopDetailData(state.shopId, store.state.latitude, store.state.longitude)
            if(!shopDetail.data.promotion_info) {
                shopDetail.data.promotion_info = '欢迎光临，用餐高峰期请提前下单，谢谢。'
            }
            state.shopDetailData = shopDetail.data
            // console.log(state.shopDetailData)
            // 获取菜单栏数据
            let menuData = await foodMenu(state.shopId)
            menuData = menuData.data
            menuData.forEach(item => {
                item.foods.forEach(i => {
                    i.text = i.name
                })
            })
            state.foodMenuData = menuData.map((item) => {
                return {
                    text: item['name'],
                    description: item['description'],
                    children: item['foods'],
                    badge: null // 已加入购物车数量
                }
            })
            // 获取评论数据
            let ratingScore = await ratingScores(state.shopId)
            state.ratingScoreData = ratingScore.data
            // 获取评论标签数据
            let ratingTagsList = await ratingTags(state.shopId)
            state.ratingTagsList = ratingTagsList.data
            // 获取评论数据
            let ratingList = await getRatingList(state.shopId, state.ratingOffset)
            state.ratingList = ratingList.data
            // vuex存储店铺信息
            useMutation.RECORD_SHOPDETAIL[0](state.shopDetailData)
            // 隐藏Loading
            state.showLoading = false
            initBuyCart()
            state.timer[1] =  setTimeout(() => {
                    let foodMenuTop = menuRef.value.getBoundingClientRect().top // 菜单区域距离屏幕顶部的高度
                    state.foodMenuTop = foodMenuTop
                    let documentHeight = document.documentElement.clientHeight  // 获取移动端视口高度
                    state.documentHeight = documentHeight
                    state.foodMenuHeight = documentHeight - foodMenuTop
                    // console.log(state.foodMenuHeight)
            }, 0)
        }
        const initBuyCart = () => {
            // 获取最新购物车数据，计算子类加入购物车数量，商品总价
            let arr = []
            let shopNum = 0
            state.shopCartList = []
            state.totalPrice = 0
            state.foodMenuData.forEach((item) => {
                if(shopCart && shopCart.value[item.children[0].category_id]) {
                    let num = 0
                    Object.keys(shopCart.value[item.children[0].category_id]).forEach((itemId) => {
                        Object.keys(shopCart.value[item.children[0].category_id][itemId]).forEach((foodId) => {
                            let foodItem = shopCart.value[item.children[0].category_id][itemId][foodId]
                            num += foodItem.num
                            state.totalPrice += foodItem.num * foodItem.price
                            // console.log(state.totalPrice)
                            // 生成购物车已购商品清单数据
                            if(foodItem.num > 0) {
                                state.shopCartList[shopNum] = {}
                                state.shopCartList[shopNum].category_id = item.children[0].category_id
                                state.shopCartList[shopNum].item_id = itemId
                                state.shopCartList[shopNum].food_id = foodId
                                state.shopCartList[shopNum].num = foodItem.num
                                state.shopCartList[shopNum].price = foodItem.price
                                state.shopCartList[shopNum].name = foodItem.name
                                state.shopCartList[shopNum].specs = foodItem.specs
                                shopNum++
                            }
                        })
                    })
                    arr[item.children[0].category_id] = num
                    if(!state.shopCartList.length) {
                        state.isShowBuyCart = false
                    }
                }
            })
            // state.totalPrice = state.totalPrice.toFixed(2)
            // 填充左侧导航栏已购商品数量上标
            state.foodMenuData.forEach((item) => {
                if(Object.keys(arr).indexOf('' + item.children[0].category_id) > -1) {
                    Object.keys(arr).forEach((category) => {
                        if(category == item.children[0].category_id) {
                            if(arr[category] > 0) {
                                item.badge = arr[category]
                            }else{
                                item.badge = null
                            }
                        }
                    })
                }else{
                    item.badge = null
                }
            })
            // console.log(arr)
        }
        const goback = () => {  // 回退
            router.go(-1)
        }
        const changeCategory = (index) => { // 切换左侧tab栏
            // console.log(index)
            state.changeCategoryStatus = true
            document.querySelector('#id' + index).scrollIntoView({behavior: "smooth"})
            state.timer[2] = setTimeout(() => {
                state.changeCategoryStatus = false
            }, 800)  
        }
        const showBuyCart = () => {
            state.isShowBuyCart = true
        }
        const showCheckModal = (foods) => {
            state.isShow = true
            state.selectedFoods = foods
        }
        const closeCheckModal = () => {
            state.isShow = false
            state.specsIndex = 0
        }
        const chooseSpecs = (index) => {    // 选择规格
            state.specsIndex = index
            // console.log(state.specsIndex)
        }
        const addSpecs = (category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock) => {    // 添加多规格商品至购物车
            useMutation.ADD_CART[0]({shopid: state.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock})
            closeCheckModal()
        }
        // 加入购物车 商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
        const addToCart = (category_id, item_id, food_id, name, price, specs) => {
            useMutation.ADD_CART[0]({shopid: state.shopId, category_id, item_id, food_id, name, price, specs})
        }
        // 移除购物车
        const removeOutCart = (category_id, item_id, food_id, name, price, specs) => {
            useMutation.REDUCE_CART[0]({shopid: state.shopId, category_id, item_id, food_id, name, price, specs})
        }
        // 清空购物车
        const clearCart = () => {
            state.isShowBuyCart = false
            useMutation.CLEAR_CART[0](state.shopId);
        }
        // 选择评论标签
        const chooseTag = async(index, name) => {
            state.ratingTagIndex = index
            state.ratingOffset = 0
            state.ratingTagName = name
            let res = await getRatingList(state.shopId, state.ratingOffset, name)
            state.ratingList = res.data
        }
        const onLoad = async() => {
            state.ratingOffset +=10
            let res = await getRatingList(state.shopId, state.ratingOffset, state.ratingTagName)
            state.ratingList = [...state.ratingList, ...res.data]
            // 数据全部加载完成后禁用上拉加载
            // if(state.ratingList.length < 10) {
            //     state.finished = true
            // }
            if(state.ratingOffset >= 50) {
                state.finished = true
            }
            state.loading = false
        }
        return {
            ...toRefs(state),
            themeVars,
            menuRef,
            anchorPoint,
            goback,
            changeCategory,
            onScroll,
            showBuyCart,
            showCheckModal,
            closeCheckModal,
            chooseSpecs,
            addSpecs,
            shopCart,
            addToCart,
            removeOutCart,
            clearCart,
            miniOrderAmount,
            deliveryFee,
            totalNum,
            chooseTag,
            getImgPath,
            onLoad
        }
    }
}
</script>

<style scoped>
.header_bg {
    background-color: rgba(119, 103, 137, 0.43);
    z-index: 10;
}
.van-tree-select >>> .van-tree-select__nav-item {
    padding: 1rem!important;
}
.van-tree-select >>> .van-tree-select__content {
    flex: 2!important;
    overflow-x: hidden!important;
}
.van-tree-select >>> .van-badge__wrapper {
    position: initial;
}
.van-tree-select >>> .van-badge--top-right {
    top: 0.5rem;
    right: 0.75rem;
}
</style>