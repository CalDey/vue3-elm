<template>
    <div>
        <span class="text-xxs text-orange-500 border border-orange-500 p-1 rounded" @click="gotoPay">{{remaining}}</span>
        <van-dialog v-model:show="showAlert">
            <template #default>
                <div class="flex flex-col items-center">
                    <van-icon size="82" class="m-2 text-yellow-400" name="warning-o" />
                    <span class="mb-2">{{alertText}}</span>
                </div>
            </template>
            <template #footer>
                <div class="bg-green-400">
                    <button class="w-full h-6 text-white" @click="showAlert=false">确认</button>
                </div>
            </template>
        </van-dialog>
    </div>
</template>

<script>
import { reactive, toRefs, onMounted, computed } from 'vue'
export default {
    name: 'ComputeTime',
    props: ['time'],
    setup(props) {
        const numTime = computed(() => {    // 处理订单返回时间
            if(props.time.toString().indexOf('分钟') !== -1) {
                return parseInt(props.time)*60
            }else{
                return parseInt(props.time);
            }
        })
        const remaining = computed(() => {  // 格式化时间
            let min = parseInt(state.countTime/60)
            let sec = parseInt(state.countTime%60)
            if(min < 10) {
                min = '0' + min
            }
            if(sec < 10) {
                sec = '0' + sec
            }
            return '去支付（还剩' + min + '分' + sec + '秒）'
        })
        const state = reactive({
            countTime: 900,
            showAlert: false,
            alertText: null,
            timer: null
        })
        onMounted(() => {
            state.countTime -= numTime.value    // 同步最新时间
            remainingTime()
        })
        const remainingTime = () => {
            clearInterval(state.timer)
            state.timer = setInterval(() => {
                state.countTime--
                if(state.countTime == 0) {
                    clearInterval(state.timer)
                    state.showAlert = true
                    state.alertText = '支付超时'
                }
            }, 1000)
        }
        const gotoPay = () => {
            state.showAlert = true
            state.alertText = '暂不开放支付接口';
        }
        return {
            numTime,
            remaining,
            gotoPay,
            ...toRefs(state)
        }
    },

}
</script>

<style scoped>

</style>