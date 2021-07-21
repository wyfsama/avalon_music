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
        t: +new Date()
      }
    } else if (config.method === 'push') {
      config.data = {
        ...config.data,
        t: +new Date()
      }
    }
    return config
  }, err => {
    console.log(err)
  })
  return install(config)
}
export default request
