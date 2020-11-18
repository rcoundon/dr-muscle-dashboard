/*
  Used to deal with maintaining state for logged in users
*/
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import modules from './index';

Vue.use(Vuex);

let store = new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  modules: modules,
});

export default store;
