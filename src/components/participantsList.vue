<template>
  <v-dialog
      v-model="dialog"
      :fullscreen="true"
      :width="'100%'"
      transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ props }">

      <v-list-item
          active-color="white"
          density="compact"
          prepend-icon="mdi-account"
          v-bind="props"
      >
        <v-list-item-title>
          {{ eventItem.spotEvent.bookedSpots() }} / {{ eventItem.spotEvent.totalSpots }}
        </v-list-item-title>
      </v-list-item>

    </template>
    <v-card theme="light">
      <v-toolbar
          class="bg-blue-darken-3"
      >
        <v-toolbar-title>{{ eventItem.spotEvent.title }}</v-toolbar-title>

        <v-toolbar-items>
          <v-btn
              icon="mdi-close"
              @click="closeDialog"
          ></v-btn>

        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        {{ $t('eventItem.participants') }} ({{eventItem.spotEvent.participants.length}} / {{ eventItem.spotEvent.totalSpots }})
        <v-list>
          <v-list-item v-for="participant in eventItem.spotEvent.participants"
                       :key="participant.id"
          >
            <template v-slot:prepend>
              <v-icon>mdi-account</v-icon>
            </template>
            <v-list-item-title>{{ participant.displayName }}</v-list-item-title>
          </v-list-item>
        </v-list>
        {{ $t('eventItem.reserves') }} ({{eventItem.spotEvent.reserves.length}})
        <v-list>
          <v-list-item v-for="reserve in eventItem.spotEvent.reserves"
                       :key="reserve.id"
          >
            <template v-slot:prepend>
              <v-icon>mdi-account</v-icon>
            </template>
            <v-list-item-title>{{ reserve.displayName }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>

import {ref} from "vue";
import EventListItem from "@/models/eventListItem";

const dialog = ref(false)

const props = defineProps({
  'eventItem': EventListItem
})

function closeDialog() {
  dialog.value = false;
}
</script>

<style scoped>

</style>