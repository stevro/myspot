<template>

  <v-list>
    <v-list-item>
      <v-list-item-title>{{ $t('sidebar.hello') }} {{ displayName }}</v-list-item-title>
    </v-list-item>
  </v-list>

  <v-divider></v-divider>

  <v-list
      color="transparent"
      :lines="false"
      density="default"
      nav
  >
    <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :value="item"
        color="white"
        :to="item.href"
        :prepend-icon="item.props.prependIcon"
        @click="$emit('menuClicked', item)"
        exact
    >
      <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
    </v-list-item>
    <language-switcher></language-switcher>
  </v-list>

</template>

<script setup>
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import {computed} from "vue";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore()
const displayName = computed(function () {
  return userStore.displayName
})

const props = defineProps({
  'items': Array
})


</script>
