<template>
    <div>
        <!-- 单价商品 -->
        <div v-if="!foods.specifications.length" class="flex place-content-center">
            <!-- 移除商品按钮 -->
            <span v-if="foodNum" @click="removeOutCart(foods.category_id, foods.item_id, foods.specfoods[0].food_id, foods.specfoods[0].name, foods.specfoods[0].price, '', foods.specfoods[0].packing_fee, foods.specfoods[0].sku_id, foods.specfoods[0].stock)">
                <svg class="w-4 h-4" style="fill: #3190e8;">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
                </svg>
            </span>
            <span v-if="foodNum" class="text-base mx-1 min-w-8 text-center">{{foodNum}}</span>
            <!-- 添加商品按钮 -->
            <span @click="addToCart(foods.category_id, foods.item_id, foods.specfoods[0].food_id, foods.specfoods[0].name, foods.specfoods[0].price, '', foods.specfoods[0].packing_fee, foods.specfoods[0].sku_id, foods.specfoods[0].stock)">
                <svg class="w-4 h-4" style="fill: #3190e8;">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
                </svg>
            </span>
        </div>
        <!-- 多规格商品 -->
        <div v-else>
            <van-button type="primary" size="mini" @click="showCheckModal(foods)">选规格</van-button>
        </div>
    </div>
</template>

<script>
import {reactive, toRefs, onMounted, computed} from 'vue'
import { useStore } from 'vuex'
export default {
    name: 'BuyCart',
    props: ['foods', 'shopId', 'shopCart'],
    setup(props, content) {
        const store = useStore()
        const useMutation = store._mutations
        const foodNum = computed(() => {    // 计算当前商品购买数量
            let category_id = props.foods.category_id
            let item_id = props.foods.item_id
            // 若购物车中已存在商品，计算商品总数
            if(props.shopCart && props.shopCart[category_id] && props.shopCart[category_id][item_id]) {
                let num = 0
                Object.values(props.shopCart[category_id][item_id]).forEach((item) => {
                    num += item.num
                })
                return num
            }else{
                // 购物车为空，商品为0
                return 0
            }
        })
        const state = reactive({
            foods: null
        })
        onMounted(() => {
            // console.log(props.shopCart)
        })
        // 移除商品
        const removeOutCart = (category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock) => {
            if(foodNum.value > 0) {
                useMutation.REDUCE_CART[0]({shopid: props.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock})
            }
        }
        // 添加商品
        const addToCart = (category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock) => {
            useMutation.ADD_CART[0]({shopid: props.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock})
        }
        // 多规格商品弹出选择弹窗
        const showCheckModal = (foods) => {
            content.emit('showCheckModal', foods)
        }
        return {
            ...toRefs(state),
            foodNum,
            removeOutCart,
            addToCart,
            showCheckModal
        }
    }
}
</script>

<style scoped>

</style>