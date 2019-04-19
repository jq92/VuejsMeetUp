<template>
  <v-app class="secondary">
    <app-navigation
      :menuItems="menuItems"
      :userIsAuthenticated="userIsAuthenticated"
      @clicked="logOut"
    ></app-navigation>
    <main>
      <router-view></router-view>
    </main>
  </v-app>
</template>

<script>
import NavigationBar from './components/NavigationBar';

export default {
  name: 'App',
  components: {
    'app-navigation': NavigationBar
  },
  computed: {
    menuItems() {
      // this menu will be shown if there is no user login
      let menuItems = [
        { icon: 'assignment_turned_in', title: 'Sign Up', link: '/signup' },
        { icon: 'lock_open', title: 'Sign In', link: '/signin' }
      ];
      // this menu will only shown if there is a user login
      if (this.userIsAuthenticated) {
        menuItems = [
          { icon: 'people', title: 'Explore Meetups', link: '/meetups' },
          { icon: 'room', title: 'Create Meetup', link: '/meetups/new' }
          // { icon: 'account_circle', title: 'Profile', link: '/profile' }
        ];
      }
      return menuItems;
    },
    // this function is to check whether is a user login the webpage
    userIsAuthenticated() {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      );
    }
  },
  methods: {
    logOut(value) {
      if (value) {
        this.$store.dispatch('logout');
      }
    }
  }
};
</script>
