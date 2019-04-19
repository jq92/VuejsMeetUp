import * as firebase from 'firebase';

export default {
  state: {
    loading: false,
    authError: ''
  },
  mutations: {
    // change the status of loading in state
    setLoading(state, payload) {
      state.loading = payload;
    },
    // change the of status error in state
    setError(state, payload) {
      state.authError = payload;
    },
    // change the status of error back to null
    clearError(state) {
      state.authError = null;
    }
  },
  actions: {
    clearError({ commit }) {
      commit('clearError');
    }
  },
  getters: {
    loading(state) {
      return state.loading;
    },
    // return error state,for checking error purpose
    error(state) {
      return state.authError;
    }
  }
};
