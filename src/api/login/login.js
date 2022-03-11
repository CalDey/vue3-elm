import axios from '@/utils/axios'
import { getStore } from '@/config/utils'

// 获取图片验证码
export function getCaptchas() {
    return axios.post('/v1/captchas', {})
}

// 注册登录接口
export function accountLogin(username, password, captcha_code) {
    return axios.post('/v2/login', {
        username,
        password,
        captcha_code
    })
}

// 获取用户信息
export function getUser() {
    return axios.get('/v1/user', {
        params: {
            user_id: getStore('user_id')
        }
    })
}

// 退出登录接口
export function signout() {
    return axios.get('/v2/signout')
}

// 修改密码
export function changePassword(username, oldpassWord, newpassword, confirmpassword, captcha_code) {
    return axios.post('/v2/changepassword',
    {
        username,
        oldpassWord,
        newpassword,
        confirmpassword,
        captcha_code
    })
}