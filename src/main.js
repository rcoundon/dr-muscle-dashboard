// Polyfilling for older browsers
import "core-js/stable";
import "regenerator-runtime/runtime";

import Vue from "vue";
import VueApexCharts from "vue-apexcharts";

import Buefy from "buefy";
import "buefy/dist/buefy.css";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
library.add(faArrowUp, faArrowDown);

Vue.component("vue-fontawesome", FontAwesomeIcon);

Vue.use(Buefy, {
  defaultIconComponent: "vue-fontawesome",
  defaultIconPack: "fas"
});

// Setup global apexchart component availability
Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);

import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
