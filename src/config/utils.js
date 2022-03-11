// 存储localStorage
export const setStore = (name, content) => {
    if(!name) return
    if(typeof content !== 'string') {
        content = JSON.stringify(content)
    }
    window.localStorage.setItem(name, content)
}
// 读取localStorage
export const getStore = (name) => {
    if(!name) return
    return window.localStorage.getItem(name)
}

// 删除localStorage
export const removeStore = (name) => {
    if(!name) return
    window.localStorage.removeItem(name)
}

// img前缀
export const imgBaseUrl = 'https://fuss10.elemecdn.com'

// 封装自定义对象键名方法
export const changeKey = (arr,key) => {
    let newArr = [];
    arr.forEach((item, index)=>{
        let newObj = {};
        for (var i = 0; i < key.length; i++){
        newObj[key[i]]=item[Object.keys(item)[i]]
        }
        newArr.push(newObj)
    })
    return newArr
}

// 图片处理函数
export const getImgPath = (path) => {
    let suffix;
    if (!path) {
        return '//elm.cangdu.org/img/default.jpg'
    }
    if (path.indexOf('jpeg') !== -1) {
        suffix = '.jpeg'
    } else {
        suffix = '.png'
    }
    let url = '/' + path.substr(0, 1) + '/' + path.substr(1, 2) + '/' + path.substr(3) + suffix;
    return 'https://fuss10.elemecdn.com' + url
}


