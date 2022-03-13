import Axios from 'axios'
import { Toast } from 'vant'

const baseURL = 'http://localhost:3000'
// const baseURL = 'https://elm.cangdu.org'

const axios = Axios.create({
    baseURL,
    timeout: 20000,
})

// axios.default.withCredentials = true    // 允许跨域携带cookie信息

// 前置拦截器(请求前拦截)
axios.interceptors.request.use((response) => {
    return response
},(err) => {
    return Promise.reject(err)
})

// 后置拦截器(获取到响应后拦截)
axios.interceptors.response.use((response) => {
    return response
},(err) => {
    // 抛出异常提示
    if(err.response && err.response.data) {
        const code = err.response.status
        const msg = err.response.data.message
        Toast.fail(msg)
        console.log(`[Axios Error]`, err.response)
    }else{
        Toast.fail(err)
    }
    return Promise.reject(err)
})

export default axios