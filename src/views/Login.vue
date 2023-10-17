<template>

  <v-container class="fill-height">


    <v-responsive class="d-flex align-center text-center fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" lg="4" md="4" sm="6">
          <v-img src="../assets/img/logo-no-background.png"></v-img>
        </v-col>
        <v-col cols="1" class="d-none d-md-flex justify-center" style="height: 300px">
          <v-divider vertical></v-divider>
        </v-col>

        <v-col cols="12" lg="4" sm="6">

          <v-row>
            <v-col cols="12">
              <h3>Modern sign in with</h3>
            </v-col>
            <v-col cols="12">
              <v-btn :loading="isSubmittingModernAuth" variant="flat" block prepend-icon="mdi-google"
                     @click="signIn('google')">Google
              </v-btn>
            </v-col>
<!--            <v-col cols="12">-->
<!--              <v-btn :loading="isSubmittingModernAuth" variant="flat" block prepend-icon="mdi-facebook"-->
<!--                     @click="signIn('facebook')">Facebook-->
<!--              </v-btn>-->
<!--            </v-col>-->

          </v-row>

          <v-form @submit.prevent="signIn('email')" ref="loginForm">
            <v-row>
              <v-col cols="12">
                <h3>or use</h3>
              </v-col>

              <v-col cols="12" v-if="hasLoginErrors">
                <v-alert type="error" density="compact">{{ loginError }}</v-alert>
              </v-col>

              <v-col cols="12">
                <v-text-field variant="underlined" prepend-icon="mdi-email" v-model="email"
                              type="email"
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
                <v-btn :loading="isSubmittingEmailAuth" variant="flat" color="accent" block @click="signIn('email')">go old men
                  mode
                </v-btn>
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
  GoogleAuthProvider,
  FacebookAuthProvider,
  getAuth,
  getRedirectResult,
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
const isSubmittingEmailAuth = ref(false)
const isSubmittingModernAuth = ref(false)

const googleProvider = new GoogleAuthProvider()

const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('public_profile');
facebookProvider.addScope('email');
// facebookProvider.addScope('user_friends');
const auth = getAuth();
const firebaseStore = useFirebaseStore()
const hasLoginErrors = ref(false)
const loginError = ref('')
if(!import.meta.env.PROD) {
  connectAuthEmulator(auth, "http://localhost:9099");
}

auth.useDeviceLanguage();


async function signIn(providerType) {


  hasLoginErrors.value = false;
  loginError.value = '';

  if (providerType === 'email') {
    isSubmittingEmailAuth.value = true;
    if (true === await isLoginFormValid()) {

      signInWithEmailAndPassword(auth, email.value, password.value).then(function (userCred) {
        //signed in
        isSubmittingEmailAuth.value = false;

        authStore.authenticate(userCred.user)
        userStore.setUser(userCred.user)

        router.push({'name': 'dashboard'})

      }).catch(function (error) {
        console.error(error)
        hasLoginErrors.value = true;
        loginError.value = 'Invalid credentials'
        isSubmittingEmailAuth.value = false;

      })
    } else {
      hasLoginErrors.value = true;
      isSubmittingEmailAuth.value = false
    }
  } else if(providerType === 'facebook') {
    isSubmittingModernAuth.value = true;
    await signInWithRedirect(auth, facebookProvider)
    const result = await getRedirectResult(auth);

    isSubmittingModernAuth.value = false

    if (result) {
      // This is the signed-in user
      const user = result.user;

      authStore.authenticate(user)
      userStore.setUser(user)

      router.push({'name': 'dashboard'})
    }
  } else if(providerType === 'google'){
    isSubmittingModernAuth.value = true;
    await signInWithRedirect(auth, googleProvider)
    const result = await getRedirectResult(auth);

    isSubmittingModernAuth.value = false

    if(result) {
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;

      const user = result.user;

      authStore.authenticate(user)
      userStore.setUser(user)

      router.push({'name': 'dashboard'})
    }

  } else{
    console.error('Unknown auth provider ' + providerType)
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
