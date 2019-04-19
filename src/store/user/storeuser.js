import * as firebase from 'firebase';
// import { pathToFileURL } from 'url';

export default {
  state: {
    user: null
  },
  mutations: {
    registerUserForMeetup(state, payload) {
      // extract the id that user register for from payload
      const id = payload.id;
      if (
        // check whether the user is register for this meetup in state
        state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0
      ) {
        return;
      }
      // if not register, it will push the meetup.id into state registeredMeetups
      state.user.registeredMeetups.push(id);
      // this is a value attach with the above id(which is a key)
      //This is for unregister meetup purpose according to this fbkey
      state.user.fbKeys[id] = payload.fbKey;
    },
    unregisterUserForMeetup(state, payload) {
      const registeredMeetups = state.user.registeredMeetups;
      // find and match the meetup.id that the user want to unregister using splice
      registeredMeetups.splice(
        registeredMeetups.findIndex(meetup => meetup.id === payload),
        1
      );
      //using Javascript reflect API for deleting the fbkey store in state that is attach with the meetup user want unregister
      Reflect.deleteProperty(state.user.fbKeys, payload);
    },
    // add the new sign up user into the state according to the format
    setUser(state, payload) {
      state.user = payload;
    }
  },
  actions: {
    registerUserForMeetup({ commit, getters }, payload) {
      commit('setLoading', true);
      // retrieve the user.id from getters
      const user = getters.user;
      // storing the registered users into firebase storage as a record
      // create the folder first if it is not exist
      firebase
        .database()
        // using user.id as a identifier so that able to store some user specific data below that id node
        .ref('/users/' + user.id)
        .child('/registrations/')
        // payload over here is referring to the meetup.id that wanted to be register
        .push(payload)
        .then(data => {
          commit('setLoading', false);
          // run mutation, arguments are the meetup.id and registration id firebase created for us
          commit('registerUserForMeetup', { id: payload, fbKey: data.key });
        })
        .catch(error => {
          console.log(error);
          commit('setLoading', false);
        });
    },
    unregisterUserForMeetup({ commit, getters }, payload) {
      commit('setLoading', true);
      // retrieve the user.id from getters
      const user = getters.user;
      // check if user has firebase key
      if (!user.fbKeys) {
        return;
      }
      // get the firebase key of the meetup that user want to unregister
      const fbKey = user.fbKeys[payload];
      // remove the meetup according to the firebase key
      firebase
        .database()
        .ref('/users/' + user.id + '/registrations/')
        .child(fbKey)
        .remove()
        .then(() => {
          commit('setLoading', false);
          // if success commit this mutation
          commit('unregisterUserFromMeetup', payload);
        })
        .catch(() => {
          console.log(error);
          commit('setLoading', false);
        });
    },
    signUp({ commit }, payload) {
      // perform the mutation set loading because no matter user success sign up or not it will always display loading
      commit('setLoading', true);
      firebase
        .auth()
        // passing the email and password fetch from the signup page and send to the firebase
        .createUserWithEmailAndPassword(payload.email, payload.password)
        //if success, get the unique id from the firebase and set it on the format that is same as state
        .then(response => {
          // set loading in the state back to false because is already succeed
          commit('setLoading', false);
          commit('clearError');
          const newUser = {
            id: response.user.uid,
            registeredMeetups: [],
            fbKeys: {}
          };
          commit('setUser', newUser);
        })
        // if got error
        .catch(error => {
          // set loading in the state back to false because there's a error occur
          commit('setLoading', false);
          // perform the mutation of setError to display the error
          commit('setError', error);
          console.log(error);
        });
    },
    logIn({ commit }, payload) {
      // perform the mutation set loading because no matter user success sign in or not it will always display loading
      commit('setLoading', true);
      firebase
        .auth()
        // sending the user email and password to the firebase for matchmaking in order to login
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then(response => {
          // set loading in the state back to false because is already succeed
          commit('setLoading', false);
          commit('clearError');
          const newUser = {
            id: response.user.uid,
            registeredMeetups: [],
            fbKeys: {}
          };
          commit('setUser', newUser);
        }) // if got error
        .catch(error => {
          // set loading in the state back to false because there's a error occur
          commit('setLoading', false);
          // perform the mutation of setError to display the error
          commit('setError', error);
          console.log(error);
        });
    },
    autoLogIn({ commit }, payload) {
      commit('setUser', { id: payload.uid, registeredMeetups: [], fbKeys: {} });
    },
    // fetch other information(register meetup) that belong the user once user are login
    fetchUserData({ commit, getters }) {
      commit('setLoading', true);
      firebase
        .database()
        .ref('/users/' + getters.user.id + '/registrations/')
        .once('value')
        .then(data => {
          // retrieve the data using val() that transform into javascript data
          const dataPairs = data.val();
          let registeredMeetups = [];
          let swappedPairs = {};
          // loop those all the data and store the meetup id into registeredMeetups
          for (let key in dataPairs) {
            // the format store in here is registration id : meetup
            registeredMeetups.push(dataPairs[key]);
            // swap the format to meetup: registration id
            swappedPairs[dataPairs[key]] = key;
          }
          const updatedUser = {
            id: getters.user.id,
            registeredMeetups: registeredMeetups,
            fbKeys: swappedPairs
          };
          // store it on the user that login
          commit('setLoading', false);
          commit('setUser', updatedUser);
        })
        .catch(error => {
          console.log(error);
          commit('setLoading', false);
        });
    },
    logout({ commit }, state) {
      // logout from firebase as well
      firebase.auth().signOut();
      // firebase.database().goOffline();
      // set back the user in state to null
      commit('setUser', null);
    }
  },
  getters: {
    // return the user data to the state user
    user(state) {
      return state.user;
    }
  }
};
