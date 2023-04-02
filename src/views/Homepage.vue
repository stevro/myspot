<template>


  <v-app id="my-spot-app">
    <v-app-bar
        prominent
        class=" bg-blue-darken-1"
    >
      <v-app-bar-title class="pl-md-10">My Spot</v-app-bar-title>

      <template v-slot:append>

        <v-btn color="white" icon="mdi-magnify" class="mr-md-10">Login</v-btn>

      </template>

    </v-app-bar>

    <section>
      <v-parallax
          src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
      >
        <div class="d-flex flex-column fill-height justify-center align-center text-white">
          <h1 class="text-h4 font-weight-thin mb-4">
            The best app for finding cool events
          </h1>
          <h4 class="subheading">
            Book your spot today!
          </h4>
        </div>
      </v-parallax>
    </section>
    <section class="d-flex flex-column fill-height justify-center align-center text-center ">

      <v-row>
        <v-col cols="12">
          <h1>The best way to find amazing local events!</h1>
          <h5>No restrictions, no limits</h5>
        </v-col>
      </v-row>

    </section>


    <section>
      <v-card class="text-center">
        <v-card-text>
          <v-icon>mdi-world</v-icon>
        </v-card-text>
        <v-card-title>Get in touch with your community</v-card-title>
        <v-card-text>
          Join events created by people in your community! Go out and start enjoying your favourite activities.
        </v-card-text>
      </v-card>
    </section>

  </v-app>


</template>

<script setup>

</script>

<style scoped>

</style>
