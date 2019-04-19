<template>
  <v-dialog persistent v-model="registerDialog">
    <v-btn class="info" accent slot="activator">
      <!-- user will see different button depending whether they are register -->
      {{ userIsRegistered ? 'Unregister' : 'Register' }}
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title v-if="userIsRegistered">Unregister from Meetup?</v-card-title>
            <v-card-title v-else>Register for Meetup?</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>You can always change your decision later on.</v-card-text>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-actions>
              <v-btn class="red--text darken-1" flat @click="registerDialog = false">Cancel</v-btn>
              <v-btn class="green--text darken-1" flat @click="onAgree">Confirm</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['meetupId'],
  data() {
    return {
      registerDialog: false
    };
  },
  computed: {
    userIsRegistered() {
      return (
        // find whether the meetup id that is pass from the individual meetup page whether is a match with the meetup id on every element in registeredMeetups(which contain an array of meetup id)
        this.$store.getters.user.registeredMeetups.findIndex(meetupId => {
          return meetupId === this.meetupId;
        }) >= 0
        // greater or equal to 0 is the mainpoint to decide whether the user is register for this meetup(if registered, it will > 0)
      );
    }
  },
  methods: {
    onAgree() {
      // perform actions depend on user is register or not
      if (this.userIsRegistered) {
        this.$store.dispatch('unregisterUserForMeetup', this.meetupId);
      } else {
        this.$store.dispatch('registerUserForMeetup', this.meetupId);
      }
    }
  }
};
</script>
