<template>
    <div class="absolute top-0 right-0 bottom-0 right-0 w-full bg-gray-200 z-50">
        <head-top head-title="新增地址" :go-back='true'></head-top>
        <section class="bg-white mt-10">
            <!-- 姓名 -->
            <div class="px-2 pt-2 text-xxs">
                <input type="text" placeholder="请填写你的姓名" class="w-full p-1 bg-gray-200 border border-gray-300" v-model="name">
            </div>
            <!-- 地区 -->
            <div class="px-2 pt-2 text-xxs">
                <router-link to="/profile/info/address/add/addDetail">
                    <input type="text" placeholder="小区/写字楼/街道等" readonly class="w-full p-1 bg-gray-200 border border-gray-300" v-model="area">
                </router-link>
            </div>
            <!-- 详细地址 -->
            <div class="px-2 pt-2 text-xxs">
                <input type="text" placeholder="请填写详细订餐地址" class="w-full p-1 bg-gray-200 border border-gray-300" v-model="address" @input="handleWarn('address')">
                <span v-if="warn" class="text-red-400">{{addressWarnText}}</span>
            </div>
            <!-- 联系方式 -->
            <div class="px-2 pt-2 text-xxs">
                <input type="text" placeholder="请填写能够联系到您的联系方式" class="w-full p-1 bg-gray-200 border border-gray-300" v-model="phone" @input="handleWarn('phone')">
                <span v-if="warn" class="text-red-400">{{phoneWarnText}}</span>
            </div>
            <!-- 备用联系方式 -->
            <div class="px-2 pt-2 pb-2 text-xxs">
                <input type="text" placeholder="备用联系方式" class="w-full p-1 bg-gray-200 border border-gray-300" v-model="backup_phone">
            </div>
        </section>
        <div class="text-center mt-4 px-2">
            <button class="w-full rounded text-1xs text-white p-2" :class="btnStatus ? 'bg-green-400' : 'bg-gray-400'" @click.prevent="addAddress">新增地址</button>
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
                    <button class="w-full h-6 text-white" @click="showAlert=false">确认</button>
                </div>
            </template>
        </van-dialog>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { addNewAddress } from '@/api/address/address'
import HeadTop from '@/components/HeadTop'
export default {
    components: {
        HeadTop
    },
    setup() {
        const store = useStore()
        const router = useRouter()
        const useMutation = store._mutations
        const btnStatus = computed(() => {
            if(state.name && area && state.address && state.phone) {
                return true
            }else{
                return false
            }
        })
        const area = computed(() => {
            return store.state.addAddress
        })
        const state = reactive({
            name: '',   // 姓名
            // area: '',   // 地区
            address: '',    // 地址
            phone: '',  // 联系方式
            backup_phone: '',    // 备用联系方式
            warn: false,
            addressWarnText: '',
            phoneWarnText: '',
            showAlert: false,
            alertText: ''
        })
        const handleWarn = (type) => {
            if(type == 'address') {
                if(state.address.length == 0) {
                    state.warn = true
                    state.addressWarnText = '请填写详细送餐地址'
                }
                else if(state.address.length > 0 && state.address.length <= 2) {
                    state.warn = true
                    state.addressWarnText = '送餐地址太短无法识别'
                }
                else{
                    state.warn = false
                    state.addressWarnText = ''
                }
            }
            else if(type == 'phone') {
                if((/^[1][358][0-9]{9}$/).test(state.phone)) {
                    state.warn = false
                }else if(state.phone == '') {
                    state.warn = true
                    state.phoneWarnText = '手机号不能为空'
                }else{
                    state.warn = true
                    state.phoneWarnText = '请输入正确的手机号'
                }
            }
        }
        const addAddress = async() => {
            if(btnStatus) {
                let res = await addNewAddress(store.state.userInfo.user_id, store.state.addAddress, state.address, store.state.geohash, state.name, state.phone, state.backup_phone, 0, 1, '公司', 4)
                if(res.data.message) {
                    state.showAlert = true
                    state.alertText = res.data.message
                }else{
                    useMutation.ADD_ADDRESS[0]({
                        name: state.name,
                        address: store.state.addAddress,
                        address_detail: state.address,
                        geohash: 'wtw37r7cxep4',
                        phone: state.phone,
                        phone_bk: state.backup_phone,
                        poi: state.address,
                        poi_type: 0
                    })
                    router.go(-1)
                }
            }else{
                return
            }
        }
        return {
            ...toRefs(state),
            btnStatus,
            area,
            handleWarn,
            addAddress
        }
    }
}
</script>

<style scoped>

</style>