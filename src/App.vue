<script setup>
import {RouterView} from 'vue-router'
import i18n from "@/plugins/i18n";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore()

i18n.global.locale = userStore.locale
document.documentElement.setAttribute('lang', userStore.locale);

userStore.$subscribe(function (mutation, state) {
  i18n.global.locale = state.locale
  document.documentElement.setAttribute('lang', userStore.locale);
})


</script>

<template>
  <RouterView/>
</template>

<style scoped>

</style>
