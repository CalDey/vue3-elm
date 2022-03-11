<template>
    <div class="fixed top-0 right-0 bottom-0 right-0 w-full z-50 bg-white">
        <head-top head-title="选择地址" :go-back="true"></head-top>
        <section class="mt-8">
            <ul>
                <li v-for="(item, index) in deliverable" :key="index" class="flex items-center ml-2 py-2 border-b" @click="chooseAddress(item, index)">
                    <svg width="1rem" height="1rem" style="fill: #4cd964;" :class="chooseIndex === index ? '' : 'invisible'">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
                    </svg>
                    <section>
                        <div class="ml-2">
                            <span class="text-1xs font-bold">{{item.name}}</span>
                            <span class="text-xxs ml-1">{{item.sex == 1? '先生' : '女士'}}</span>
                            <span class="text-xxs ml-1">{{item.phone}}</span>
                        </div>
                        <div class="ml-2">
                            <span v-if="item.tag" class="text-xxs bg_tag text-white px-1 mr-2 rounded" :style="{backgroundColor: iconColor(item.tag)}">{{item.tag}}</span>
                            <span class="text-xxs text-gray-400">{{item.address_detail}}</span>
                        </div>
                    </section>
                </li>
            </ul>
        </section>
        <!-- <div class="fixed bottom-0 w-full h-10 leading-10 text-blue-400 text-1xs">
            <div class="flex justify-center items-center">
                <van-icon size="28" name="add-o" />
                <span>&nbsp;新增收货地址</span>
            </div>
        </div> -->
    </div>
</template>

<script>
import { reactive, toRefs, watch, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { getAddressList } from '@/api/address/address'
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
            addressList: [],    // 地址列表
            deliverable: [],    // 有效送货地址
            deliverdisable: [], // 无效送货地址
            id: null,
            sig: null,
            showAlert: false,
            alertText: null,
        })
        const chooseIndex = computed(() => {
            if(store.state.addressIndex) {
                return store.state.addressIndex
            }else{
                return 0
            }
        })
        watch(() => store.state.userInfo, (val) => {
            if(val && val.user_id) {
                initData()
            }
        })
        state.id = route.query.id
        state.sig = route.query.sig
        onMounted(() => {
            initData()
        })
        const initData = async() => {
            state.addressList = []
            if(store.state.userInfo && store.state.userInfo.user_id) {
                const addressList = await getAddressList(store.state.userInfo.user_id)
                state.addressList = addressList.data
                state.deliverable = []
                state.deliverdisable = []
                // 将地址列表分为有效地址和无效地址
                state.addressList.forEach(item => {
                    if (item.is_deliverable) {
                        state.deliverable.push(item);
                    }else{
                        state.deliverdisable.push(item);
                    }
                })
            }
        }
        const chooseAddress = (address, index) => {
            useMutation.CHOOSE_ADDRESS[0]({address, index})
            router.go(-1)
        }
        const iconColor = (name) => {
            switch(name) {
                case '公司': return '#4cd964';
                case '学校': return '#3190e8';
            }
        }
        return {
            ...toRefs(state),
            chooseIndex,
            iconColor,
            chooseAddress
        }
    }
}
</script>

<style scoped>
.bg_tag {
    background-color: #ff5722;
}
</style>