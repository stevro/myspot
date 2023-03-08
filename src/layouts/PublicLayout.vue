<template>
  <v-app id="my-spot-app">
    <v-app-bar
        prominent
        class=" bg-blue-darken-1"
    >

    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>

    <v-footer class="bg-blue-darken-3 text-center d-flex flex-column">
      <v-row justify="center" no-gutters>
        <v-col class="text-center mt-4" cols="12">
          <strong>{{appName}}</strong> - {{ new Date().getFullYear() }}
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script setup>

const appName = import.meta.env.VITE_APP_NAME

</script>

