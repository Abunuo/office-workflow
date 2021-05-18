/**
 * 项目总入口，引入资源，公用资源等
 */
import { createApp } from 'vue'

// 引入三方组件
import ElementPlus from 'element-plus';
import locale from 'element-plus/lib/locale/lang/zh-cn'
import dragForm from '@/components/drag-form/index'

// 引入指令
import directives from '@/directives/index'

// 引入插件
import plugins from '@/plugins/index'

// 引入公共样式
import 'element-plus/lib/theme-chalk/index.css';
import '@/assets/styles/index.scss'

// 加载入口
import App from './App.vue'

// 引入 route，store
import route from './routes/index'
import store from './store/index'

// 创建 vue app 实例
const app = createApp(App);

app
  .use(route)
  .use(store)
  .use(ElementPlus, { locale, size: 'small' })
  .use(directives)
  .use(plugins)
  .use(dragForm)
  .mount('#app')
