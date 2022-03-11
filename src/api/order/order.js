import axios from '@/utils/axios'

// 获取订单列表
export function getOrderList(user_id, offset) {
    return axios.get('/bos/v2/users/' + user_id + '/orders', {
        params: {
            limit: 10,
            offset
        }
    })
}

// 校验订单
export function checkout(geohash, entities, shopid) {
    return axios.post('/v1/carts/checkout', {
        come_from: 'web',
        geohash,
        entities,
        restaurant_id: shopid
    })
}

// 获取快速备注列表
export function getRemark(id, sig) {
    return axios.get('/v1/carts/' + id + '/remarks', {
        sig
    })
}

// 下单
export function placeOrders(user_id, cart_id, address_id, description, entities, geohash, sig) {
    return axios.post('/v1/users/' + user_id + '/carts/' + cart_id + '/orders', {
        address_id,
        come_from: 'mobile_web',
        deliver_time: '',
        description,
        entities,
        geohash,
        paymethod_id: 1,
        sig
    })
}

// 调起支付
export function payRequest(merchantOrderNo, userId) {
    return axios.get('/payapi/payment/queryOrder', {
        params: {
            merchantId: 5,
            merchantOrderNo,
            source: 'MOBILE_WAP',
            userId,
            version: '1.0.0'
        }
    })
}