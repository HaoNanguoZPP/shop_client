import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import axios from 'axios'

//设置Content-Type为application/x-www-form-urlencoded，使后端服务器能够正确解析
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// 挂载
Vue.prototype.$http = axios
// 配置请求根路径
// axios.defaults.baseURL = 'http://59.110.234.48:8088/shop_server/'
axios.defaults.baseURL = 'http://localhost:8090/shop_server/'

//挂载拦截器预处理
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config)
  return config
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
