<template>
    <div class="mt-8">
        <head-top :head-title="headTitle" :go-back="true"></head-top>
        <van-config-provider :theme-vars="themeVars">
            <!-- 下拉二级筛选菜单 -->
            <van-dropdown-menu class="fixed w-full z-10" active-color="#3190e8">
                <!-- 食品分类 -->
                <van-dropdown-item :title="foodTitle" ref="food" @open="chooseType('food')" @close="resetTitle">
                    <!-- 二级菜单 -->
                    <van-tree-select
                    v-model:active-id="activeId"
                    v-model:main-active-index="activeIndex"
                    :items="category"
                    @click-item="selectFoodType"
                    />
                </van-dropdown-item>
                <!-- 排序 -->
                <van-dropdown-item title="排序" v-model="sortValue" :options="sortTypeList" @change="changeSort" />
                <!-- 筛选 -->
                <van-dropdown-item title="筛选" ref="filter">
                    <!-- 配送方式 -->
                    <div class="m-4 text-xs">
                        <span class="text-1xs">配送方式</span>
                        <div>
                            <van-checkbox-group v-model="deliveryChecked" direction="horizontal" @change="selectDelivery">
                                <van-checkbox v-for="(item, index) in delivery" :key="index" :name="item" class="flex items-center pl-2 w-1/3 h-8 border-2 text-xxs" :class="delivery_mode !== item.id ? '' : 'border-blue-300'">
                                    <template #icon>
                                        <svg class="w-4 h-4">
                                            <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="delivery_mode === item.id ? '#selected':'#fengniao'"></use>
                                        </svg>
                                    </template>
                                    {{item.text}}
                                </van-checkbox>
                            </van-checkbox-group>
                        </div>
                    </div>
                    <!-- 商家属性 -->
                    <div class="m-4 text-xs">
                        <span class="text-1xs">商家属性（可以多选）</span>
                        <div>
                            <van-checkbox-group v-model="activityChecked" direction="horizontal" @change="selectActivity">
                                <van-checkbox v-for="(item, index) in activity" :key="index" :name="item" class="flex pl-2 w-1/3 h-8 border-2 text-xxs" :class="support_ids.indexOf(item.id) === -1 ? '' : 'border-blue-300'">
                                    <template #icon>
                                        <svg v-if="support_ids.indexOf(item.id) !== -1" class="w-4 h-4 mb-2 text-xxs">
                                            <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#selected'"></use>
                                        </svg>
                                        <div v-else class="flex justify-center items-center w-4 h-4 text-xxs border-2 rounded" :style="{color: '#' + item.icon_color, borderColor: '#' + item.icon_color}">{{item.icon_name}}</div>
                                    </template>
                                    {{item.name}}
                                </van-checkbox>
                            </van-checkbox-group>
                        </div>
                    </div>
                    <footer class="flex bg-gray-200 p-1">
                        <div class="flex-1 flex justify-center m-2">
                            <van-button class="w-full" type="danger" @click="clearSelect">清空</van-button>
                        </div>
                        <div class="flex-1 flex justify-center m-2">
                            <van-button class="w-full" type="success" @click="confirmSelect">
                                <template #default>
                                    <div>
                                        确定
                                        <span v-show="checkSum">({{checkSum}})</span>
                                    </div>
                                </template>
                            </van-button>
                        </div>
                    </footer>
                </van-dropdown-item>
            </van-dropdown-menu>
        </van-config-provider>
        <shop-list class="pt-10" v-if="geohash" :geohash="geohash" :restaurantCategoryId="restaurant_category_id" :restaurantCategoryIds="restaurant_category_ids" :sortByType="sortByType" :deliveryMode="delivery_mode" :supportIds="support_ids" :confirmSelect="confirmStatus"></shop-list>
    </div>
</template>

<script>
import { toRefs, ref, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { msiteAddress, foodCategory, foodDelivery, foodActivity } from '@/api/msite/msite'
import HeadTop from '@/components/HeadTop'
import ShopList from '@/components/ShopList'
export default {
    name: 'Food',
    components: {
        HeadTop,
        ShopList
    },
    setup() {
        const route = useRoute()
        const store = useStore()
        const useMutation = store._mutations
        const themeVars = {
            treeSelectItemActiveColor: '#3190e8',
            sidebarSelectedBorderColor: '#3190e8',
            dropdownMenuHeight: '2rem'
        }
        const food = ref(null)
        const filter = ref(null)
        const state = reactive({
            geohash: '',
            headTitle: '',
            foodTitle: '',
            restaurant_category_id: '', // 食品类型ID
            restaurant_category_ids: '',    // 筛选类型ID
            sortValue: 0,   // 选中排序
            activeId: 1,
            activeIndex: 0,
            sortByType: null,   // 数据以何种方式进行排序
            deliveryChecked: [],    // 筛选配送方式
            activityChecked: [],    // 筛选商家活动
            category: [],
            delivery: [],
            activity: [],
            delivery_mode: null, // 选中的配送方式
            support_ids: [],    // 选中的商家活动（多选）
            sortTypeList: [ // 排序方式列表
                { text: '智能排序', value: 0, sortType: 0 },
                { text: '距离最近', value: 1, sortType: 5 },
                { text: '销量最高', value: 2, sortType: 6 },
                { text: '起送价最低', value: 3, sortType: 1 },
                { text: '配送速度最快', value: 4, sortType: 2 },
                { text: '评分最高', value: 5, sortType: 3 },
            ],
            checkSum: 0,    // 多选项总和
            confirmStatus: false    // 是否确认选择
        })
        watch(() => [state.delivery_mode, state.support_ids], ([newDelivery, newSupport],[oldDelivery, oldSupport]) => {
            if(oldDelivery !== newDelivery || oldSupport !== newSupport) {
                let delivery_mode
                if(!newDelivery) {
                    delivery_mode = 0
                }else{
                    delivery_mode = 1
                }
                state.checkSum = delivery_mode + state.support_ids.length
            }
        })
        onMounted(() => {
            initData()
        })
        const initData = async() => {    // 数据初始化
            state.geohash = route.query.geohash
            state.headTitle = route.query.title
            state.foodTitle = state.headTitle
            state.restaurant_category_id = route.query.restaurant_category_id
            // 为防止刷新页面时状态丢失，若经纬度信息不存在则重新从接口获取并写入缓存
            if(!store.state.latitude) {
                let res = await msiteAddress(state.geohash)
                useMutation.RECORD_ADDRESS[0](res.data)
            }
            // 初始化食品分类一级菜单数据
            let category = await foodCategory(store.state.latitude, store.state.longitude)
            category = category.data
            category.forEach(item => {
                item.sub_categories.forEach(i => {
                    i.text = i.name
                })
            })
            state.category = category.map((item) => {
                return {
                    text: item['name'],
                    children: item['sub_categories']
                }
            })
            // 初始化筛选列表配送方式
            let delivery = await foodDelivery(store.state.latitude, store.state.longitude)
            state.delivery = delivery.data
            // 初始化筛选列表店铺活动
            let activity = await foodActivity(store.state.latitude, store.state.longitude)
            state.activity = activity.data
        }
        const chooseType = (type) => {  // 选择分类
            if(type == 'food') {
                state.foodTitle = '分类'
            }else{
                state.foodTitle = state.headTitle
            }
        }
        const resetTitle = () => {  // 关闭下拉菜单同时重置标题
            state.foodTitle = state.headTitle
        }
        const selectFoodType = (item) => {  // 获取所选食品分类信息
            console.log(item)
            state.restaurant_category_ids = item.id
            state.foodTitle = state.headTitle = item.name
            food.value.toggle()
        }
        const changeSort = (val) => {   // 获取排序方式
            state.sortByType = state.sortTypeList[val].sortType
            console.log(state.sortByType)
        }
        const selectDelivery = (item) => {
            if(item.length) {
                state.delivery_mode = item[0].id
            }else{
                state.delivery_mode = null
            }
        }
        const selectActivity = (item) => {
            console.log(item)
            let support_ids = []
            if(item.length) {
                item.forEach(i => {
                    support_ids.push(i.id)
                })
            }else{
                support_ids = []
            }
            state.support_ids = Array.from(new Set(support_ids))
        }
        const clearSelect = () => { // 重置数据选中状态
            state.delivery_mode = null
            state.support_ids = []
            state.deliveryChecked = [],
            state.activityChecked = [],
            state.checkSum = 0
        }
        const confirmSelect = () => {   // 提交筛选条件
            state.confirmStatus = !state.confirmStatus
            filter.value.toggle()

        }
        return {
            ...toRefs(state),
            food,
            filter,
            themeVars,
            chooseType,
            resetTitle,
            changeSort,
            selectFoodType,
            selectDelivery,
            selectActivity,
            clearSelect,
            confirmSelect
        }
    }
}
</script>

<style scoped>
.van-checkbox--horizontal {
    margin-right: 0px!important;
}
.van-checkbox__icon {
    height: 0!important;
}
</style>