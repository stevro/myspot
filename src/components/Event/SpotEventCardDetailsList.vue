<script setup>
import EventListItem from "@/models/eventListItem";
import {useUserStore} from "@/stores/user";
const userStore = useUserStore()
const props = defineProps({
  'eventItem': EventListItem
})
</script>

<template>
  <v-list density="compact">
    <v-list-item
        v-if="eventItem.spotEvent.description"
        density="compact"
    >
      <v-list-item-title class="text-wrap">
        {{ eventItem.spotEvent.description }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item
        density="compact"
        prepend-icon="mdi-calendar-month"
    >
      <v-list-item-title class="text-wrap">
        {{ eventItem.spotEvent.displayDate() }}
      </v-list-item-title>
    </v-list-item>
    <v-list-item
        v-if="eventItem.spotEvent.isTimeOkForBooking() === false"
        density="compact"
        prepend-icon="mdi-calendar-clock"
    >
      <v-list-item-title class="text-wrap">
        {{
          $t('spotEvent.step3.availableTimeForBookingDisplay', {'time': eventItem.spotEvent.displayTimeAvailableForBooking()})
        }}
        <span
            v-if="eventItem.spotEvent.isAuthor(userStore.id)"><br/>{{ $t('spotEvent.onlyAuthorCanBookBeforeTime') }}</span>
      </v-list-item-title>
    </v-list-item>
    <v-list-item
        density="compact"
        prepend-icon="mdi-map-marker"
    >
      <v-list-item-title class="text-wrap">
        {{ eventItem.spotEvent.location }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<style scoped>

</style>