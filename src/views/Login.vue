<template>

  <v-container class="fill-height">


    <v-responsive class="d-flex align-center text-center fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" lg="4" md="4" sm="6" >
          <v-img src="../assets/img/logo-no-background.png"></v-img>
        </v-col>
        <v-col cols="1" class="d-none d-md-flex justify-center" style="height: 300px" >
          <v-divider vertical></v-divider>
        </v-col>

        <v-col cols="12" lg="4" sm="6">

          <v-row>
            <v-col cols="12">
              <h3>Modern sign in with</h3>
            </v-col>
            <v-col cols="12">
              <v-btn variant="flat" block prepend-icon="mdi-facebook" @click="signIn('facebook')">Facebook</v-btn>
            </v-col>

          </v-row>

          <v-form @submit.prevent="signIn('email')" ref="loginForm">
            <v-row>
              <v-col cols="12">
                <h3>or use</h3>
              </v-col>
              <v-col cols="12">
                <v-text-field variant="underlined" prepend-icon="mdi-email" v-model="email"
                              :label="t('login.email')"
                              :rules="[v => !!v || 'Is required']"
                              v-on:keyup.enter="signIn('email')"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field variant="underlined" prepend-icon="mdi-key" type="password" v-model="password"
                              :label="t('login.password')"
                              :rules="[v => !!v || 'Is required']"
                              v-on:keyup.enter="signIn('email')"
                              autocomplete="current-password"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn variant="flat" color="accent" block @click="signIn('email')">go old men mode</v-btn>
              </v-col>
                          <v-col cols="12">
                            <v-btn variant="text" size="small" block :to="{name:'register'}">No account? Register!</v-btn>
                          </v-col>
            </v-row>
          </v-form>

        </v-col>
      </v-row>


    </v-responsive>
  </v-container>
</template>


<script setup>

import {useI18n} from 'vue-i18n'
import {
  FacebookAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithRedirect,
  connectAuthEmulator
} from "firebase/auth";
import {inject, ref} from "vue";
import {useAuthenticationStore} from "@/stores/auth";
import {useUserStore} from "@/stores/user";
import router from "@/router";
import {useFirebaseStore} from "@/stores/firebase";

const {t} = useI18n()
const authStore = useAuthenticationStore()
const userStore = useUserStore()
const firebase = inject('firebase')

const loginForm = ref(null)
const email = ref('')
const password = ref('')

const provider = new FacebookAuthProvider();
provider.addScope('public_profile');
provider.addScope('email');
// provider.addScope('user_friends');
const auth = getAuth();
const firebaseStore = useFirebaseStore()

// if(process.env.NODE_ENV !== "production") {
//   connectAuthEmulator(auth, "http://localhost:9099");
// }

auth.useDeviceLanguage();


async function signIn(providerType) {

  if (providerType === 'email') {
    if(true === await isLoginFormValid()){

      await signInWithEmailAndPassword(auth, email.value, password.value)
    }
  } else {
    await signInWithRedirect(auth, provider)
  }

}

onAuthStateChanged(auth, (user) => {

  if (user) {
    // console.log(user);

    authStore.authenticate(user)
    userStore.setUser(user)

    router.push({'name': 'dashboard'})
  } else {
    authStore.clearAuthToken()
    userStore.clearUserData()
    firebaseStore.clearFirebaseToken()

    router.push({'name': 'login'})
  }
});

async function isLoginFormValid() {
  const {valid} = await loginForm.value.validate()

  return valid;
}

</script>

<style scoped>

</style>
