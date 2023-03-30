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
          <strong>{{ appName }}</strong> with &hearts; since 2023
        </v-col>
        <v-col class="text-center" cols="6">
          <v-btn color="white" size="small" density="compact" variant="text" :to="{'name':'privacy-policy'}" target="_blank">Privacy
            policy
          </v-btn>
        </v-col>
        <v-col  cols="6">
          <v-btn color="white" size="small" density="compact" variant="text" :to="{'name':'terms-of-service'}" target="_blank">Terms and conditions
          </v-btn>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script setup>

const appName = import.meta.env.VITE_APP_NAME

</script>

