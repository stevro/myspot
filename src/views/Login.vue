<template>

  <v-container class="fill-height">


    <v-responsive class="d-flex align-center text-center fill-height">
      <v-row justify="center">
        <v-col cols="12" lg="4" sm="6">
          <h1>{{ $t('login.welcome') }}</h1>
        </v-col>
        <v-col cols="12" lg="4" sm="6">

            <v-btn variant="flat" prepend-icon="mdi-facebook" @click="signIn">Sign in</v-btn>

        </v-col>
      </v-row>


    </v-responsive>
  </v-container>
</template>


<script setup>

import {useI18n} from 'vue-i18n'
import {FacebookAuthProvider, getAuth, onAuthStateChanged, signInWithRedirect} from "firebase/auth";
import {inject} from "vue";
import {useAuthenticationStore} from "@/stores/auth";
import {useUserStore} from "@/stores/user";
import router from "@/router";

const {t} = useI18n()
const authStore = useAuthenticationStore()
const userStore = useUserStore()
const firebase = inject('firebase')

const provider = new FacebookAuthProvider();
provider.addScope('public_profile');
provider.addScope('email');
// provider.addScope('user_friends');
const auth = getAuth();

auth.useDeviceLanguage();

function signIn() {
  signInWithRedirect(auth, provider)
//   signInWithPopup(auth, provider)
//       .then((result) => {
//         // The signed-in user info.
//         const user = result.user;
//
//         // This gives you a Facebook Access Token. You can use it to access the Facebook API.
//         const credential = FacebookAuthProvider.credentialFromResult(result);
//         const accessToken = credential.accessToken;
// console.log(credential)
//         // IdP data available using getAdditionalUserInfo(result)
//         // ...
//       })
//       .catch((error) => {
//         // Handle Errors here.
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         // The email of the user's account used.
//         const email = error.customData.email;
//         // The AuthCredential type that was used.
//         const credential = FacebookAuthProvider.credentialFromError(error);
// console.log(error)
//         // ...
//       });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    // console.log(user);

    authStore.authenticate(user)
    userStore.setUser(user)

    router.push({name: 'dashboard'})
  } else {
    authStore.clearAuthToken()
    userStore.clearUserData()
    router.push({'name': 'login'})
  }
});

</script>

<style scoped>

</style>
