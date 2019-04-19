import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';
import colors from 'vuetify/es5/util/colors';

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: '#557a95',
    secondary: colors.grey.lighten3,
    info: '#b1a296',
    error: '#b71c1c'
  }
});
