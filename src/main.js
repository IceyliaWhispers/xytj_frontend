import Vue from 'vue'
import store from "./store/index.js";

// 导入封装的api
import "@/api"
// 导入elementui样式
import "element-ui/lib/theme-chalk/index.css"

// 按需导入elementui
import "./plugins/index.js"
// 全局样式
import "./assets/css/global.less";

// 导入字体样式
import "@/assets/fonts/font.css"


import App from './App.vue'
import router from './router'
import dayjs from 'dayjs';

Vue.prototype.$dayjs = dayjs;
Vue.prototype.$echarts = window.echarts
Vue.config.productionTip = false


Vue.prototype.$deepCopy = function deepCopy(obj) {
  if (typeof obj !== "object") {
      return obj;
  }
  const newObj = obj instanceof Array ? [] : {};
  for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
          newObj[key] = deepCopy(obj[key]);
      }
  }
  return newObj;
}


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
