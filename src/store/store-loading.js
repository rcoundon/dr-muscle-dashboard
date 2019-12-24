import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default {
  namespaced: true,
  state: {
    isLoading: false
  },
  mutations: {
    SET_LOADING(state, isLoading) {
      state.loading = isLoading;
    }
  },
  actions: {
    setLoading({ commit }, isLoading) {
      commit('SET_LOADING', isLoading);
    }
  },
  getters: {
    isLoading: state => state.isLoading
  }
};
