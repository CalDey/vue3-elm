<template>
    <div>
        <head-top signin-up="msite">
            <!-- 搜索图标 -->
            <template #search>
                <router-link :to="/search/ + geohash" tag="a" class="absolute top-1/2 left-2 -translate-y-1/2">
                    <svg class="w-4 h-4 fill-current text-white" xmlns="http://www.w3.org/2000/svg" version="1.1">
                        <circle cx="8" cy="8" r="7" stroke="rgb(255,255,255)" stroke-width="1" fill="none"/>
                        <line x1="14" y1="14" x2="20" y2="20" style="stroke:rgb(255,255,255);stroke-width:2"/>
                    </svg>
                </router-link>
            </template>
            <!-- 当前定位信息（居中显示） -->
            <template #msiteTitle>
                <section class="absolute top-1/2 left-1/2 w-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white text-xxs">
                    <router-link to="/home">
                        <span class="block truncate ...">{{msiteTitle}}</span>
                    </router-link>
                </section>
            </template>
        </head-top>
        <!-- 美食品类宫格轮播 -->
        <van-swipe id="my-swipe" class="pt-8" :autoplay="false" indicator-color="#007aff">
            <van-swipe-item v-for="(item, index) in foodTypeList" :key="index">
                <van-grid :border="false" :icon-size="40">
                    <van-grid-item v-for="foodItem in item" :key="foodItem.id" :icon="imgBaseUrl + foodItem.image_url" :text="foodItem.title" @click="gotoFoodPage(foodItem)" />
                </van-grid>
            </van-swipe-item>
        </van-swipe>
        <!-- 附近商家 -->
        <div class="mt-2 border-t-2 bg-gray-50">
            <div class="flex items-center p-1">
                <svg class="w-4 h-4 fill-current text-gray-400">
	    			<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#shop"></use>
	    		</svg>
                <span class="ml-2 text-gray-400 text-xxs">附近商家</span>
            </div>
            <!-- 商户列表组件 -->
            <shop-list v-if="hasData" :geohash="geohash"></shop-list>
        </div>
        <!-- Tabbar组件 -->
        <Footer class="mt-12"></Footer>
    </div>
</template>

<script>
import { onActivated, onMounted, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import HeadTop from '@/components/HeadTop'
import Footer from '@/components/Footer'
import ShopList from '@/components/ShopList'
import { guessCity } from '@/api/city/city'
import { msiteFoodTypes, msiteAddress } from '@/api/msite/msite'
import { imgBaseUrl } from '@/config/utils'
export default {
    name: 'Msite',
    components: {
        HeadTop,
        ShopList,
        Footer
    },
    setup() {
        let route = useRoute()
        let router = useRouter()
        let store = useStore()
        const useMutation = store._mutations
        // console.log(useMutation)
        const state = reactive({
            geohash: '',    // 路由传递过来的经纬度数据
            msiteTitle: '请选择地址...',
            foodTypeList: [],   // 食品品类分类列表
            imgBaseUrl, // 图片前缀
            hasData: false  // 是否已获取到回调数据
        });
        onActivated(async() => {    // 每次进入页面都加载一次（keep-alive）
            if(!route.query.geohash) {
                const address = await guessCity()
                state.geohash = address.latitude + ',' + address.longitude
            }else{
                state.geohash = route.query.geohash
            }
            // 保存geohash至vuex
            useMutation.SAVE_GEOHASH[0](state.geohash)
            // 根据geohash解析当前位置信息
            let res = await msiteAddress(state.geohash)
            state.msiteTitle = res.data.name
            // 记录当前经纬度
            useMutation.RECORD_ADDRESS[0](res.data)
            state.hasData = true
        })
        onMounted(() => {
            initFoodsType()
        });
        // 初始化轮播宫格数据
        const initFoodsType = async() => {
            const food_types = await msiteFoodTypes(state.geohash).then((res) => {
                let resArr = [...res.data],   // 克隆一个新数组用于数据处理
                    foodArr = []
                for(let i = 0, j = 0; i <= resArr.length; i+=8, j++) {
                    foodArr[j] = resArr.splice(0, 8)
                }
                state.foodTypeList = foodArr
            })
        }
        // 跳转至特色店铺列表
        const gotoFoodPage = (item) => {
            router.push({path: '/food', query: {geohash: state.geohash, title: item.title, restaurant_category_id: getCategoryId(item.link)}})
        }
        // 解析获取category_id
        const getCategoryId = (url) => {
            // decodeURIComponent() 中文字符解码
            let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name',''))
            if(/restaurant_category_id/gi.test(urlData)) {
                return JSON.parse(urlData).restaurant_category_id.id
            }else{
                return ''
            }
        }
        return {
        ...toRefs(state),
        gotoFoodPage
        }
    }
}
</script>

<style>
</style>