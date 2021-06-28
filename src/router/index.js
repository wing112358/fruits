import Vue from "vue"
import VueRouter from "vue-router"
import Login from "../views/Login.vue"
import Main from "../views/Main.vue"
import List from "../views/List.vue"


Vue.use(VueRouter);
export default new VueRouter({

  routes:[
    {
      path:'/login',
      component:Login,
      meta:{
        title:'用户登录'
      }
    },
    {
      path:'/main',
      component:Main
    },
    {
      path:'/list',
      component:List,
      meta:{
        title:'水果管理',
        requireAuth: true
      }
    }

  ]
});
