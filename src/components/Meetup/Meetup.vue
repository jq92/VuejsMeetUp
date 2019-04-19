<template>
  <v-container>
    <v-layout v-if="loading">
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular indeterminate color="primary" :size="70" :width="7"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <h2 class="primary--text">{{meetup.title}}</h2>
          </v-card-title>
          <v-img :src="meetup.imageUrl" aspect-ratio="2.75"></v-img>
          <v-card-text>
            <div class="primary--text">{{meetup.date}} {{meetup.time}} - {{meetup.location}}</div>
            <div>{{meetup.description}}</div>
          </v-card-text>
          <v-card-actions>
            <template v-if="userIsCreator">
              <app-edit-meetup :meetup="meetup"></app-edit-meetup>
            </template>
            <v-spacer></v-spacer>
            <!-- only login user with not creator status can see this button -->
            <app-register-dialog :meetupId="meetup.id" v-if="userIsAuthenticated && !userIsCreator"></app-register-dialog>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import EditMeetup from './EditMeetupDetails.vue';
import RegisterDialog from './Registration/RegisterDialog.vue';

export default {
  // this id value was pass from the router.js
  props: ['id'],
  components: {
    'app-edit-meetup': EditMeetup,
    'app-register-dialog': RegisterDialog
  },
  computed: {
    // get the data of this meetup by the matching id from the array of meetup data
    meetup() {
      return this.$store.getters.loadedMeetUp(this.id);
    },
    userIsAuthenticated() {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      );
    },
    userIsCreator() {
      if (!this.userIsAuthenticated) {
        return false;
      }
      return this.$store.getters.user.id === this.meetup.creatorId;
    },
    loading() {
      // fetch the loading status from store.js
      return this.$store.getters.loading;
    }
  }
};
</script>
