import store from '../store/store.js';

export default (to, from, next) => {
  // check if there's a user that is login in the store.js
  if (store.getters.user) {
    next();
  } else {
    // if there's no user, it will redirect to sign in page
    next('/signin');
  }
};
