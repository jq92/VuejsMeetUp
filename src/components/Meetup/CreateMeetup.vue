<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="primary--text">Create a new Meet Up</h1>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <form class="mt-2 pa-4" @submit.prevent="submitNewMeetUp">
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  outline
                  v-model="title"
                  name="title"
                  label="Title"
                  id="title"
                  required
                  :rules="[() => title.length > 0 || 'Please insert a title']"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  outline
                  v-model="location"
                  name="location"
                  label="Location"
                  id="location"
                  required
                  :rules="[() => location.length > 0 || 'Please insert a location']"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  label="Upload Image"
                  @click="imageUpload"
                  v-model="imageName"
                  prepend-icon="attach_file"
                ></v-text-field>
                <input
                  type="file"
                  style="display:none"
                  ref="imageInput"
                  accept="image/*"
                  @change="onImageSelected"
                >
                <img :src="imageUrl" height="200" v-if="imageUrl">
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  outline
                  v-model="description"
                  name="description"
                  label="Description"
                  id="description"
                  multi-line
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row class="mb-2">
              <v-flex xs12>
                <h3>Choose a Date & Time</h3>
                <v-dialog
                  ref="date"
                  v-model="datemodal"
                  :return-value.sync="date"
                  persistent
                  lazy
                  full-width
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="date"
                      label="Date"
                      prepend-icon="event"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="date" scrollable show-current>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="datemodal = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.date.save(date)">OK</v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <v-dialog
                  ref="time"
                  v-model="timemodal"
                  :return-value.sync="time"
                  persistent
                  lazy
                  full-width
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="time"
                      label="Time"
                      prepend-icon="access_time"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker v-if="timemodal" v-model="time" full-width>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="timemodal = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.time.save(time)">OK</v-btn>
                  </v-time-picker>
                </v-dialog>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs12 class="text-xs-center">
                <v-btn class="info" block :disabled="!formIsValid" type="submit">Create Meetup</v-btn>
              </v-flex>
            </v-layout>
          </form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      date: '',
      time: '',
      datemodal: false,
      timemodal: false,
      title: '',
      location: '',
      imageUrl: '',
      imageName: '',
      description: '',
      image: null
    };
  },
  computed: {
    formIsValid() {
      return (
        this.title !== '' &&
        this.location !== '' &&
        this.imageUrl !== '' &&
        this.description !== '' &&
        this.date !== '' &&
        this.time !== ''
      );
    }
  },
  methods: {
    submitNewMeetUp() {
      if (!this.formIsValid) {
        return;
      }
      if (!this.image) {
        return;
      }
      const meetupData = {
        title: this.title,
        location: this.location,
        image: this.image,
        description: this.description,
        date: this.date,
        time: this.time
      };
      // sending the data to the createmeetup action inside store.js
      this.$store.dispatch('createMeetUp', meetupData);
      // automatic navigate to meetups page after create is success
      this.$router.push('/meetups');
    },
    imageUpload() {
      this.$refs.imageInput.click();
    },
    onImageSelected(event) {
      const files = event.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf('.') <= 0) {
          return alert('Please add a valid file!');
        }

        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener('load', () => {
          this.imageUrl = fr.result;
          this.image = files[0]; // this is an image file that can be sent to server...
        });
      }
    }
  }
};
</script>
