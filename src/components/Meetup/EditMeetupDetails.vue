<template>
  <v-dialog width="500px" persistent v-model="editDialog">
    <v-btn accent slot="activator" class="info">
      <v-icon>edit</v-icon>
      <h5>Edit Details</h5>
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>
              <h2>Edit Details</h2>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>
              <!-- Title -->
              <v-text-field
                outline
                name="title"
                label="Title"
                id="title"
                v-model="editedtitle"
                required
                :rules="[() => editedtitle.length > 0 || 'Please insert a title']"
              ></v-text-field>
              <!-- Description -->
              <v-text-field
                outline
                name="description"
                label="Description"
                id="description"
                v-model="editedDescription"
                multi-line
                required
              ></v-text-field>
              <!-- Date -->
              <v-dialog
                ref="date"
                v-model="datemodal"
                :return-value.sync="editedDate"
                persistent
                lazy
                full-width
                width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="editedDate"
                    label="Date"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="editedDate" scrollable show-current>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="datemodal = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.date.save(editedDate)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
              <!-- Time -->
              <v-dialog
                ref="time"
                v-model="timemodal"
                :return-value.sync="editedTime"
                persistent
                lazy
                full-width
                width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="editedTime"
                    label="Time"
                    prepend-icon="access_time"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker v-if="timemodal" v-model="editedTime" full-width>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="timemodal = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.time.save(editedTime)">OK</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-action>
              <v-btn flat class="info" @click="editDialog = false">Close</v-btn>
              <v-btn flat class="info" @click="onSaveChanges">Save</v-btn>
            </v-card-action>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['meetup'],
  data() {
    return {
      editDialog: false,
      editedtitle: this.meetup.title,
      editedDescription: this.meetup.description,
      editedDate: this.meetup.date,
      editedTime: this.meetup.time,
      datemodal: false,
      timemodal: false
    };
  },
  methods: {
    onSaveChanges() {
      // check see whether is it empty inside the content of title and description
      if (
        this.editedtitle.trim() === '' ||
        this.editedDescription.trim() == ''
      ) {
        return;
      }
      this.editDialog = false;
      this.$store.dispatch('updateMeetupData', {
        id: this.meetup.id,
        title: this.editedtitle,
        description: this.editedDescription,
        date: this.editedDate,
        time: this.editedTime
      });
    }
  }
};
</script>
