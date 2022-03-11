import axios from '@/utils/axios'

// 获取店铺详情
export function shopDetailData(shopid, latitude, longitude) {
    return axios.get(`/shopping/restaurant/${shopid}`, {
        params: {
            latitude,
            longitude: longitude + '&extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics'
        }
    })
}

// 获取shop页面菜单列表
export function foodMenu(restaurant_id) {
    return axios.get('/shopping/v2/menu', {
        params: {
            restaurant_id
        }
    })
}

// 获取店铺评价数据
export function ratingScores(shopid) {
    return axios.get('/ugc/v2/restaurants/' + shopid + '/ratings/scores')
}

// 获取评价标签数据
export function ratingTags(shopid) {
    return axios.get('/ugc/v2/restaurants/' + shopid + '/ratings/tags')
}

// 获取评价数据列表
export function getRatingList(shopid, offset, tag_name = '') {
    return axios.get('/ugc/v2/restaurants/' + shopid + '/ratings', {
        params: {
            has_content: true,
            offset,
            limit: 10,
            tag_name
        }
    })
}