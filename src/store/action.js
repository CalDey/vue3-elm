import { getUser } from "@/api/login/login"
import { getAddressList } from '@/api/address/address'
import { GET_USERINFO, GET_ADDRESS } from './mutation-types.js'

export default {
    // 获取用户信息
    async getUserInfo({ commit }) {
        // 通过存储的用户ID获取用户登录信息
        let res = await getUser()
        res = res.data
        // 将用户信息存储至vuex
        commit(GET_USERINFO, res)
    },
    // 获取地址数据
    async getAddress({commit, state}) {
        if(state.addressList.length > 0) return
        let addrRes = await getAddressList(state.userInfo.user_id)
        addrRes = addrRes.data
        commit(GET_ADDRESS, addrRes)
    }
}