import axios from '@/utils/axios'
// import { getStore } from '@/config/utils'


// 获取地址数据
export function getAddressList(user_id) {
    return axios.get('/v1/users/' + user_id + '/addresses')
}

// 搜索地址
export function searchNearby(keyword) {
    return axios.get('/v1/pois', {
        params: {
            type: 'nearby',
            keyword
        }
    })
}

// 添加新地址
export function addNewAddress(userId, address, address_detail, geohash, name, phone, phone_bk, poi_type, sex, tag, tag_type) {
    return axios.post('/v1/users/' + userId + '/addresses', {
        address,
        address_detail,
        geohash,
        name,
        phone,
        phone_bk,
        poi_type,
        sex,
        tag,
        tag_type
    })
}

// 删除地址
export function deleteAddress(userid, addressid) {
    return axios.delete('/v1/users/' + userid + '/addresses/' + addressid, {})
}