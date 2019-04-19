<template>
  <div>
    <!-- hamburger menu if the screen resized, keyword is temporary in order to hide the side bar-->
    <!-- sidebar -->
    <v-navigation-drawer v-model="sideNav" absolute temporary>
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{item.title}}</v-list-tile-content>
        </v-list-tile>
        <!-- Logout button -->
        <v-list-tile v-if="userIsAuthenticated" @click="onLogOut">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Log Out</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <!-- Main navigation -->
    <v-toolbar dark class="primary">
      <!-- trigger the hamburger menu to appear -->
      <v-toolbar-side-icon @click.stop="sideNav = !sideNav" class="hidden-md-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor:pointer">JOM!</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tool-bar-items class="hidden-sm-and-down">
        <v-btn flat v-for="item in menuItems" :key="item.title" :to="item.link">
          <v-icon left>{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>
        <!-- LogOut button -->
        <v-btn flat v-if="userIsAuthenticated" @click="onLogOut">
          <v-icon left>exit_to_app</v-icon>Log Out
        </v-btn>
      </v-tool-bar-items>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sideNav: false
    };
  },
  props: ['menuItems', 'userIsAuthenticated'],
  methods: {
    onLogOut() {
      this.$emit('clicked', true);
      // this.$store.dispatch('logout');
    }
  }
};
</script>
