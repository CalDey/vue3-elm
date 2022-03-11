<template>
    <div>
        <head-top head-title="重置密码" :go-back='true'></head-top>
        <section class="mt-10 bg-white text-1xs divide-y">
            <div>
                <input type="text" placeholder="账号" class="m-2" v-model.lazy="name">
            </div>
            <div>
                <input type="password" placeholder="旧密码" class="m-2" v-model.lazy="oldPwd">
            </div>
            <div>
                <input type="password" placeholder="请输入新密码" class="m-2" v-model.lazy="newPwd">
            </div>
            <div>
                <input type="password" placeholder="请确认密码" class="m-2" v-model.lazy="confirmPwd">
            </div>
            <div class="flex justify-between">
                <input type="text" placeholder="验证码" maxlength="4" class="m-2 w-20" v-model.lazy="codeNumber">
                <div class="flex items-center">
                    <img v-show="captchaCodeImg" :src="captchaCodeImg">
                    <div class="flex flex-col text-3xs mx-2">
                        <span class="text-gray-500">看不清</span>
                        <span class="text-blue-400" @click="getCaptchaCode">换一张</span>
                    </div>
                </div>
            </div>
        </section>
        <div class="mx-2 my-4">
            <button class="w-full bg-green-400 p-2 rounded text-white text-1xs" @click="handleChangePwd">确认修改</button>
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
                    <button class="w-full h-6 text-white" @click="close">确认</button>
                </div>
            </template>
        </van-dialog>
    </div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import { getCaptchas, changePassword } from '@/api/login/login'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import HeadTop from '@/components/HeadTop'
export default {
    components: {
        HeadTop
    },
    setup() {
        const store = useStore()
        const router = useRouter()
        const state = reactive({
            name: null,
            oldPwd: null,
            newPwd: null,
            confirmPwd: null,
            captchaCodeImg: null,
            codeNumber: null,
            showAlert: false,
            alertText: null,
        })
        onMounted(() => {
            getCaptchaCode()
        })
        const getCaptchaCode = async() => {
            let res = await getCaptchas()
            state.captchaCodeImg = res.data.code
        }
        const handleChangePwd = async() => {
            if(!state.name) {
                state.showAlert = true
                state.alertText = '请输入正确的账号'
                return
            }
            else if(!state.oldPwd) {
                state.showAlert = true
                state.alertText = '请输入旧密码'
                return
            }
            else if(!state.newPwd) {
                state.showAlert = true
                state.alertText = '请输入新密码'
                return
            }
            else if(!state.confirmPwd) {
                state.showAlert = true
                state.alertText = '请输入确认密码'
                return
            }
            else if(state.newPwd !== state.confirmPwd) {
                state.showAlert = true
                state.alertText = '两次输入密码不一致'
                return
            }
            else if(!state.codeNumber) {
                state.showAlert = true
                state.alertText = '请输入验证码'
                return
            }
            let res = await changePassword(state.name, state.oldPwd, state.newPwd, state.confirmPwd, state.codeNumber)
            if(res.data.message) {
                state.showAlert = true
                state.alertText = res.data.message
                getCaptchaCode()
                return
            }else{
                state.showAlert = true
                state.alertText = '密码修改成功'
            }
        }
        const close = () => {
            state.showAlert = false
            router.go(-1)
        }
        return {
            ...toRefs(state),
            getCaptchaCode,
            handleChangePwd,
            close
        }
    }
}
</script>

<style scoped>

</style>