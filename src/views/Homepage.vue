<template>


  <v-app id="my-spot-app">
    <v-app-bar
        prominent
        class=" bg-blue-darken-1"
    >
      <v-app-bar-title class="pl-md-10">My Spot</v-app-bar-title>

      <template v-slot:append>

        <v-btn :to="{name:'login'}" color="white" variant="text" icon="mdi-magnify" class="mr-md-10">Login</v-btn>

      </template>

    </v-app-bar>


      <section>
        <v-parallax
            src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
        >
          <div class="d-flex flex-column fill-height justify-center align-center text-white">
            <h1 class="text-h4 font-weight-thin mb-4">
              The best app for finding cool activities and events
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


      <section class="bg-white">
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="text-center">
              <v-card-text>
                <v-icon>mdi-earth</v-icon>
              </v-card-text>
              <v-card-title>Get in touch with your community</v-card-title>
              <v-card-text>
                Join events created by people in your community! Go out and start enjoying your favourite activities.
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="text-center">
              <v-card-text>
                <v-icon>mdi-emoticon-outline</v-icon>
              </v-card-text>
              <v-card-title>Find what you like</v-card-title>
              <v-card-text>
                What's your hobby? Biking, hiking or playing football? Find who has an extra spot and join them.
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="text-center">
              <v-card-text>
                <v-icon>mdi-account-group-outline</v-icon>
              </v-card-text>
              <v-card-title>Reach to your community</v-card-title>
              <v-card-text>
                If you are more of an organizer and in search of participants, post them here and let other people book
                a spot
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>


      </section>

    <v-footer class="bg-blue-darken-3 text-center d-flex flex-column">
      <v-row justify="center" no-gutters>
        <v-col class="text-center mt-4" cols="12">
          <strong>&copy; {{ appName }}</strong> with &hearts; since 2023
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

<style scoped>

</style>
