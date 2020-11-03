import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/users.vue'


Vue.use(VueRouter)

  const routes = [
    { path: '/', redirect: '/login' },//根路,直接跳转到login
    { path: '/login', component: Login },
    { path: '/home', 
      component: Home ,
      redirect:'/welcome', 
      children: [{ path: '/welcome', component: Welcome },
                  {path: '/users', component: Users }]
    }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from 从哪个路径跳转而来
  //next 函数，放行
  if (to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login'); //判断token是否为空，为空强制转向跳转页面
  next() //若存在token直接放行
})

export default router
