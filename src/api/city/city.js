import axios from '@/utils/axios'

// 默认定位
export function guessCity() {
    return axios.get('/v1/cities?type=guess')
}

// 热门城市
export function hotCity() {
    return axios.get('/v1/cities?type=hot')
}

// 全部城市
export function allCity() {
    return axios.get('/v1/cities?type=group')
}

// 获取城市名称
export function getCityName(num) {
    return axios.get('/v1/cities/' + num)
}

// 搜索地址
export function searchPlace(cityid, value) {
    return axios.get('/v1/pois', {
        params: {
            type: 'search',
            city_id: cityid,
            keyword: value
        }
    })
}

