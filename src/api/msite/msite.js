import axios from '@/utils/axios'

// 获取美食品类轮播数据
export function msiteFoodTypes(geohash) {
    return axios.get('/v2/index_entry', {
        params: {
            geohash,
            group_type: '1',
            'flag[]': 'F'
        }
    })
}

/*  获取商户列表数据
latitude                    Y      	string 	纬度
longitude                   Y      	string 	经度
offset    	                N      	int	跳过多少条数据，默认0
limit    	                N     	int	请求数据的数量，默认20
restaurant_category_id    	N     	int	餐馆分类id
order_by    	            N      	int	排序方式id： 1：起送价、2：配送速度、3:评分、4: 智能排序(默认)、5:距离最近、6:销量最高
delivery_mode    	        N     	array	配送方式id
support_ids    	            N     	array	餐馆支持特权的id
restaurant_category_ids    	N     	array	餐馆分类id 
*/
export function getShopList(
    latitude,
    longitude,
    offset,
    restaurant_category_id = '',
    restaurant_category_ids = '',
    order_by = '',
    delivery_mode = '',
    support_ids = []
    ) {
        let supportStr = ''
        support_ids.forEach(item => {
            if(item.status) {
                supportStr += '&support_ids[]=' + item.id
            }
        })
        let params = {
            latitude,
            longitude,
            offset,
            limit: '20',
            'extras[]': 'activities',
            keyword: '',
            restaurant_category_id,
            'restaurant_category_ids[]': restaurant_category_ids,
            order_by,
            'delivery_mode[]': delivery_mode + supportStr
        }
        return axios.get('/shopping/restaurants', { params })
}

// 获取当前位置信息
export function msiteAddress(geohash) {
    return axios.get('/v2/pois/' + geohash)
}

// 获取搜索内容
export function searchRestaurant(geohash, keyword) {
    return axios.get('/v4/restaurants', {
        params: {
            'extras[]': 'restaurant_activity',
            geohash,
            keyword,
            type: 'search'
        }
    })
}

// 获取食品类别一级菜单数据
export function foodCategory(latitude, longitude) {
    return axios.get('/shopping/v2/restaurant/category', {
        params: {
            latitude,
            longitude
        }
    })
}

// 获取筛选列表的配送方式
export function foodDelivery(latitude, longitude) {
    return axios.get('/shopping/v1/restaurants/delivery_modes', {
        params: {
            latitude,
            longitude,
            kw: ''
        }
    })
}

// 获取筛选列表的商家活动
export function foodActivity(latitude, longitude) {
    return axios.get('/shopping/v1/restaurants/activity_attributes', {
        latitude,
        longitude,
        kw: ''
    })
}