<template>
  <v-container>

    <v-row justify="center" align="center">
      <v-col cols="12" md="6">
        <v-form @submit.prevent="register()" ref="loginForm">

          <v-row>
            <v-col cols="12" class="text-center">
              <h3>Register if you are sure you don't have facebook!</h3>
            </v-col>
            <v-col cols="12">
              <v-text-field variant="underlined" prepend-icon="mdi-account" v-model="displayName"
                            :label="t('login.display_name')"
                            :rules="[v => !!v || 'Is required']"
                            v-on:keyup.enter="register()"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field variant="underlined" prepend-icon="mdi-email" v-model="email"
                            :label="t('login.email')"
                            :rules="[v => !!v || 'Is required']"
                            v-on:keyup.enter="register()"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field variant="underlined" prepend-icon="mdi-key" type="password" v-model="password"
                            :label="t('login.password')"
                            :rules="[v => !!v || 'Is required']"
                            v-on:keyup.enter="register()"

              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field variant="underlined" prepend-icon="mdi-key" type="password" v-model="repeatPassword"
                            :label="t('login.password_repeat')"
                            :rules="[v => !!v || 'Is required']"
                            v-on:keyup.enter="register()"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn variant="flat" color="accent" block @click="register()">Register</v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn variant="text" size="small" block :to="{name:'login'}">Go to login</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {ref} from "vue";
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import {useI18n} from "vue-i18n";
import router from "@/router";
import {useAuthenticationStore} from "@/stores/auth";
import {useUserStore} from "@/stores/user";

const {t} = useI18n()
const displayName = ref()
const email = ref()
const password = ref()
const repeatPassword = ref()
const authStore = useAuthenticationStore()
const userStore = useUserStore()
const auth = getAuth();

function register() {

  if (password.value !== repeatPassword.value) {
    return false;
  }

  createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        authStore.authenticate(user)
        userStore.setUser(user)

        router.push({'name': 'dashboard'})
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });

}


</script>

<style scoped>

</style>