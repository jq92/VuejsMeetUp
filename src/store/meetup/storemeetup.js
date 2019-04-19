import * as firebase from 'firebase';

export default {
  state: {
    loadedMeetUps: [
      {
        imageUrl:
          'https://farm4.staticflickr.com/3840/14625650018_fe95e6264a_b.jpg',
        id: '1',
        title: 'Maldives Party',
        date: '2018-02-18',
        time: '13.00',
        location: 'Maldives',
        description: 'test'
      },
      {
        imageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/0/03/Visuel-carrousel-dossier-Ou-sortir-le-soir-a-Paris-%D9%86%D9%85%D8%A7740x380-C-DR.jpg',
        id: '2',
        title: 'Paris Party',
        date: '2018-03-18',
        time: '11.00',
        location: 'Paris',
        description: 'test'
      },
      {
        imageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Tower_Bridge_London_Feb_2006.jpg/1024px-Tower_Bridge_London_Feb_2006.jpg',
        id: '3',
        title: 'Meetup in London',
        date: '2018-03-24',
        time: '20.00',
        location: 'London',
        description: 'test'
      }
    ]
  },
  mutations: {
    //, Set the state content equals to the data that is fetch from the firebase
    setLoadedMeetups(state, payload) {
      state.loadedMeetUps = payload;
    },
    // add the newly created meetup to the array in state, assuming those data are in object format
    createMeetUp(state, payload) {
      state.loadedMeetUps.push(payload);
    },
    // update the meetup that has changes
    updateMeetup(state, payload) {
      // search for the meetup that has changes
      const meetup = state.loadedMeetUps.find(meetup => {
        return meetup.id === payload.id;
      });

      if (payload.title) {
        meetup.title = payload.title;
      }
      if (payload.description) {
        meetup.description = payload.description;
      }
      if (payload.date) {
        meetup.date = payload.date;
      }
      if (payload.time) {
        meetup.time = payload.time;
      }
    }
  },
  actions: {
    // fetch the data from the firebase
    loadedMeetUps({ commit }) {
      commit('setLoading', true);
      firebase
        .database()
        .ref('meetups')
        .once('value')
        .then(data => {
          const meetups = [];
          // val() gives access to the data value inside firebase
          const obj = data.val();
          // Looping through the data according to the keys
          for (let key in obj) {
            // push all the details inside each data into the array that create just now
            meetups.push({
              id: key,
              title: obj[key].title,
              location: obj[key].location,
              imageUrl: obj[key].imageUrl,
              description: obj[key].description,
              date: obj[key].date,
              time: obj[key].time,
              creatorId: obj[key].creatorId
            });
          }
          // pass it to mutation setloadedmeetups
          commit('setLoadedMeetups', meetups);
          commit('setLoading', false);
        })
        .catch(error => {
          console.log(error);
          commit('setLoading', true);
        });
    },
    // organize the data from newly created meetup into object format. the purpose of this action is to just pass the data we wanted to the array in state. send it to the firebase as well as the state in store.js
    createMeetUp({ commit, getters }, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date,
        time: payload.time,
        // get the user unique id and store in creator id
        creatorId: getters.user.id
      };
      let imageUrl;
      let key;
      // Reach out and store data to firebase server(this is a asynchronous task, only action can handle this type of task)
      firebase
        .database()
        .ref('meetups')
        .push(meetup)
        .then(data => {
          // Retrieve the unique key id of the meetup just created
          key = data.key;

          return key;
        })
        .then(key => {
          // sending the uploaded image to firebase storage
          const filename = payload.image.name;
          const ext = filename.slice(filename.lastIndexOf('.'));
          return firebase
            .storage()
            .ref('meetups/' + key + '.' + ext)
            .put(payload.image);
        })
        .then(fileData => {
          // Retrieve the download path of the image inside firebase storage
          let imagePath = fileData.metadata.fullPath;
          return firebase
            .storage()
            .ref()
            .child(imagePath)
            .getDownloadURL()
            .then(url => {
              // store the image url into a variable
              imageUrl = url;
              // console.log('File available at', url);
              // update the imageUrl inside firebase database
              return firebase
                .database()
                .ref('meetups')
                .child(key)
                .update({ imageUrl: imageUrl });
            });
        })
        .then(() => {
          // Reach out to state and store it if storing to firebase is success
          commit('createMeetUp', {
            ...meetup,
            imageUrl: imageUrl,
            id: key
          });
        })
        .catch(error => {
          console.timeLog(error);
        });
    },
    // send the updated information from meetup edit page to firebase as well as the state in store.js
    updateMeetupData({ commit }, payload) {
      commit('setLoading', true);
      const updateObj = {};
      if (payload.title) {
        updateObj.title = payload.title;
      }
      if (payload.description) {
        updateObj.description = payload.description;
      }
      if (payload.date) {
        updateObj.date = payload.date;
      }
      if (payload.time) {
        updateObj.time = payload.time;
      }
      // This is only update the information inside firebase database if there are changes, else it wont overwrite other data
      firebase
        .database()
        .ref('meetups')
        .child(payload.id)
        .update(updateObj)
        .then(() => {
          commit('setLoading', false);
          // update the information in state as well
          commit('updateMeetup', payload);
        })
        .catch(error => {
          console.log(error);
          commit('setLoading', false);
        });
    }
  },
  getters: {
    loadedMeetUps(state) {
      // return a new array of meetup location and display them in a date descending order
      return state.loadedMeetUps.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date;
      });
    },
    // take few of the meetup location to display it on the carousel
    featuredMeetUps(state, getters) {
      return getters.loadedMeetUps.slice(0, 5);
    },
    // fetch all the data of a specific meetup by using the meetup id passed from meetup.vue and deliver it back
    loadedMeetUp(state) {
      return meetupId => {
        return state.loadedMeetUps.find(meetup => {
          return meetup.id === meetupId;
        });
      };
    }
  }
};
