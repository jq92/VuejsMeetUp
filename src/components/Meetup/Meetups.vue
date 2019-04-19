<template>
  <v-container>
    <v-layout row wrap v-for="meetup in meetups" :key="meetup.id" class="mb-2">
      <v-flex xs12 sm10 offset-sm1>
        <v-card class="primary">
          <v-img :src="meetup.imageUrl" aspect-ratio="2.75"></v-img>

          <v-card-title primary-title class="secondary--text">
            <div>
              <h3 class="headline mb-0">{{meetup.title}}</h3>
              <div>Date: {{ meetup.date }}</div>
              <div>Time: {{ meetup.time | filterTime }}</div>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="info" :to="'/meetups/' + meetup.id">More Info</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  computed: {
    meetups() {
      // showing all the meetup location by date descending order
      return this.$store.getters.loadedMeetUps;
    }
  }
};
</script>
