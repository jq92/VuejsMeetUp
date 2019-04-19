import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router/router';
import store from './store/store';
import TimeFilter from './filters/time';
import * as firebase from 'firebase';
import Alert from './components/SharedFeature/Alert.vue';

Vue.config.productionTip = false;
Vue.filter('filterTime', TimeFilter);

// This is a shared component that has alert feature
Vue.component('app-alert', Alert);

new Vue({
  // initial firebase sdk package on starting of the page
  created() {
    firebase.initializeApp({
      apiKey: 'AIzaSyC5kS-WteqWfimwJ9bpHJpU70Em3IYcHZs',
      authDomain: 'vuejs-project-meetup.firebaseapp.com',
      databaseURL: 'https://vuejs-project-meetup.firebaseio.com',
      projectId: 'vuejs-project-meetup',
      storageBucket: 'gs://vuejs-project-meetup.appspot.com'
    });
    // to check whether there is a user recently log in or there is a user already log in
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // if the login token is exist, it will direct to autoLogin action that the webpage will be already log in automatically
        this.$store.dispatch('autoLogIn', user);
        this.$store.dispatch('fetchUserData');
      }
    });
    // initial the loadMeetup action(which is retrieve the data store in firebase set into store.js state)
    this.$store.dispatch('loadedMeetUps');
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app');
