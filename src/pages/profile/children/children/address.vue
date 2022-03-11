<template>
    <div class="absolute top-0 right-0 bottom-0 right-0 w-full bg-gray-200 z-50">
        <head-top head-title="编辑地址" :go-back='true'>
            <template #edit>
                <span class="absolute right-2 top-1/2 -translate-y-1/2 text-1xs text-white" @click="handleEdit">
                    {{editText}}
                </span>
            </template>
        </head-top>
        <section class="mt-10 bg-white">
            <ul v-if="addressList">
                <li v-for="(item, index) in addressList" :key="index" class="border-b"
                :class="current == index ? 'bg-yellow-100' : ''"
                @click="changeAddress(index)">
                    <div class="flex justify-between items-center px-2">
                        <div class="flex flex-col">
                            <span class="text-1xs my-1">{{item.address}}</span>
                            <span class="text-xxs mb-1">{{item.phone}}</span>
                        </div>
                        <van-icon v-if="showDelete" class="text-gray-400" name="cross" @click="delAddress(item, index)" />
                    </div>
                </li>
            </ul>
        </section>
        <router-link to="/profile/info/address/add" class="flex justify-between items-center bg-white text-1xs mt-2 px-2 py-1">
            <span>新增地址</span>
            <van-icon class="text-gray-500" name="arrow" />
        </router-link>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import { reactive, toRefs, onMounted, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { deleteAddress } from '@/api/address/address'
import HeadTop from '@/components/HeadTop'
export default {
    components: {
        HeadTop
    },
    setup() {
        const store = useStore()
        const useAction = store._actions
        // 监听地址列表变化 防止刷新后vuex丢失数据
        const addressList = computed(() => {
            return store.state.addressList
        })
        const state = reactive({
            current: 0, // 当前选中地址索引
            editText: '编辑',
            showDelete: false
        })
        watch(() => store.state.userInfo, (val) => {
            if(val && val.user_id) {
                initData()
            }
        })
        onMounted(() => {
            initData()
        })
        const initData = () => {
            if(store.state.userInfo && store.state.userInfo.user_id) {
                useAction.getAddress[0]()
                // console.log(store.state)
            }
        }
        const changeAddress = (index) => {
            state.current = index
        }
        const handleEdit = () => {
            if(state.editText === '编辑') {
                state.editText = '完成'
                state.showDelete = true
            }else{
                state.editText = '编辑'
                state.showDelete = false
            }
        }
        const delAddress = async(item, index) => {
            if(store.state.userInfo && store.state.userInfo.user_id) {
                await deleteAddress(store.state.userInfo.user_id, item.id)
                addressList.value.splice(index, 1)
            }
        }
        return {
            ...toRefs(state),
            addressList,
            changeAddress,
            handleEdit,
            delAddress
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