<template>
    <div class="fixed top-0 right-0 bottom-0 right-0 bg-gray-200 w-full z-50">
        <head-top head-title="在线支付" :go-back="true"></head-top>
        <section class="flex flex-col mt-8 bg-white p-4 text-center">
            <span class="text-gray-400 text-1xs">剩余支付时间</span>
            <span class="text-xl">{{remaining}}</span>
        </section>
        <span class="inline-block text-gray-500 text-1xs ml-2 my-1">选择支付方式</span>
        <section class="bg-white pl-2 divide-y text-1xs text-gray-500">
            <div class="flex justify-between items-center py-2">
                <div class="flex items-center">
                    <img class="w-8 h-8" src="@/assets/image/zhifubao.png"/>
                    <span class="ml-2">支付宝</span>
                </div>
                <svg class="w-4 h-4 mr-2" @click="payWay = 1" :style="payWay == 1 ? 'fill: #4cd964' : 'fill: #cccccc'">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
                </svg>
            </div>
            <div class="flex justify-between items-center py-2">
                <div class="flex items-center">
                    <svg class="w-8 h-8">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#weixin"></use>
                    </svg>
                    <span class="ml-2">微信</span>
                </div>
                <svg class="w-4 h-4 mr-2" @click="payWay = 2" :style="payWay == 2 ? 'fill: #4cd964' : 'fill: #cccccc'">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
                </svg>
            </div>
        </section>
        <div class="mt-4 mx-2">
            <button class="w-full bg-green-400 py-1 rounded text-white" @click="confrimPay">确认支付</button>
        </div>
        <van-dialog v-model:show="showAlert">
            <template #default>
                <div class="flex flex-col items-center">
                    <van-icon size="82" class="m-2 text-yellow-400" name="warning-o" />
                    <span class="mb-2">{{alertText}}</span>
                </div>
            </template>
            <template #footer>
                <div class="bg-green-400">
                    <button class="w-full h-6 text-white" @click="handleConfirm">确认</button>
                </div>
            </template>
        </van-dialog>
    </div>
</template>

<script>
import { reactive, toRefs, onMounted, computed, onUnmounted } from 'vue'
import { payRequest } from '@/api/order/order'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import HeadTop from '@/components/HeadTop'
export default {
    components: {
        HeadTop
    },
    setup() {
        const store = useStore()
        const router = useRouter()
        const useMutation = store._mutations
        const state = reactive({
            payDetail: null,    //  付款信息
            showAlert: false,
            alertText: null,
            countNum: 900,  // 倒计时
            payWay: 1, //付款方式
            gotoOrder: false
        })
        const initData = async() => {
        // 调起支付请求接口（本项目未接通支付）
        let payDetail = await payRequest(store.state.orderMessage.order_id, store.state.userInfo.user_id)
        state.payDetail = payDetail.data
        if(state.payDetail.message) {
                state.showAlert = true
                state.alertText = state.payDetail.message
                return
            }
        }
        initData()
        // 模拟支付完成，清空当前店铺对应购物车数据结构
        if(store.state.shopid) {
            useMutation.CLEAR_CART[0](store.state.shopid)
        }
        onMounted(() => {
            remainingTime() // 倒计时
        })
        onUnmounted(() => {
            clearInterval(state.timer)
        })
        const remainingTime = () => {
            clearInterval(state.timer)
            state.timer = setInterval(() => {
                state.countNum --
                if(state.countNum == 0) {
                    clearInterval(state.timer)
                    state.showAlert = true
                    state.alertText = '支付已超时'
                }
            }, 1000)
        }
        const remaining = computed(() => {
            let min = parseInt(state.countNum/60)
            if(min < 10) {
                min = '0' + min
            }
            let sec = parseInt(state.countNum%60)
            if(sec < 10) {
                sec = '0' + sec
            }
            return '00: ' + min + ' : ' + sec
        })
        const confrimPay = () => {  // 确认订单
            state.showAlert = true
            state.alertText = '当前环境无法支付，请打开官方APP进行付款'
            state.gotoOrder = true
        }
        const handleConfirm = () => {
            state.showAlert = false
            if(state.gotoOrder) {
                router.push('/order')
            }
        }
        return {
            ...toRefs(state),
            remaining,
            confrimPay,
            handleConfirm
        }
    }
}
</script>

<style scoped>

</style>