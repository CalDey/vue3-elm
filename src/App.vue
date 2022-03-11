<template>
  <div>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
        </keep-alive>
        <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
      </router-view>
    <!-- 引入SVG图标组件 -->
    <svg-icon></svg-icon>
  </div>
</template>

<script>
  import svgIcon from './components/svgIcon.vue'
  export default {
    components: {
      svgIcon
    }
  }
</script>

<style scoped>
</style>