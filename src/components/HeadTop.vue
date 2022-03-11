<template>
    <header id="head_top" class="fixed left-0 top-0 w-screen h-8 z-50 bg-blue-400">
        <!-- 设置具名插槽，便于组件复用 -->
        <!-- 居中标题 -->
        <section class="absolute top-1/2 left-1/2 w-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
            <span>{{headTitle}}</span>
        </section>
        <!-- 回退按钮 -->
        <section v-if="goBack" @click="$router.go(-1)" class="absolute top-1/2 left-2 transform -translate-y-1/2">
            <svg class="w-4 h-4 fill-current text-white" xmlns="http://www.w3.org/2000/svg" version="1.1">
                <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:2"/>
            </svg>
        </section>
        <slot name="logo"></slot>
        <slot name="search"></slot>
        <slot name="edit"></slot>
        <slot name="msiteTitle"></slot>
        <slot name="changeCity"></slot>
        <slot name="changeLogin"></slot>
        <!-- svg图标 -->
        <a id="head_login" v-if="signinUp" class="absolute top-1/2 right-2 transform -translate-y-1/2">
        <router-link to="/profile">
            <svg v-if="userInfo" id="user_avatar" class="w-4 h-4 fill-current text-white">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#user"></use>
            </svg>
            <span class="text-1xs text-white" v-else>登录/注册</span>
        </router-link>
        </a>
    </header>
</template>

<script>
import { onMounted,reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
export default {
    name: 'HomeTop',
    props: {
        headTitle: {
            type: String
        },
        signinUp: {
            type: String
        },
        goBack: {
            type: Boolean,
            default: false
        }
    },
    setup() {
        const store = useStore()
        const useAction = store._actions
        const state = reactive({
            userInfo: null
        })
        watch(() => store.state.userInfo, (val) => {
            if(val) {
                state.userInfo = val
            }
        })
        onMounted(() => {
            // 获取用户登录信息
            useAction.getUserInfo[0]()
        })
        return {
            ...toRefs(state)
        }
    }
}
</script>