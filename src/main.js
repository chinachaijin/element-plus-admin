import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'normalize.css/normalize.css' // css重置的现代替代方法
import 'element-plus/dist/index.css'
import './style/index.scss'
import Cookies from 'js-cookie'
import './icons' // icon
import './permission' // 权限控制
import SvgIcon from '@/components/SvgIcon'// svg component
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App).component('svg-icon', SvgIcon).use(ElementPlus, { size: Cookies.get('size') || 'medium', zIndex: 3000 , locale: zhCn}).use(store).use(router)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
