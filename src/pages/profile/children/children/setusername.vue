<template>
    <div class="absolute top-0 right-0 bottom-0 right-0 w-full bg-gray-200">
        <head-top head-title="修改用户名" :go-back='true'></head-top>
        <section class="mt-10 p-2">
            <div>
                <input type="text" class="w-full border bg-gray-200 text-1xs py-1 pl-2" :class="earn ? 'border-red-400' : 'border-gray-400'" maxlength="24" placeholder="请输入新用户名" v-model="inputVal">
            </div>
            <span class="text-3xs" :class="earn ? 'text-red-400' : 'text-gray-500'">用户名只能修改一次（5-24字符之间）</span>
            <div class="my-2 text-white">
                <button class="w-full p-2" :class="inputVal.length >= 5 ? 'bg-green-400' : 'bg-gray-400'" @click="resetName">确认修改</button>
            </div>
        </section>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import HeadTop from '@/components/HeadTop'
export default {
    components: {
        HeadTop
    },
    setup() {
        const store = useStore()
        const useMutation = store._mutations
        const router =useRouter()
        const state = reactive({
            inputVal: '',
            earn: false
        })
        const resetName = () => {
            if(state.inputVal < 5 || state.inputVal > 24) {
                state.earn = true
                return
            }else {
                state.earn = false
                // 此处修改用户名仅更新本地数据，刷新后消失
                useMutation.RETSET_NAME[0](state.inputVal)
                router.go(-1)
            }
        }
        return {
            ...toRefs(state),
            resetName
        }
    }
}
</script>

<style scoped>

</style>