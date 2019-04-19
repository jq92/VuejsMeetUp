<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="primary--text">LOGIN</h1>
      </v-flex>
    </v-layout>
    <v-layout row v-if="error">
      <v-flex xs12 sm6 offset-sm3>
        <!-- This is a component that is set globally in main.js -->
        <app-alert @close="closeAlert" :text="error.message"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-container>
              <form @submit.prevent="logIn">
                <!-- email -->
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="email"
                      label="E-mail"
                      id="email"
                      v-model="email"
                      type="email"
                      required
                      :rules="[() => email.length > 0 || 'Please insert your email']"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <!-- password -->
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="password"
                      label="Password"
                      id="password"
                      v-model="password"
                      type="password"
                      required
                      :rules="[() => password.length > 0 || 'Please insert your password']"
                    ></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <!-- subbmit button -->
                  <v-flex xs12>
                    <v-btn
                      type="submit"
                      :disabled="loading"
                      :loading="loading"
                      @click="loader = 'loading'"
                    >
                      Log In
                      <template v-slot:loader>
                        <span class="custom-loader">
                          <v-icon light>cached</v-icon>
                        </span>
                      </template>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    logIn() {
      // send the login data to the action inside store.js
      this.$store.dispatch('logIn', {
        email: this.email,
        password: this.password
      });
    },
    // for closing the alert
    closeAlert() {
      // perform the clearError action that is set inside store.js
      this.$store.dispatch('clearError');
    }
  },
  computed: {
    user() {
      // send the user data to the getter in store.js
      return this.$store.getters.user;
    },
    error() {
      // being the bridge that connect the authError status whether got change or not inside store.js State
      return this.$store.getters.error;
    },
    loading() {
      return this.$store.getters.loading;
    }
  },
  watch: {
    // watch the user whenever the getter get a new state
    user(value) {
      if (value !== null && value !== undefined) {
        // redirect to the homepage once register is done
        this.$router.push('/');
      }
    }
  }
};
</script>


<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
