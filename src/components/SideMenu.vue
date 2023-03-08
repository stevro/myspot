<template>

  <v-list>
    <v-list-item>
      <v-list-item-title>{{$t('sidebar.hello')}}</v-list-item-title>
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
      active-color="white"
      :to="item.href"
      :prepend-icon="item.props.prependIcon"
      @click="$emit('menuClicked', item)"
      exact
    >
      <v-list-item-title>{{$t(item.title)}}</v-list-item-title>
    </v-list-item>
    <language-switcher></language-switcher>
  </v-list>

</template>

<script>



import LanguageSwitcher from "@/components/LanguageSwitcher.vue";


export default {
  name: 'side-menu',
  computed:{

  },
  components: {LanguageSwitcher},
  props: {
    items: Array,
  },
  data: () => ({

  }),



}
</script>
