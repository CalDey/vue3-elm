<template>
    <div>
        <head-top :go-back="true" :head-title="profiletitle"></head-top>
        <!-- 用户头像手机 -->
        <section class="flex bg-blue-400 mt-8 p-2">
            <div v-if="userInfo&&userInfo.user_id">
                <van-image width="2.5rem" height="2.5rem" round :src="imgBaseUrl + userInfo.avatar" />
            </div>
            <div v-else>
                <svg width="2.5rem" height="2.5rem" class="bg-white rounded-full">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#avatar-default"></use>
                </svg>
            </div>
            <router-link :to="userInfo&&userInfo.user_id ? '/profile/info' : '/login'" class="flex-1 flex justify-between items-center ml-2 text-white">
                <div class="flex flex-col justify-center">
                    <span>{{username}}</span>
                    <span class="flex items-center text-xxs">
                        <svg width=".8rem" height=".8rem" class="icon-mobile" fill="#fff">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mobile"></use>
                        </svg>
                        <span>{{mobile}}</span>
                    </span>
                </div>
                <div>
                    <van-icon name="arrow" />
                </div>
            </router-link>
        </section>
        <!-- 余额优惠积分 -->
        <div class="flex bg-white divide-x mb-2">
            <!-- 余额 -->
            <div class="flex flex-1 flex-col items-center my-2">
                <span>
                    <span class="text-orange-400">{{parseInt(balance).toFixed(2)}}</span>
                    <span class="text-xxs">元</span>
                </span>
                <span class="text-xxs text-gray-500">我的余额</span>
            </div>
            <!-- 优惠 -->
            <div class="flex flex-1 flex-col items-center my-2">
                <span>
                    <span class="text-red-400">{{count}}</span>
                    <span class="text-xxs">个</span>
                </span>
                <span class="text-xxs text-gray-500">我的优惠</span>
            </div>
            <!-- 积分 -->
            <div class="flex flex-1 flex-col items-center my-2">
                <span>
                    <span class="text-green-400">{{pointNumber}}</span>
                    <span class="text-xxs">分</span>
                </span>
                <span class="text-xxs text-gray-500">我的积分</span>
            </div>
        </div>
        <!-- 功能栏1 -->
        <div class="bg-white mb-2 text-1xs">
            <!-- 我的订单 -->
            <router-link to="/order" class="flex justify-between items-center p-2 border-b">
                <div class="flex items-center">
                    <svg width="1rem" height="1rem" class="mr-1" fill="#4aa5f0">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#order"></use>
                    </svg>
                    <span>我的订单</span>
                </div>
                <van-icon name="arrow" />
            </router-link>
            <!-- 积分商城 -->
            <div class="flex justify-between items-center p-2 border-b">
                <div class="flex items-center">
                    <svg width="1rem" height="1rem" class="mr-1" fill="#fc7b53">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#point"></use>
                    </svg>
                    <span>积分商城</span>
                </div>
                <van-icon name="arrow" />
            </div>
            <!-- 饿了么会员卡 -->
            <div class="flex justify-between items-center p-2 border-b">
                <div class="flex items-center">
                    <svg width="1rem" height="1rem" class="mr-1" fill="#ffc636">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#vip"></use>
                    </svg>
                    <span>饿了么会员卡</span>
                </div>
                <van-icon name="arrow" />
            </div>
        </div>
        <!-- 功能栏2 -->
        <div class="bg-white text-1xs">
            <!-- 服务中心 -->
            <div class="flex justify-between items-center p-2 border-b">
                <div class="flex items-center">
                    <svg width="1rem" height="1rem" class="mr-1" fill="#4aa5f0">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#service"></use>
                    </svg>
                    <span>服务中心</span>
                </div>
                <van-icon name="arrow" />
            </div>
            <!-- 下载官方APP -->
            <div class="flex justify-between items-center p-2 border-b">
                <div class="flex items-center">
                    <svg width="1rem" height="1rem" class="mr-1" fill="#3cabff">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#download"></use>
                    </svg>
                    <span>下载饿了么APP</span>
                </div>
                <van-icon name="arrow" />
            </div>
        </div>
        <Footer class="mt-12"></Footer>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import { reactive, toRefs, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { imgBaseUrl } from '@/config/env'
import HeadTop from '@/components/HeadTop'
import Footer from '@/components/Footer'
export default {
    components: {
        HeadTop,
        Footer
    },
    setup() {
        const store = useStore()
        const state = reactive({
            profiletitle: '我的',
            userInfo: null,
            username: '登录/注册',
            mobile: '暂无绑定手机号',
            pointNumber : 0, // 积分数
            avatar: '', // 头像
            count : 0, // 优惠券个数
            balance: 0, // 我的余额
            imgBaseUrl
        })
        watch(() => store.state.userInfo, (val) => {
            // console.log(val)
            initData()
        })
        onMounted(() => {
            initData()
        })
        const initData = () => {
            state.userInfo = store.state.userInfo
            if(state.userInfo && state.userInfo.user_id) {
                state.avatar = state.userInfo.avatar;
                state.username = state.userInfo.username;
                state.mobile = state.userInfo.mobile || '暂无绑定手机号';
                state.balance = state.userInfo.balance;
                state.count = state.userInfo.gift_amount;
                state.pointNumber = state.userInfo.point;
            }else{
                state.username = '登录/注册'
                state.mobile = '暂无绑定手机号'
            }
        }
        return {
            ...toRefs(state),
            initData
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