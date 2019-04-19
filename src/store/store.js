import Vue from 'vue';
import Vuex from 'vuex';
import meetup from './meetup/storemeetup';
import user from './user/storeuser';
import shared from './shared/share';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    meetup: meetup,
    user: user,
    shared: shared
  }
});
