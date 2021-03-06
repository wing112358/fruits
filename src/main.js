// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios';

Vue.config.productionTip = false

Vue.use(router)
Vue.use(ElementUI)
Vue.prototype.axios=axios



router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
    if (to.matched.some(record => record.meta.requireAuth)){ // 判断该路由是否需要登录权限
      console.log('需要登录');
      console.log(window.sessionStorage.getItem("token"));
      if (window.sessionStorage.getItem("token")) { // 判断当前的token是否存在 ； 登录存入的token
        next();
      }
      else {
        next({
          path: '/login',
          query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
        })
      }
    }
    else {
      next();
    }
  }

  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render:h=>h(App)
})
