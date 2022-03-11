<template>
    <div>
        <head-top head-title="登录" :go-back="true"></head-top>
        <section class="mt-10 bg-white">
            <!-- 账号密码验证码 -->
            <input type="text" placeholder="账号" v-model.lazy="userAccount" class="w-full p-2 border-b text-xxs">
            <div class="relative">
                <input :type="showPwd ? 'text' : 'password'" placeholder="密码" v-model.lazy="passWord" class="w-full p-2 border-b text-xxs">
                <div class="absolute top-1 right-2" @click="showPwd = !showPwd">
                    <van-icon v-if="showPwd" name="eye-o" />
                    <van-icon v-else name="closed-eye" />
                </div>
                <div class="flex justify-between">
                    <input type="text" placeholder="验证码" maxlength="4" v-model.lazy="codeNumber" class="p-2 border-b w-20 text-xxs">
                    <div class="flex items-center">
                        <img v-show="captchaCodeImg" :src="captchaCodeImg">
                        <div class="flex flex-col text-3xs mx-2">
                            <span class="text-gray-500">看不清</span>
                            <span class="text-blue-400" @click="getCaptchaCode">换一张</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <p class="text-3xs ml-2 my-2 text-red-500">温馨提示：未注册过的账号，登录时将自动注册</p>
        <p class="text-3xs ml-2 my-2 text-red-500">注册过的用户可凭账号密码登录</p>
        <div class="px-2">
            <button class="w-full h-8 bg-green-400 rounded text-white" @click="handleLogin">登录</button>
        </div>
        <div class="w-full text-right mt-2 text-blue-400 text-xxs">忘记密码？</div>
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
import { reactive, toRefs, onMounted } from 'vue'
import { getCaptchas, accountLogin } from '@/api/login/login'
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
        const router = useRouter()
        const state = reactive({
            showPwd: false,
            captchaCodeImg: null,   // 验证码
            showAlert: false,   // 是否显示提示框
            alertText: null,    // 提示文本
            userAccount: null,  //  用户名
            passWord: null, // 密码
            codeNumber: null,   // 验证码
            userInfo: null, // 用户信息
        })
        onMounted(() => {
            getCaptchaCode()
        })
        const getCaptchaCode = async() => {
            let res = await getCaptchas()
            state.captchaCodeImg = res.data.code
        }
        const handleLogin = async() => {
            if(state.userAccount && state.passWord && state.codeNumber) {
                let userInfo = await accountLogin(state.userAccount, state.passWord, state.codeNumber)
                state.userInfo = userInfo.data
                if(!state.userInfo.user_id) {
                    state.showAlert = true
                    state.alertText = state.userInfo.message
                    getCaptchaCode()
                }else{
                    useMutation.RECORD_USERINFO[0](state.userInfo)
                    router.go(-1)
                }
            }
            else if(!state.userAccount) {
                state.showAlert = true
                state.alertText = '请输入用户名'  
            }
            else if(!state.passWord) {
                state.showAlert = true
                state.alertText = '请输入密码'  
            }
            else if(!state.codeNumber) {
                state.showAlert = true
                state.alertText = '请输入验证码'
            }
        }
        return {
            ...toRefs(state),
            getCaptchaCode,
            handleLogin
        }
    }
}
</script>

<style scoped>
</style>