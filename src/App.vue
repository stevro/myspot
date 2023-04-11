<script setup>
import {RouterView} from 'vue-router'
import i18n from "@/plugins/i18n";
import {useUserStore} from "@/stores/user";
import {useFirebaseStore} from "@/stores/firebase";
import {doc, setDoc} from "firebase/firestore";

import {inject} from "vue";

const firebase = inject('firebase')
const firestore = inject('firestore')
const firebaseStore = useFirebaseStore()
const userStore = useUserStore()

i18n.global.locale = userStore.locale
document.documentElement.setAttribute('lang', userStore.locale);

userStore.$subscribe(function (mutation, state) {
  i18n.global.locale = state.locale
  document.documentElement.setAttribute('lang', userStore.locale);

  if (userStore.id) {
    firebaseStore.init(firebase)
  }

})

firebaseStore.$subscribe(function (mutation, state) {
  if (!userStore.id || !state.token) {
    return
  }

  setDoc(doc(firestore, "fcm_tokens", state.token), {
    'userId': userStore.id
  }).then(r => {
    console.log('FCM Token saved')
  }).catch((e) => {
    console.error('Error saving FCM token', e)
  });

})

</script>

<template>
  <RouterView/>
</template>

<style scoped>

</style>
<style>
.yale-background{
    background-image: linear-gradient(310deg,#141727,#3a416f)!important;
    color: white!important;
}
</style>