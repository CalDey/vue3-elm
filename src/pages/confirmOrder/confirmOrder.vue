<template>
    <div class="mt-8 mb-12">
        <head-top head-title="确认订单" :go-back="true" signin-up='confirmOrder'></head-top>
        <section v-if="chooseAddress" class="address_contsiner">
            <router-link :to='{path: "/confirmOrder/chooseAddress", query: {id: orderData.cart.id, sig: orderData.sig}}' class="h-full flex items-center">
                <div class="ml-2 flex flex-1 items-center">
                    <van-icon name="location-o" />
                    <div>
                        <div class="ml-2">
                            <span class="text-1xs font-bold">{{chooseAddress.name}}</span>
                            <span class="text-xxs ml-1">{{chooseAddress.sex == 1? '先生':'女士'}}</span>
                            <span class="text-xxs ml-1">{{chooseAddress.phone}}</span>
                        </div>
                        <div class="ml-2">
                            <span v-if="chooseAddress.tag" class="text-xxs bg_tag text-white px-1 mr-2 rounded" :style="{backgroundColor: iconColor(chooseAddress.tag)}">{{chooseAddress.tag}}</span>
                            <span class="text-xxs text-gray-400">{{chooseAddress.address_detail}}</span>
                        </div>
                    </div>
                </div>
                <van-icon class="mr-1 text-gray-400" name="arrow" />
            </router-link>
        </section>
        <div class="flex justify-between mt-2 px-4 bg-white border-l-4 border-blue-400 py-4 text-1xs">
            <span class="font-bold">送达时间</span>
            <div v-if="orderData" class="flex flex-col items-end">
                <span class="mb-2 text-blue-400">尽快送达 ｜ 预计 {{orderData.delivery_reach_time}}</span>
                <span class="w-12 bg-blue-400 text-white rounded-sm text-center text-xxs" v-if="orderData.cart.is_deliver_by_fengniao">蜂鸟专送</span>
            </div>
        </div>
        <div class="mt-2 bg-white text-1xs px-2 divide-y">
            <div class="flex justify-between py-2">
                <span>支付方式</span>
                <div class="text-gray-400">
                    <span>在线支付</span>
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="flex justify-between text-gray-400 py-2">
                <span>红包</span>
                <span>暂时只支持在饿了么APP中使用</span>
            </div>
        </div>
        <div v-if="orderData" class="mt-2 bg-white px-2 divide-y">
            <div v-if="orderData.cart.restaurant_info" class="flex items-center py-2">
                <van-image width="1.2rem" height="1.2rem" :src="imgBaseUrl + orderData.cart.restaurant_info.image_path"></van-image>
                <span class="text-1xs ml-2">{{orderData.cart.restaurant_info.name}}</span>
            </div>
            <ul>
                <li v-for="item in orderData.cart.groups[0]" :key="item.id" class="text-1xs flex justify-between py-1">
                    <span class="text-gray-500">{{item.name}}</span>
                    <div class="flex justify-between w-20">
                        <span v-if="item.quantity > 0" class="text-orange-500">x {{item.quantity}}</span>
                        <span v-else></span>
                        <span class="text-gray-500">¥{{item.price}}</span>
                    </div>
                </li>
                <div class="text-1xs flex justify-between py-1 text-gray-500">
                    <span>配送费</span>
                    <div>
                        <span></span>
                        <span>¥ {{orderData.cart.deliver_amount || 0}}</span>
                    </div>
                </div>
            </ul>
            <div class="flex justify-between text-1xs py-1 text-gray-500">
                <span>订单¥{{orderData.cart.total}}</span>
                <span class="text-orange-400">待支付 ¥{{orderData.cart.total}}</span>
            </div>
        </div>
        <div v-if="orderData" class="mt-2 bg-white px-2 text-gray-400 text-1xs divide-y">
            <router-link :to='{path: "/confirmOrder/remark", query: {id: orderData.cart.id, sig: orderData.sig}}' class="flex justify-between py-2">
                <span class="text-gray-500">订单备注</span>
                <div class="flex-1 flex justify-between items-center text-right ml-6">
                    <span class="inline-block w-40 truncate ...">{{remarkList.length > 0 ? remarkList : '口味、偏好等'}}</span>
                    <van-icon name="arrow" />
                </div>
            </router-link>
            <div class="flex justify-between py-2">
                <span class="text-gray-500">发票抬头</span>
                <div>
                    <span>不需要开发票</span>
                    <van-icon name="arrow" />
                </div>
            </div>
        </div>
        <div v-if="orderData" class="fixed flex justify-between items-center bottom-0 w-full h-8 bg-gray-800 text-white text-1xs">
            <span class="ml-2">待支付 ¥{{orderData.cart.total}}</span>
            <span class="flex items-center bg-green-400 h-full px-4" @click="confirmOrder">确认下单</span>
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
import { reactive, toRefs, onMounted, computed, watch} from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { checkout, placeOrders } from '@/api/order/order'
import { imgBaseUrl } from '@/config/env'
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
            geohash: '',
            shopId: null,
            shopCart: null, // 当前订单购物车信息
            orderData: null,    // 订单信息
            chooseAddress: null,
            imgBaseUrl,
            showAlert: false,   // 提示框显隐
            alertText: null // 提示文本
        })
        // 获取路由传递参数
        state.geohash = route.query.geohash
        state.shopId = route.query.shopId
        // 初始化购物车
        useMutation.INIT_BUYCART[0]()
        // 保存shopId
        useMutation.SAVE_SHOPID[0](state.shopId)
        // 获取当前店铺id对应的购物车信息
        state.shopCart = store.state.cartList[state.shopId]
        const remarkList = computed(() => {  // 获取备注页返回信息
            let str = ''
            if(store.state.remarkText) {
                Object.values(store.state.remarkText).forEach(item => {
                    str += item[1] + '，'
                })
            }
            // 是否填写自定义备注
            if(store.state.inputVal) {
                return str + store.state.inputVal
            }else{
                // 去除最后一个逗号
                return str.substr(0, str.lastIndexOf('，')) ;
            }
        })
        watch(() => [store.state.userInfo, store.state.chooseAddress], (val1, val2) => {
            if(val1 && val1.user_id) {
                initAddress()
            }
            state.chooseAddress = store.state.chooseAddress
        })
        onMounted(() => {
            if(state.geohash) {
                initData()
            }
        })
        const initData = async() => {
            let arr = new Array
            Object.values(state.shopCart).forEach(CategoryItem => {
                Object.values(CategoryItem).forEach(itemVal => {
                    Object.values(itemVal).forEach(item => {
                        // console.log(item)
                        arr.push({
                            attrs: [],
                            extra: {},
                            id: item.id,
                            name: item.name,
                            packing_fee: item.packing_fee,
                            price: item.price,
                            quantity: item.num,
                            sku_id: item.sku_id,
                            specs: [item.specs],
                            stock: item.stock,
                        })
                    })
                })
            })
            // 检验订单是否符合条件 生成订单
            const checkoutData = await checkout(state.geohash, [arr], state.shopId)
            state.orderData = checkoutData.data
            useMutation.SAVE_CART_ID_SIG[0]({cart_id: state.orderData.cart.id, sig: state.orderData.sig})
            initAddress()
        }
        const initAddress = async() => {
            if(store.state.userInfo && store.state.userInfo.user_id) {
                const addressRes = await getAddressList(store.state.userInfo.user_id)
                if(addressRes.data instanceof Array && addressRes.data.length) {
                    // 获取当前默认地址
                    useMutation.CHOOSE_ADDRESS[0]({address: addressRes.data[0], index: 0})
                }
            }
        }
        const confirmOrder = async() => {    // 订单确认
            // 用户未登录弹出提示框
            if(!(store.state.userInfo && store.state.userInfo.user_id)) {
                state.showAlert = true
                state.alertText = '请登录'
                return
            }else if(!store.state.chooseAddress) {
                // 未设置地址时弹出提示
                state.showAlert = true
                state.alertText = '请添加一个收货地址'
                return
            }
            // 保存当前订单至vuex
            useMutation.SAVE_ORDER_PARAM[0]({
                user_id: store.state.userInfo.user_id,
                cart_id: state.orderData.cart.id,
                address_id: state.chooseAddress.id,
                description: remarkList.value,
                entities: state.orderData.cart.groups,
                geohash: state.geohash,
                sig: state.orderData.sig,
            })
            let orderRes = await placeOrders(store.state.userInfo.user_id, state.orderData.cart.id, state.chooseAddress.id, remarkList.value, state.orderData.cart.groups, state.geohash, state.orderData.sig)
            useMutation.ORDER_SUCCESS[0](orderRes.data)
            router.push('/confirmOrder/payment')
        }
        const iconColor = (name) => {
            switch(name) {
                case '公司': return '#4cd964';
                case '学校': return '#3190e8';
            }
        }
        return {
            ...toRefs(state),
            remarkList,
            initData,
            iconColor,
            confirmOrder
        }
    }
}
</script>

<style scoped>
.address_contsiner {
    height: 3.5rem;
    background: url(@/assets/image/address_bottom.png) left bottom repeat-x;
    background-color: #fff;
    background-size: auto .12rem;
}
.bg_tag {
    background-color: #ff5722;
}
.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
}
.router-slid-enter-from, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
}
</style>