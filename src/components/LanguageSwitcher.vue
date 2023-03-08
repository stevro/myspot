<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="fullScreen"
    :width="fullScreen ? '100%': 'auto'"
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ props }">

      <v-list-item
        active-color="white"
        prepend-icon="mdi-translate"
        v-bind="props"
      >
        <v-list-item-title>{{ $t('sidebar.language_switch') }}</v-list-item-title>
      </v-list-item>

    </template>
    <v-card theme="light">
      <v-toolbar
        class="bg-blue-darken-3"
      >
        <v-toolbar-title>{{ $t('languageSwitcher.title') }}</v-toolbar-title>

        <v-toolbar-items>
          <v-btn
            icon="mdi-close"
            @click="closeDialog"
          ></v-btn>

        </v-toolbar-items>
      </v-toolbar>

      <v-list>
        <v-list-item v-for="language in languages"
                     :key="language.id"
                     @click="changeLanguage(language)"
        >
          <template v-slot:prepend>
            <span :class="'fi fi-'+language.flag + ' mr-5'"></span>
          </template>
          <v-list-item-title>{{ language.title }}</v-list-item-title>
        </v-list-item>
      </v-list>

    </v-card>
  </v-dialog>
</template>

<script setup>

import {computed, ref} from "vue";
import {useUserStore} from "@/stores/user";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { useDisplay } from 'vuetify'
import {useAuthenticationStore} from "@/stores/auth";

const dialog = ref(false)

const userStore = useUserStore()
const authStore = useAuthenticationStore()
const { mobile } = useDisplay()

const fullScreen = computed(function(){
  return mobile.value === true
})

const languages =
  [
    {
      id: 'en',
      title: 'English',
      flag: 'gb',
    },
    {
      id: 'ro',
      title: 'Română',
      flag: 'ro',
    }
  ]

function changeLanguage(language) {
  userStore.changeUserLocale(authStore.token, language.id).then(function(){
    console.log('Language changed successfully')
  }).catch(function(e){
    console.error(e)
  })
  closeDialog()
}

function closeDialog() {
  dialog.value = false;
}

</script>

<style scoped>

</style>
