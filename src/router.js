import Vue from 'vue'
import Router from 'vue-router'

import Login from './views/Login.vue'
import Index from './views/dashboard/Index'
import Dashboard from './views/dashboard/Dashboard'
import ListBrand from './views/manage-brand/ListBrand'
import ListProduct from './views/manage-product/ListProduct'
import ProductDetail from './views/manage-product/ProductDetail'
import ListOrder from './views/manage-order/ListOrder'
import OrderDetail from './views/manage-order/OrderDetail'
import Profile from './views/Profile'
import ListUser from './views/manage-user/ListUser'

Vue.use(Router)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Index',
    component: Index,
    children: [
      {
        name: 'Dashboard',
        path: '',
        component: Dashboard,
      },
      {
        name: 'Profile',
        path: 'profile',
        component: Profile,
      },
      {
        name: 'Manage User',
        path: 'user',
        component: ListUser,
      },
      {
        name: 'Manage Brand',
        path: 'brand',
        component: ListBrand,
      },
      {
        name: 'Manage Product',
        path: 'product',
        component: ListProduct,
      },
      {
        name: 'Product Detail',
        path: 'product/:productId',
        component: ProductDetail,
        props: true,
      },
      {
        name: 'Manage Order',
        path: 'order',
        component: ListOrder,
      },
      {
        name: 'Order Detail',
        path: 'order/:orderId',
        component: OrderDetail,
        props: true,
      },
    ],
  },
]

const router = new Router({ routes })

router.beforeEach((to, from, next) => {
  const publicPages = ['Login']
  const authPages = ['Index', 'Dashboard', 'Profile', 'Manage User',
  'Manage Brand', 'Manage Product', 'Product Detail', 'Manage Order', 'Order Detail']
  const authRequired = !publicPages.includes(to.name)
  const user = JSON.parse(localStorage.getItem('user'))

  // console.log('router name ', to.name)
  // console.log('this.user', user)

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (user === null) {
    // chưa đăng nhập
    if (authRequired) {
      next('/login')
    } else {
      next()
    }
  } else {
    // đã đăng nhập
    if (authPages.includes(to.name)) {
      next()
    } else {
      next('/login')
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
//       component: () => import('@/views/dashboard/'),
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
