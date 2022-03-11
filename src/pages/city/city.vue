<template>
    <div class="pt-8">
        <!-- 城市选择页 -->
        <head-top :head-title="city_name" :go-back="true">
            <template #changeCity>
                <router-link to="/home" class="absolute top-1/2 right-2 transform -translate-y-1/2 text-white text-xxs">切换城市</router-link>
            </template>
        </head-top>
        <!-- form表单 禁止默认事件触发 -->
        <form class="mt-2 bg-gray-50 border-t-2 border-b-2" @submit.prevent>
            <div class="p-2">
                <input type="search" class="h-8 border w-full pl-1" name="city" placeholder="请输入地址" required v-model="inputValue">
                <button class="w-full h-8 mt-2 bg-blue-400 hover:bg-blue-500 text-white" @click="posPlace">提交</button>
            </div>
        </form>
        <!-- 搜索历史 -->
        <header v-if="showHistory" class="ml-2 text-gray-500 text-xxs">搜索历史</header>
        <ul class="bg-gray-50 border-t-2 border-b-2">
            <li v-for="(item, index) in placeList" :key="index" @click="nextPage(index, item.geohash)" class="mb-1">
                <span class="px-2 block">{{item.name}}</span>
                <span class="px-2 block text-xxs text-gray-400">{{item.address}}</span>
            </li>
        </ul>
        <button v-if="showHistory&&placeList.length" class="mt-2 w-full h-8 bg-white" @click="removeAll">清空数据</button>
    </div>
</template>

<script>
import { onMounted, toRefs, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCityName, searchPlace } from '@/api/city/city'
import { getStore, setStore, removeStore } from '@/config/utils'
import HeadTop from '@/components/HeadTop'
export default {
    name: 'City',
    components: {
        HeadTop
    },
    setup() {
        let route = useRoute()
        let router = useRouter()
        const state = reactive({
            city_id: '',    // 城市id
            city_name: '',  // 当前城市名称
            inputValue: '', // 输入地址
            placeList: [], // 搜索地址列表
            historyList: [],    // 搜索历史列表
            showHistory: true, // 默认显示搜索记录
            no_data: false, // 若无搜索结果，显示提示文本
        });
        onMounted(() => {
            initCity()
            initData()
        })
        // 数据初始化
        const initCity = async() => {
            // 通过路由传递城市id，根据id获取对应城市名称
            state.city_id = route.params.cityid
            const city_name = await getCityName(state.city_id)
            state.city_name = city_name.data.name
        }
        const initData = async() => {
            // 若存在历史记录，默认显示历史记录
            if(getStore('placeHistory')) {
                state.placeList = JSON.parse(getStore('placeHistory'))
            }else{
                state.placeList = []
            }
        }
        // 搜索输入地址
        const posPlace = () => {
            if(state.inputValue) {
                searchPlace(state.city_id, state.inputValue).then((res) => {
                    state.showHistory = false
                    state.placeList = res.data
                    state.no_data = res.length ? true : false
                })
            }
        }
        // 跳转到下一页面并写入历史记录
        // 跳转前先判断该条数据是否已经存在，防止重复写入
        const nextPage = (index,geohash) => {
            let history = getStore('placeHistory')
            let choosePlace = state.placeList[index]
            // 若存在历史记录，将本次数据与历史数据进行比对，若重复则不写入本次数据
            if(history) {
                let checkRepeat = false
                state.historyList = JSON.parse(history)
                state.historyList.forEach(item => {
                    // 比对两次数据的经纬度，若相同则本条数据已存在，不执行写入操作
                    if(item.geohash == geohash) {
                        checkRepeat = true
                    }
                })
                // 本次数据为新数据，记录本次数据
                if(!checkRepeat) {
                    state.historyList.push(choosePlace)
                }
            }else{
                // 历史记录不存在，直接记录本次数据
                state.historyList.push(choosePlace)
            }
            // 将历史记录写入缓存中
            setStore('placeHistory', state.historyList)
            // 路由带参跳转到商铺列表页
            router.push({path: '/msite', query: {geohash}})
        }
        // 清空历史数据
        const removeAll = () => {
            removeStore('placeHistory')
            initData()
        }
        return {
            ...toRefs(state),
            posPlace,
            nextPage,
            removeAll
        }
    }
}
</script>

<style>
</style>