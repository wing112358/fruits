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
      component:Login
    },
    {
      path:'/main',
      component:Main
    },
    {
      path:'/list',
      component:List
    }

  ]
});
