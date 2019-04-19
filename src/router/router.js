import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Meetups from '@/components/Meetup/Meetups';
import Meetup from '@/components/Meetup/Meetup';
import CreateMeetup from '@/components/Meetup/CreateMeetup';
// import Profile from '@/components/User/Profile';
import Signin from '@/components/User/Signin';
import Signup from '@/components/User/Signup';
import AuthGuard from './authGuard';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/meetups',
      name: 'Meetups',
      component: Meetups
    },
    {
      path: '/meetups/new',
      name: 'CreateMeetup',
      component: CreateMeetup,
      //this is a guard for preventing user access this page without login
      beforeEnter: AuthGuard
    },
    {
      // sending the id of the specific meetup in order to display the data
      path: '/meetups/:id',
      name: 'Meetup',
      props: true,
      component: Meetup
    },
    // {
    //   path: '/profile',
    //   name: 'Profile',
    //   component: Profile,
    //   //this is a guard for preventing user access this page without login
    //   beforeEnter: AuthGuard
    // },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    }
  ]
});
