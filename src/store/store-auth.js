import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default {
  namespaced: true,
  state: {
    token: undefined,
    username: undefined,
    expiresIn: 0
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },
    REMOVE_TOKEN(state) {
      state.token = undefined;
    },
    SET_USERNAME(state, username) {
      state.username = username;
    },
    SET_EXPIRES_IN(state, expiresIn) {
      state.expiresIn = expiresIn;
    }
  },
  actions: {
    setToken({ commit }, token) {
      commit('SET_TOKEN', token);
    },
    setUsername({ commit }, username) {
      commit('SET_USERNAME', username);
    },
    setExpiresIn({ commit }, expiresIn) {
      commit('SET_EXPIRES_IN', expiresIn);
    }
  },
  getters: {
    token: state => state.token,
    username: state => state.username,
    expiresIn: state => state.expiresIn
  }
};
