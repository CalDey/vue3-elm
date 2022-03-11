<template>
    <div class="fixed top-0 right-0 bottom-0 right-0 bg-gray-200 w-full z-50">
        <head-top head-title="订单备注" :go-back="true"></head-top>
        <section class="bg-white mt-8 text-1xs pl-2">
            <header class="py-1">快速备注</header>
            <ul v-if="remarkList" class="py-1 flex flex-wrap">
                <li v-for="(item, index) in remarkList.remarks" :key="index" class="py-2 mr-4">
                    <span v-for="(remarkItem, remarkIndex) in item" :key="remarkIndex"
                    :class="[remarkIndex == 0 ? 'rounded-l' : '', remarkIndex == item.length-1 ? 'rounded-r' : '', remarkText[index] && remarkText[index][0] == remarkIndex ? 'bg-blue-400 text-white' : '']"
                    class="p-1 border border-blue-400"
                    @click="chooseRemark(index, remarkItem, remarkIndex)"
                    >{{remarkItem}}</span>
                </li>
            </ul>
        </section>
        <section class="mt-2 bg-white text-1xs pl-2">
            <header class="py-1">其他备注</header>
            <div class="mr-2 pb-4">
                <textarea class="bg-gray-100 w-full p-2" rows="5" placeholder="请输入备注内容(选填最多50字)" maxlength="50" v-model="inputVal"></textarea>
            </div>
        </section>
        <div class="mx-2">
            <button class="bg-green-400 mt-2 w-full p-1 rounded text-white" @click="confirmRemark">确认</button>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { getRemark } from '@/api/order/order'
import HeadTop from '@/components/HeadTop'
export default {
    components: {
        HeadTop
    },
    setup() {
        const store = useStore()
        const useMutation = store._mutations
        const route = useRoute()
        const router = useRouter()
        const state = reactive({
            id: null,
            sig: null,
            remarkList: null,   // 备注列表
            remarkText: {},   // 备注数据
            inputVal: null,  // 备注数据（自定义）
            isSelected: false,
        })
        state.id = route.query.id
        state.sig = route.query.sig
        onMounted(() => {
            initData()
        })
        const initData = async() => {
            const remarkList = await getRemark(state.id, state.sig)
            state.remarkList = remarkList.data
        }
        const chooseRemark = (index, remarkItem, remarkIndex) => {
            // 生成备注列表,二次点击移除备注
            if(state.remarkText[index] && state.remarkText[index][0] == remarkIndex) {
                state.isSelected = true
                delete state.remarkText[index]
                // console.log(state.remarkText[index])
            }else{
                state.remarkText[index] = [remarkIndex, remarkItem]
                state.remarkText = Object.assign({}, state.remarkText)
            }
        }
        const confirmRemark = () => {
            useMutation.CONFIRM_REMARK[0]({remarkText: state.remarkText, inputText: state.inputVal})
            router.go(-1)
        }
        return {
            ...toRefs(state),
            initData,
            chooseRemark,
            confirmRemark
        }
    }
}
</script>

<style scoped>

</style>