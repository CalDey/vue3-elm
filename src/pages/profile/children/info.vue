<template>
    <div class="absolute top-0 right-0 bottom-0 right-0 w-full bg-gray-200">
        <head-top head-title="个人中心" :go-back='true'></head-top>
        <section class="mt-10 bg-white">
            <!-- 头像 -->
            <div class="flex justify-between items-center p-2 text-1xs">
                <input type="file" class="absolute w-full opacity-0 upload-file" @change="uploadAvatar">
                <span>头像</span>
                <div class="flex items-center text-gray-500">
                    <van-image v-if="avatar" width="2.5rem" height="2.5rem" round :src="imgBaseUrl + avatar"></van-image>
                    <van-icon class="ml-2" name="arrow" />
                </div>
            </div>
            <!-- 用户名 -->
            <router-link to="/profile/info/setusername" class="flex justify-between items-center p-2 text-1xs">
                <span>用户名</span>
                <div class="flex items-center text-gray-500">
                    <span>{{username}}</span>
                    <van-icon class="ml-2" name="arrow" />
                </div>
            </router-link>
            <!-- 收货地址 -->
            <router-link to="/profile/info/address" class="flex justify-between items-center p-2 text-1xs">
                <span>收货地址</span>
                <div class="flex items-center text-gray-500">
                    <van-icon class="ml-2" name="arrow" />
                </div>
            </router-link>
        </section>
        <!-- 账号绑定 -->
        <span class="text-xxs p-2">账号绑定</span>
        <div class="flex justify-between items-center bg-white p-2 text-1xs">
            <div class="flex">
                <img src="@/assets/image/bindphone.png">
                <span class="ml-2">手机</span>
            </div>
            <div class="text-gray-500">
                <van-icon class="ml-2" name="arrow" />
            </div>
        </div>
        <!-- 安全设置 -->
        <span class="text-xxs p-2">安全设置</span>
        <router-link to="/forget" class="flex justify-between items-center bg-white p-2 text-1xs">
            <span>登录密码</span>
            <div class="flex items-center text-gray-500">
                <span>修改</span>
                <van-icon class="ml-2" name="arrow" />
            </div>
        </router-link>
        <!-- 退出登录按钮 -->
        <div class="mx-1 my-4">
            <button class="w-full bg-red-400 text-white text-center text-1xs p-2 rounded" @click="exitLogin">退出登录</button>
        </div>
        <van-dialog v-model:show="showLogOut">
            <template #default>
                <div class="flex flex-col items-center">
                    <van-icon size="82" class="m-2 text-yellow-400" name="warning-o" />
                    <span class="mb-2">是否退出登录</span>
                </div>
            </template>
            <template #footer>
                <div class="flex justify-around">
                    <div class="bg-gray-400 flex-1 m-2 rounded">
                        <button class="w-full h-6 text-white rounded" @click="showLogOut=false">再等等</button>
                    </div>
                    <div class="bg-red-400 flex-1 m-2 rounded">
                        <button class="w-full h-6 text-white" @click="logOut">退出登录</button>
                    </div>
                </div>
            </template>
        </van-dialog>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import axios from '@/utils/axios'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { imgBaseUrl } from '@/config/env'
import { removeStore } from '@/config/utils'
import { signout } from '@/api/login/login'
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
            userInfo: null,
            username: null,
            infotel: null,
            avatar: null,
            showLogOut: false,
            imgBaseUrl
        })
        watch(() => store.state.userInfo, (val) => {
            if(val && val.user_id) {
                state.username = val.username
                state.infotel = val.mobile
                state.avatar = val.avatar
            }
        })
        const exitLogin = () => {
            state.showLogOut = true
        }
        const logOut = () => {
            useMutation.OUT_LOGIN[0]()
            router.go(-1)
            removeStore('user_id')
            signout()
        }
        const uploadAvatar = async() => {   // 上传头像
            if(store.state.userInfo) {
                let input = document.querySelector('.upload-file')
                let data = new FormData()
                data.append('file', input.files[0])
                console.log(data.get('file'))
                try{
                    let response = await axios({
                        url: '/eus/v1/users/' + store.state.userInfo.user_id + '/avatar',
                        method: 'POST',
                        headers: { 'content-type': 'application/x-www-form-urlencoded' },
                        data
                    })
                    let res = response.data
                    if(res.status == 1) {
                        store.state.userInfo.avatar = res.image_path
                        state.avatar = res.image_path
                    }
                }catch(err){
                    state.showAlert = true
                    state.alertText = '上传失败'
                    throw new Error(err)
                }
            }
        }
        return {
            ...toRefs(state),
            exitLogin,
            logOut,
            uploadAvatar
        }
    },
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