import { 
    RECORD_ADDRESS,
    SAVE_GEOHASH,
    ADD_CART,
    REDUCE_CART,
    INIT_BUYCART,
    CLEAR_CART,
    SAVE_SHOPID,
    SAVE_CART_ID_SIG,
    CHOOSE_ADDRESS,
    CONFIRM_REMARK,
    SAVE_ORDER_PARAM,
    ORDER_SUCCESS,
    RECORD_SHOPDETAIL,
    RECORD_USERINFO,
    GET_USERINFO,
    OUT_LOGIN,
    RETSET_NAME,
    GET_ADDRESS,
    SAVE_ADDDETAIL,
    ADD_ADDRESS
} from './mutation-types'

import { setStore, getStore } from '@/config/utils'
// import { list } from 'postcss'

export default {
    // 记录当前经纬度
    [RECORD_ADDRESS] (state, {
        latitude,
        longitude
    }) {
        state.latitude = latitude
		state.longitude = longitude
    },
    // 保存geohash坐标
    [SAVE_GEOHASH] (state, geohash) {
        state.geohash = geohash
    },
    // 添加商品至购物车
    [ADD_CART] (state, {
        shopid,
        category_id,
        item_id,
        food_id,
        name,
        price,
        specs,
        packing_fee,
        sku_id,
        stock
    }) {
        let cart = state.cartList   // 获取购物车
        // 获取购物车中当前商品数量
        // 若当前商品不存在购物车中生成对应数据结构: cart[shopid][category_id][category_id]
        let shop = cart[shopid] = (cart[shopid] || {})
        let category = shop[category_id] = (shop[category_id] || {})
        let item = category[item_id] = (category[item_id] || {})
        if(item[food_id]) {
            // 如果购物车中存在该商品，商品数量+1
            item[food_id]['num']++
        }else{
            // 该商品未添加至购物车，添加商品并生成对应数据结构
            item[food_id] = {
                'num': 1,
                'id': food_id,
                'name': name,
                'price': price,
                'specs': specs,
                'packing_fee': packing_fee,
                'sku_id': sku_id,
                'stock': stock
            }
        }
        // 保存当前购物车
        state.cartList = {...cart}
        // console.log(cart)
        // 写入localStorage
        setStore('buyCart', state.cartList)
    },
    // 商品移出购物车
    [REDUCE_CART](state, {
        shopid,
        category_id,
        item_id,
        food_id,
        name,
        price,
        specs
    }) {
        let cart = state.cartList   // 获取购物车
        // 获取购物车中当前商品数量 
        // cart[shopid][category_id][category_id]
        let shop = cart[shopid] || {}
        let category = shop[category_id] || {}
        let item = category[item_id] || {}
        if(item && item[food_id]) {
            // 若购物车中存在该商品且数量大于0
            if(item[food_id]['num'] > 0) {
                item[food_id]['num']--
            }else{
                // 商品数量为0，清空当前商品数据
                item[food_id] = null
            }
        }
        state.cartList = {...cart}
        setStore('buyCart', state.cartList)
    },
    // 初始化购物车 通过读取localStorage实现持久化存储
    [INIT_BUYCART](state) {
        let initCart = getStore('buyCart')
        if(initCart) {
            state.cartList = JSON.parse(initCart)
        }
    },
    // 清空购物车
    [CLEAR_CART](state, shopid) {
        state.cartList[shopid] = null
        state.cartList = {...state.cartList}
        setStore('buyCart', state.cartList)
    },
    // 保存shopid
    [SAVE_SHOPID](state, shopid) {
        state.shopid = shopid
    },
    [SAVE_CART_ID_SIG](state, {
        cart_id,
        sig
    }) {
        state.cart_id = cart_id
        state.sig = sig
    },
    // 当前选择地址
    [CHOOSE_ADDRESS] (state, {
        address,
        index
    }) {
        state.chooseAddress = address
        state.addressIndex = index
    },
    // 保存店铺详情
    [RECORD_SHOPDETAIL](state, detail) {
        state.shopDetail = detail
    },
    // 记录用户信息
    [RECORD_USERINFO](state, info) {
        state.userInfo = info
        state.login = true
        setStore('user_id', info.user_id)
    },
    // 保存用户信息至vuex
    [GET_USERINFO](state, info) {
        if(state.userInfo && (state.userInfo.username !== info.username)) {
            return
        }
        // if(!state.login){
        //     return
        // }
        if(!info.message) {
            state.userInfo = {...info}
            state.login = true
        }else{
            state.userInfo = null
        }
    },
    // 清除登录信息
    [OUT_LOGIN](state) {
        state.userInfo = null
        state.login = false
    },
    // 修改用户名
    [RETSET_NAME](state, username) {
        state.userInfo = Object.assign({}, state.userInfo, {username})
    },
    // 获取地址列表
    [GET_ADDRESS](state, address) {
        // 从接口获取地址列表更新vuex
        state.addressList = address
    },
    // 新增地址（地区）
    [SAVE_ADDDETAIL](state, newAddress) {
        state.addAddress = newAddress
    },
    // 新增新地址
    [ADD_ADDRESS](state, obj) {
        state.addressList = [obj, ...state.addressList]
    },
    // 记录当前选择的备注信息，回退时传递给订单确认页
    [CONFIRM_REMARK](state, {
        remarkText,
        inputText
    }) {
        state.remarkText = remarkText
        state.inputText = inputText
    },
    // 保存下单参数，用户验证页面调用
    [SAVE_ORDER_PARAM](state, orderParam) {
        state.orderParam = orderParam
    },
    // 下单成功，保存订单返回信息
    [ORDER_SUCCESS](state, order) {
        state.orderMessage = order
    }
}