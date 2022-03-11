<template>
    <div class="absolute top-0 right-0 bottom-0 right-0 w-full h-full bg-gray-200 z-50">
        <head-top head-title="搜索地址" :go-back='true'></head-top>
        <section class="flex mt-8 bg-white p-2">
            <input type="text" placeholder="请输入小区/写字楼/学校等" class="flex-1 border border-gray-300 rounded pl-2 mr-1 text-1xs" v-model="inputVal">
            <button class="bg-blue-400 py-1 px-2 rounded text-white text-1xs" @click="searchAddress">确认</button>
        </section>
        <div class="bg-orange-100 text-xxs text-center text-orange-400">为了满足商家的送餐要求，建议您从列表中选择地址</div>
        <section v-if="noData" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center text-1xs text-gray-400">
            <p class="my-1">找不到地址？</p>
            <p class="my-1">请尝试输入小区、写字楼或学校名</p>
            <p class="my-1">详细地址（如门牌号）可稍后输入哦。</p>
        </section>
        <section v-else class="bg-gray-200">
            <ul class="divide-y divide-gray-500 m-2">
                <li v-for="(item, index) in addressList" :key="index" class="text-1xs" @click="chooseAddress(item)">
                    <p class="my-1">{{item.name}}</p>
                    <p class="my-1">{{item.address}}</p>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { searchNearby } from '@/api/address/address'
import HeadTop from '@/components/HeadTop'
export default {
    components: {
        HeadTop
    },
    setup() {
        const store = useStore()
        const useMutation = store._mutations
        const router = useRouter()
        const state = reactive({
            noData: true,
            inputVal: '',
            addressList: []
        })
        onMounted(() => {
            state.inputVal = store.state.addAddress ? store.state.addAddress : state.inputVal
        })
        const searchAddress = () => {
            searchNearby(state.inputVal).then(res => {
                state.addressList = res.data
                state.noData = false
            })
        }
        const chooseAddress = (item) => {
            // console.log(item.name)
            useMutation.SAVE_ADDDETAIL[0](item.name)
            router.go(-1)
        }
        return {
            ...toRefs(state),
            searchAddress,
            chooseAddress
        }
    }
}
</script>

<style scoped>
.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
}
.router-slid-enter-from, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
}
</style>