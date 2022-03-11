import { createStore } from 'vuex'
import mutations from './mutations'
import actions from './action'

const state = {
    geohash: '31.22299,121.36025',//地址geohash值
    longitude: '', // 经度
    latitude: '', // 纬度
    cartList: {},   //  加入购物车的商品列表
    shopDetail: null,   // 商铺详情信息
    shopid: null, 
    cart_id: null,
    sig: null,
    chooseAddress: null,
    addressIndex: null,
    userInfo: null, // 用户信息
    login: false,   // 是否登录
    addressList: [],    // 地址列表
    addAddress: '', // 新增地址
    remarkText: null,   // 备注标签
    inputText: '',  // 备注信息
    orderParam: null,   // 订单参数
    orderMessage: null, // 订单返回的信息
}

export default createStore({
    state,
    mutations,
    actions
})