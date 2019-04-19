<template>
  <v-container>
    <v-layout>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular indeterminate color="primary" :size="70" :width="7" v-if="loading"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-if="!loading">
      <v-flex xs12>
        <v-carousel height="80vh" style="cursor:pointer">
          <v-carousel-item
            v-for="meetup in meetups"
            :key="meetup.id"
            :src="meetup.imageUrl"
            @click="onLoadMeetUp(meetup.id)"
          >
            <div class="title">{{meetup.title}}</div>
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="mt-2">
      <v-flex xs12 sm6 class="text-sm-right text-xs-center">
        <v-btn large router to="/meetups" class="info" block>Explore Meetups</v-btn>
      </v-flex>
      <v-flex xs12 sm6 class="text-sm-left text-xs-center">
        <v-btn large router to="/meetups/new" class="info" block>Create Meetup</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  computed: {
    // computed properties must always "return"
    meetups() {
      // this is showing a features of meetup places for carousel display purpose
      return this.$store.getters.featuredMeetUps;
    },
    loading() {
      // fetch the loading status from store.js
      return this.$store.getters.loading;
    }
  },
  methods: {
    onLoadMeetUp(id) {
      this.$router.push('/meetups/' + id);
    }
  }
};
</script>

<style>
.title {
  position: inherit;
  text-align: center;

  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 2rem;
  padding: 5px;
}
</style>
