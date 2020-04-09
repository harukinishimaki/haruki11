import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Signup from '../views/Signup.vue'
import Signin from '../views/Signin.vue'
import firebase from 'firebase'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Home',
  component: Home,
  meta: {
    requiresAuth: true
  }
},
{
  path: '/about',
  name: 'About',
  component: About,
  meta: {
    requiresAuth: true
  }
},
{
  path: '/signup',
  name: 'Signup',
  component: Signup
},
{
  path: '/signin',
  name: 'Signin',
  component: Signin
},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
  firebase.auth() .onAuthStateChanged(function (user) {
    if (user) {
      next()
    } else {
      next({
        path: '/signin',
        query: {
          redirect: to.fullPath
        }
      })
    }
  })
} else {
  next()
}
})

export default router