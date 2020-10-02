import Vue from 'vue'
import Router from 'vue-router'

import Login from './views/Login.vue'
import Index from './views/dashboard/Index'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/index',
    name: 'Index',
    component: Index,
  },
]

const router = new Router({ routes })

router.beforeEach((to, from, next) => {
  const publicPages = ['Login']
  const authPages = ['Index']
  const authRequired = !publicPages.includes(to.name)
  const user = JSON.parse(localStorage.getItem('user'))
  console.log('this.user', user)

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (user === null) {
    // chưa đăng nhập
    if (authRequired) {
      next('/')
    } else {
      next()
    }
  } else {
    // đã đăng nhập
    if (authPages.includes(to.name)) {
      next()
    } else {
      next('/index')
    }
  }
})

export default router

// export default new Router({
//   mode: 'hash',
//   base: process.env.BASE_URL,
//   routes: [
//     {
//       path: '/',
//       component: () => import('@/views/dashboard/Index'),
//       children: [
//         // Dashboard
//         {
//           name: 'Dashboard',
//           path: '',
//           component: () => import('@/views/dashboard/Dashboard'),
//         },
//         // Pages
//         {
//           name: 'User Profile',
//           path: 'pages/user',
//           component: () => import('@/views/dashboard/pages/UserProfile'),
//         },
//         {
//           name: 'Notifications',
//           path: 'components/notifications',
//           component: () => import('@/views/dashboard/component/Notifications'),
//         },
//         {
//           name: 'Icons',
//           path: 'components/icons',
//           component: () => import('@/views/dashboard/component/Icons'),
//         },
//         {
//           name: 'Typography',
//           path: 'components/typography',
//           component: () => import('@/views/dashboard/component/Typography'),
//         },
//         // Tables
//         {
//           name: 'Regular Tables',
//           path: 'tables/regular-tables',
//           component: () => import('@/views/dashboard/tables/RegularTables'),
//         },
//         // Maps
//         {
//           name: 'Google Maps',
//           path: 'maps/google-maps',
//           component: () => import('@/views/dashboard/maps/GoogleMaps'),
//         },
//         // Upgrade
//         {
//           name: 'Upgrade',
//           path: 'upgrade',
//           component: () => import('@/views/dashboard/Upgrade'),
//         },
//       ],
//     },
//   ],
// })
