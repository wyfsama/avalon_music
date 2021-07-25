import axios from 'axios'
function request(config) {
  const install = axios.create({
    baseURL: 'https://autumnfish.cn/',
    withCredentials: true
  })
  install.interceptors.request.use(config => {
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        timestamp: +new Date()
      }
    } else if (config.method === 'post') {
      config.data = {
        ...config.data,
        timestamp: +new Date()
      }
    }
    return config
  }, err => {
    console.log(err)
  })
  return install(config)
}
export default request
