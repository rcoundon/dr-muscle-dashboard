import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import LoginPage from '@/components/auth/Login';
import store from '@/store/store-modules';

Vue.use(VueRouter);

const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    name: 'login',
    path: '/',
    component: LoginPage,
    props: true,
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const token = store.getters['storeAuth/token'];

  if (requiresAuth && !token) {
    router
      .push({
        name: 'login'
      })
      // eslint-disable-next-line no-unused-vars
      .catch(err => {});
  }
  next();
});

export default router;
