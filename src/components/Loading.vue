<template>
    <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10">
        <div class="load_img" :style="{backgroundPositionY: -(positionY%7)*2.5 + 'rem'}"></div>
    </div>
</template>

<script>
import { toRefs, reactive, onMounted, onBeforeUnmount } from 'vue'
export default {
    setup() {
        const state = reactive({
            positionY: 0,
            timer: null
        })
        onMounted(() => {
            state.timer = setInterval(() => {
                state.positionY++
            }, 600)
        })
        onBeforeUnmount(() => {
            clearInterval(state.timer)
        })
        return {
            ...toRefs(state)
        }
    }
}
</script>

<style>
	@keyframes load{
		0%   {transform: translateY(0px);}
		50%  {transform: translateY(-50px);}
		100% {transform: translateY(0px);}
	}
    .load_img{
        position: relative;
    	width: 100%;
        height: 100%;
    	background: url('@/assets/image/icon_loading.png') no-repeat 0 0;
    	background-size: 2.5rem auto;
    	transform: translateY(0px);
    	animation: load .6s infinite ease-in-out;
    	z-index: 11;
    }
</style>