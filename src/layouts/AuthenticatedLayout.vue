<template>
  <v-app id="my-spot-app">

    <v-navigation-drawer v-model="drawer"
                         class="bg-blue-darken-3"

    >

      <side-menu :items="items"></side-menu>

      <template v-slot:append>

        <div class="pa-2">
          <v-btn block @click="logout()">
            {{ $t('sidebar.logout') }}
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>App</v-toolbar-title>


    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>

  </v-app>
</template>

<script setup>
import {inject, ref} from 'vue'
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {useAuthenticationStore} from "@/stores/auth";
import {useUserStore} from "@/stores/user";
import router from "@/router";
import SideMenu from "@/components/SideMenu.vue";
import {useDisplay} from "vuetify";

const authStore = useAuthenticationStore()
const userStore = useUserStore()
const firebase = inject('firebase')
const auth = getAuth();

auth.useDeviceLanguage();
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

function logout() {
  auth.signOut()
}

const {mobile} = useDisplay()
const drawer = ref(mobile.value !== true)


const items = [
  {
    props: {
      prependIcon: 'mdi-view-dashboard',
    },
    title: 'sidebar.dashboard',
    href: {'name': 'dashboard'},
    active: true,
  },
  // {
  //   props: {
  //     prependIcon: 'mdi-account-box',
  //   },
  //   title: 'sidebar.profile',
  //   href: {'name': 'profile'},
  //   active: false,
  // },
];


</script>

