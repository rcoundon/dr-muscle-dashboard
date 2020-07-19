// Polyfilling for older browsers
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginVue from '@bugsnag/plugin-vue';

import Vue from 'vue';
import VueApexCharts from 'vue-apexcharts';

import VueScrollTo from 'vue-scrollto';

import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import axios from 'axios';

const version = require('../package.json').version;

const instance = axios.create({
  baseURL: 'https://drmuscle.azurewebsites.net/'
});

Vue.prototype.$axios = instance;

import {
  faArrowUp,
  faArrowDown,
  faAngleLeft,
  faAngleRight,
  faAt,
  faKey,
  faExclamationCircle,
  faDumbbell,
  faLongArrowAltRight,
  faChild,
  faWeight,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faArrowUp,
  faArrowDown,
  faAngleLeft,
  faAngleRight,
  faAt,
  faKey,
  faExclamationCircle,
  faDumbbell,
  faLongArrowAltRight,
  faChild,
  faWeight,
  faCalendar
);

Vue.component('vue-fontawesome', FontAwesomeIcon);

Vue.use(VueScrollTo);

Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas'
});

// Setup global apexchart component availability
Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);

import App from './App.vue';
import router from './router';
import store from './store/store-modules';

Bugsnag.start({
  apiKey: process.env.VUE_APP_BUGSNAG,
  plugins: [new BugsnagPluginVue(Vue)]
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
