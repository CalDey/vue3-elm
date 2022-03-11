<template>
    <div>
        <!-- 引入HeadTop组件 -->
        <head-top signin-up="home">
            <!-- vue3具名插槽使用不同于vue2，需要嵌套template -->
            <template #logo>
                <span class="ml-1.5 h-8 leading-8 font-serif text-white">{{title}}</span>
            </template>
        </head-top>
        <!-- 空出头部组件高度 -->
        <!-- 城市选择 -->
        <nav id="city_nav" class="pt-8 mb-2 bg-gray-50 divide-y border-b-2">
            <div class="px-2 py-1 flex justify-between leading-6 font-serif text-xxs">
                <span>当前定位城市:</span>
                <span>如果不准确，请在城市列表中选择</span>
            </div>
            <!-- 当前定位 -->
            <router-link :to="'/city/' + guess_city_id" id="now_city" class="px-2 py-1 flex justify-between items-center leading-6">
                <span class="text-blue-400">{{guess_city}}</span>
                <svg id="arrow_right" class="w-4 h-4 fill-current text-gray-300">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                </svg>
            </router-link>
        </nav>
        <!-- 热门城市 -->
        <nav id="hot_city" class="mb-2 bg-gray-50 border-t-2 divide-y">
            <span class="inline-block leading-6 px-2 py-1 font-serif text-xs">热门城市</span>
            <ul class="flex flex-wrap">
                <router-link tag="li" :to="'/city/' + item.id" v-for="item in hotCityList" :key="item.id" class="w-1/4 h-8 leading-8 text-center font-serif text-xs border border-gray-200 text-blue-400">
                    {{item.name}}
                </router-link>
            </ul>
        </nav>
        <!-- 全部城市列表（按照拼音顺序排序） -->
        <nav id="all_city" class="mb-2 bg-gray-50 border-t-2 divide-y" v-for="(item1, index) in citySortList" :key="index">
            <span v-if="item1=='A'" class="inline-block leading-6 px-2 py-1 font-serif text-xs">{{item1}}&nbsp;(按字母排序)</span>
            <span v-else class="inline-block leading-6 px-2 py-1 font-serif text-xs">{{item1}}</span>
            <ul class="flex flex-wrap">
                <router-link tag="li" :to="'/city/' + item2.id" v-for="item2 in allCityList[item1]" :key="item2.id" class="w-1/4 h-8 leading-8 text-center font-serif text-xs border border-gray-200 truncate ...">
                    {{item2.name}}
                </router-link>
            </ul>
        </nav>
    </div>
</template>

<script>
import  { onMounted, reactive, toRefs, getCurrentInstance } from 'vue'
import HeadTop from '@/components/HeadTop'
import { guessCity, hotCity, allCity } from '@/api/city/city'
export default {
    name: 'Home',
    components: {
        HeadTop
    },
    setup() {
        // 获取全局属性
        // const instance = getCurrentInstance()
        // const _this = instance.appContext.config.globalProperties
        const state = reactive({
            title: 'ele.me',
            guess_city: '未知',
            guess_city_id: '',
            hotCityList: [],
            citySortList: [],
            allCityList: []
        });
        onMounted(() => {
            getGuessCity()
            getHotCity()
            getAllCity()
        })
        // 获取默认城市
        const getGuessCity = async() => {
            const guess_city = await guessCity()
            state.guess_city = guess_city.data.name
            state.guess_city_id = guess_city.data.id
        }
        // 获取热门城市
        const getHotCity = async() => {
            const hot_city = await hotCity()
            state.hotCityList = hot_city.data
        }
        // 获取全部城市列表
        const getAllCity = async() => {
            const all_city = await allCity()
            let sortArr = []
            state.allCityList = all_city.data
            // 根据A-Z字母顺序重新对数组排序
            Object.keys(state.allCityList).forEach(i => {
                sortArr.push(i.charCodeAt(0))
            })
            sortArr.sort((a,b) => {return a - b}).forEach((item) => {
                state.citySortList.push(String.fromCharCode(item))
            })
        }
        return {
            ...toRefs(state),
        }
    }
}
</script>

<style>
</style>