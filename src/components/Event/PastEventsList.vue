<template>

  <v-container>

    <v-row>
      <v-col cols="12" md="6">
        <v-combobox
            :placeholder="$t('eventItem.search')"
            v-model="search"
            :items="nomenclatures.categories"
            item-title="name"
            clearable
            variant="solo"
            label=""
            append-inner-icon="mdi-magnify"
            density="compact"
            :loading="isSearching"
        ></v-combobox>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn-toggle
            v-model="viewOnly"
            color="accent"
            group
            density="compact"
        >
          <v-btn value="all">
            {{ $t('eventItem.search_all') }}
          </v-btn>

          <v-btn value="createdByMe">
            {{ $t('eventItem.search_my_own') }}
          </v-btn>

          <v-btn value="bookedByMe">
            {{ $t('eventItem.search_i_go') }}
          </v-btn>


        </v-btn-toggle>
      </v-col>
      <v-col cols="12" md="2">
        <v-btn prepend-icon="mdi-plus" block :to="{'name':'new-event'}">{{ $t('common.btn.new') }}</v-btn>
      </v-col>
    </v-row>

    <v-row v-if="isLoading">
      <v-col cols="12">

        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </v-col>
    </v-row>
    <v-row v-else-if="visibleEventsList.length === 0">
      <v-col cols="12">
        <v-card>

          <v-card-text>
            <v-row>
              <v-col cols="12" class="text-center">
                <h3>{{ $t('eventItem.not_found') }}</h3>
              </v-col>
            </v-row>
          </v-card-text>


          <v-card-actions>
            <v-btn size="small" color="success" variant="flat" block
                   :to="{'name':'new-event'}"
            >{{
                $t('eventItem.create_one_now')
              }}
            </v-btn>
          </v-card-actions>

        </v-card>
      </v-col>
    </v-row>

    <v-row v-for="eventItem in visibleEventsList" v-bind:key="eventItem.id">
      <v-col>
        <v-card :prepend-icon="eventItem.spotEvent.category.icon" :title="eventItem.spotEvent.title"
                :subtitle="eventItem.spotEvent.category.name + ' ' + $t('common.by') + ' ' + eventItem.spotEvent.author">
          <template v-slot:prepend>
            <v-icon size="x-large"></v-icon>
          </template>

          <v-card-text>


            <v-list density="compact">
              <v-list-item
                  v-if="eventItem.spotEvent.description"
                  density="compact"
              >
                <v-list-item-title>
                  {{ eventItem.spotEvent.description }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                  density="compact"
                  prepend-icon="mdi-calendar-month"
              >
                <v-list-item-title>
                  {{ eventItem.spotEvent.displayDate() }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                  density="compact"
                  prepend-icon="mdi-map-marker"
              >
                <v-list-item-title>
                  {{ eventItem.spotEvent.location }}
                </v-list-item-title>
              </v-list-item>
            </v-list>


            <participants-list :event-item="eventItem"></participants-list>


          </v-card-text>

          <v-divider></v-divider>
          <v-card-actions>

          </v-card-actions>

        </v-card>
      </v-col>
    </v-row>

  </v-container>


</template>

<script setup>

import {useI18n} from "vue-i18n";
import {computed, inject, onMounted, ref, watch} from "vue";
import {collection, onSnapshot, orderBy, query, Timestamp, where, or, and} from "firebase/firestore";
import eventConverter from "@/converters/eventConverter";
import {useUserStore} from "@/stores/user";
import EventListItem from "@/models/eventListItem";
import {useNomenclaturesStore} from "@/stores/nomenclatures";
import ParticipantsList from "@/components/Event/participantsList.vue";

const {t} = useI18n()
const firestore = inject('firestore')
const isLoading = ref(true)
const search = ref('')
const isSearching = ref(false);
const nomenclatures = useNomenclaturesStore()
const userStore = useUserStore()
const showOnlyCreatedByMe = computed(function () {
  return viewOnly.value === 'createdByMe'
})
const showOnlyBookedByMe = computed(function () {
  return viewOnly.value === 'bookedByMe'
})
const viewOnly = ref('all')
const events = ref([])

watch(showOnlyCreatedByMe, function () {
  setTimeout(function () {
    filterEvents()
  }, 50)
})
watch(showOnlyBookedByMe, function () {
  setTimeout(function () {
    filterEvents()
  }, 50)
})

watch(search, function (newSearch, oldSearch) {
  setTimeout(function () {
    filterEvents()
  }, 50)
})

function filterEvents() {
  isSearching.value = true;

  let newSearch = search.value;
  if (!newSearch || typeof newSearch === 'undefined' || newSearch.length === 0) {
    events.value.map(function (eventListItem) {

      if (showOnlyCreatedByMe.value === false && showOnlyBookedByMe.value === false) {
        eventListItem.isVisible = true;
        return;
      }

      if (showOnlyCreatedByMe.value === true && eventListItem.spotEvent.author.id === userStore.id) {
        eventListItem.isVisible = true;
        return;
      }

      if (showOnlyBookedByMe.value === true && eventListItem.spotEvent.hasBookedSpot(userStore.id)) {
        eventListItem.isVisible = true;
        return;
      }

      eventListItem.isVisible = false;
    })

    isSearching.value = false;

    return;
  }

  if (typeof newSearch === 'string') {
    if (newSearch.length < 3) {
      isSearching.value = false;

      return;
    }

    events.value.map(function (eventListItem) {

      if (eventListItem.spotEvent.title.includes(newSearch) || eventListItem.spotEvent.description.includes(newSearch)) {

        if (showOnlyCreatedByMe.value === false && showOnlyBookedByMe.value === false) {
          eventListItem.isVisible = true;
          return;
        }

        if (showOnlyCreatedByMe.value === true && eventListItem.spotEvent.author.id === userStore.id) {
          eventListItem.isVisible = true;
          return;
        }

        if (showOnlyBookedByMe.value === true && eventListItem.spotEvent.hasBookedSpot(userStore.id)) {
          eventListItem.isVisible = true;
          return;
        }

      }

      eventListItem.isVisible = false
    })

  }

  if (typeof newSearch === 'object') {

    events.value.map(function (eventListItem) {

      if (eventListItem.spotEvent.category.id === newSearch.id) {
        if (showOnlyCreatedByMe.value === false && showOnlyBookedByMe.value === false) {
          eventListItem.isVisible = true;
          return;
        }

        if (showOnlyCreatedByMe.value === true && eventListItem.spotEvent.author.id === userStore.id) {
          eventListItem.isVisible = true;
          return;
        }

        if (showOnlyBookedByMe.value === true && eventListItem.spotEvent.hasBookedSpot(userStore.id)) {
          eventListItem.isVisible = true;
          return;
        }

      }

      eventListItem.isVisible = false
    })

  }

  isSearching.value = false;

}

const visibleEventsList = computed(function () {
  return events.value.filter(function (item) {
    return item.isVisible
  })
})

onMounted(() => {
  searchEvents()
})


function searchEvents() {
  let now = Timestamp.now().toMillis()

  const q = query(collection(firestore, "spot_events"), and(where('date', '<', now), or(where('author.id','==',userStore.id),where('participants.id','==',userStore.id),where('reserves.id','==',userStore.id))), orderBy('date', 'asc')).withConverter(eventConverter);
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    isLoading.value = false;
    events.value = [];

    querySnapshot.forEach((doc) => {
      let data = doc.data();

      if(data.date > data.minutesAvailableForBooking*60000 + now){
        //add a check for author
        //if author show the event but add a message that others are unable to view it yet
        return;
      }

      events.value.push(new EventListItem(data))
    });

    filterEvents()

  });
}


</script>

<style scoped>

</style>