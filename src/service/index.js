import axios from 'axios'
import { Toast } from 'vant'
import router from '@/router'
import store from '@/store'
import i18n from '@/i18n'

// 默认超时设置
axios.defaults.timeout = 10000
axios.defaults.baseURL =  process.env.VUE_APP_BASE_URL
// 取消重复请求(即当前正在进行的相同请求)
const pending = {}
const CancelToken = axios.CancelToken
const removePending = (key, isRequest = false) => {
  if (pending[key] && isRequest) {
    pending[key]('Cancel duplicate request')
  }
  delete pending[key]
}
const getRequestIdentify = (config, isReuest = false) => {
  let url = config.url

  if (isReuest) {
    url = config.baseURL + config.url.substring(1, config.url.length)
  }
  return config.method === 'get' ? encodeURIComponent(url + JSON.stringify(config.params)) : encodeURIComponent(config.url + JSON.stringify(config.data))
}

// 记录请求次数
let requestingCount = 0
// http request 拦截器
axios.interceptors.request.use(
  config => {
    requestingCount++
    // 拦截重复请求(即当前正在进行的相同请求)
    const requestData = getRequestIdentify(config, true)
    removePending(requestData, true)

    config.cancelToken = new CancelToken((c) => {
      pending[requestData] = c
    })

    // 设置参数格式
    if (!config.headers['Content-Type']) {
      config.headers = {
        'Content-Type': 'application/json'
      }
    }
    // 添加token到headers
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.token = token
    }
    config.headers.locale = i18n.locale
    // 鉴权参数设置
    if (config.method === 'get') {
      // get请求下 参数在params中，其他请求在data中
      config.params = config.params || {}
      // let json = JSON.parse(JSON.stringify(config.params));
      // 一些参数处理
    } else {
      config.data = config.data || {}
      // 一些参数处理
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    // 把已经完成的请求从 pending 中移除
    const requestData = getRequestIdentify(response.config)
    removePending(requestData)

    // 一些统一code的返回处理
    if (response.data.code === 401) {
      // 登录验证
      // 做了个示例跳转项目中登录，并记录下相对路径
      router.push({ name: 'login' })
    }

    requestingCount--
    if (requestingCount <= 0) {
      setTimeout(() => {
        store.dispatch('common/showLoading', false)
      }, 500)
    }

    return response
  },
  error => {
    requestingCount--
    if (requestingCount <= 0) {
      store.dispatch('common/showLoading', false)
    }

    return Promise.reject(error)
  }
)

/**
 * 封装get方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function fetch(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(response => {
      if (response.data.code === 200) {
        // 返回成功处理  这里传的啥 后续调用的时候 res就是啥
        resolve(response.data)// 我们后台所有数据都是放在返回的data里所以这里统一处理了
      } else {
        // 错误处理
        Toast(response.data.msg)
      }
    })
      .catch(err => {
        reject(err)
        let message = i18n.t('commonLang.lang12')
        // 错误返回
        if (err?.response?.data?.message) {
          message = err.response.data.message
        }

        // 过滤掉取消重复请求回来的err
        err.response && Toast(message)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}, config = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data, config)
      .then(response => {
        if (response.data.code === 200) {
          resolve(response.data)
        } else if (response.data.code != 401) {
          Toast(response.data.msg)
        }
      }, err => {
        reject(err)
        let message = i18n.t('commonLang.lang12')
        if (err?.response?.data?.message) {
          message = err.response.data.message
        }

        // 过滤掉取消重复请求回来的err
        err.response && Toast(message)
      })
  })
}

