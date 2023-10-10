<template>
  <v-container>

    <v-row justify="center" align="center">
      <v-col cols="12" md="6">
        <v-form @submit.prevent="register()" ref="loginForm">

          <v-row>
            <v-col cols="12" class="text-center">
              <h3>{{t('register.main_message')}}</h3>
            </v-col>

            <v-col cols="12" v-if="hasRegisterErrors">
              <v-alert type="error" density="compact">{{registerError}}</v-alert>
            </v-col>

            <v-col cols="12">
              <v-text-field variant="underlined" prepend-icon="mdi-account" v-model="displayName"
                            :label="t('login.display_name')"
                            :rules="[v => !!v || 'Is required']"
                            v-on:keyup.enter="register()"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field variant="underlined" prepend-icon="mdi-email" v-model="email"
                            type="email"
                            :label="t('login.email')"
                            :rules="[v => !!v || 'Is required']"
                            v-on:keyup.enter="register()"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field variant="underlined" prepend-icon="mdi-key" type="password" v-model="password"
                            :label="t('login.password')"
                            :rules="[v => !!v || 'Is required']"
                            v-on:keyup.enter="register()"

              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field variant="underlined" prepend-icon="mdi-key" type="password" v-model="repeatPassword"
                            :label="t('login.password_repeat')"
                            :rules="[v => !!v || 'Is required']"
                            v-on:keyup.enter="register()"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn :loading="isSubmitting" variant="flat" color="accent" block @click="register()">{{t('register.submit')}}</v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn variant="text" size="small" block :to="{name:'login'}">{{t('register.go_to_login')}}</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {ref} from "vue";
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import {useI18n} from "vue-i18n";
import router from "@/router";
import {useAuthenticationStore} from "@/stores/auth";
import {useUserStore} from "@/stores/user";

const {t} = useI18n()
const displayName = ref()
const email = ref()
const password = ref()
const repeatPassword = ref()
const authStore = useAuthenticationStore()
const userStore = useUserStore()
const auth = getAuth();

const isSubmitting = ref(false)
const hasRegisterErrors = ref(false)
const registerError = ref('')

function register() {

  isSubmitting.value = true;
  hasRegisterErrors.value = false

  if (password.value !== repeatPassword.value) {
    hasRegisterErrors.value = true;
    registerError.value = 'Password mismatch'

    return false;
  }

  createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        isSubmitting.value = false;
        // Signed in
        const user = userCredential.user;
        authStore.authenticate(user)
        userStore.setUser(user)



        router.push({'name': 'dashboard'})
      })
      .catch((error) => {
        isSubmitting.value = false;
        hasRegisterErrors.value = true;
        registerError.value = error.code.split('/').pop().split('-').join(' ')

      });

}


</script>

<style scoped>

</style>