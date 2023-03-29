<template>

  <v-container>

    <v-row>
      <v-col cols="12" md="7">
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
      <v-col cols="6" md="2">
        <v-switch color="primary" label="Created by me" inset v-model="showOnlyCreatedByMe"></v-switch>
      </v-col>
<!--      <v-col cols="6" md="2">-->
<!--        <v-switch color="primary" label="Booked by me" inset v-model="showOnlyBookedByMe"></v-switch>-->
<!--      </v-col>-->
      <v-col cols="12" md="3">
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
            <v-row no-gutters>
              <v-col cols="12" class="py-1">
                {{ eventItem.spotEvent.description }}
              </v-col>

              <v-col cols="12" class="py-1">
                <v-icon>mdi-calendar-month</v-icon>
                {{ eventItem.spotEvent.displayDate() }}
              </v-col>
              <v-col cols="12" class="py-1">
                <v-icon>mdi-map-marker</v-icon>
                {{ eventItem.spotEvent.location }}
              </v-col>
              <v-col cols="12" class="py-1">
                <v-icon>mdi-account-group</v-icon>
                {{ eventItem.spotEvent.bookedSpots() }} / {{ eventItem.spotEvent.totalSpots }}
              </v-col>


            </v-row>
          </v-card-text>

          <v-divider></v-divider>
          <v-card-actions>
            <v-row>
              <v-col cols="12">
                <book-spot :spot-event="eventItem.spotEvent"></book-spot>
              </v-col>
              <v-col cols="12"
                     v-if="eventItem.spotEvent.isParticipant(userStore.id) || eventItem.spotEvent.isReserve(userStore.id)">
                <withdraw :spot-event="eventItem.spotEvent"></withdraw>
              </v-col>
              <v-col cols="12" class="text-left pt-0" v-if="eventItem.spotEvent.isAuthor(userStore.id)">
                <v-divider></v-divider>
                <v-btn
                    color="accent"
                    icon="mdi-note-edit-outline"
                    :to="{name:'edit-event',params:{'eventId':eventItem.spotEvent.id}}"
                    variant="plain"

                ></v-btn>
                <v-btn
                    color="red"
                    icon="mdi-delete"
                    @click="deleteSpotEvent(eventItem.spotEvent)"
                    variant="plain"

                ></v-btn>
              </v-col>
<!--              <v-col cols="6" class="text-right pt-0">-->
<!--                <v-btn-->
<!--                    color="accent"-->
<!--                    :icon="eventItem.showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down'"-->
<!--                    @click="eventItem.showDetails = !eventItem.showDetails"-->
<!--                ></v-btn>-->
<!--              </v-col>-->
            </v-row>
          </v-card-actions>
<!--          <v-expand-transition>-->
<!--            <div v-show="eventItem.showDetails">-->
<!--              <v-divider></v-divider>-->

<!--              <v-card-text>-->
<!--                <v-row no-gutters>-->

<!--                  <v-col cols="12" class="py-1">-->
<!--                    <v-icon>mdi-account-group</v-icon>-->
<!--                    {{ eventItem.spotEvent.bookedSpots() }} / {{ eventItem.spotEvent.totalSpots }}-->
<!--                  </v-col>-->
<!--                  <v-col cols="12" class="py-1">-->
<!--                    <v-icon>mdi-account</v-icon>-->
<!--                    {{ eventItem.spotEvent.author }}-->
<!--                  </v-col>-->
<!--                </v-row>-->

<!--              </v-card-text>-->
<!--            </div>-->
<!--          </v-expand-transition>-->
        </v-card>
      </v-col>
    </v-row>

  </v-container>


</template>

<script setup>

import {useI18n} from "vue-i18n";
import {computed, inject, nextTick, onMounted, ref, watch} from "vue";
import moment from 'moment';
import {collection, deleteDoc, doc, onSnapshot, orderBy, query, where} from "firebase/firestore";
import eventConverter from "@/converters/eventConverter";
import {useUserStore} from "@/stores/user";
import Swal from 'sweetalert2'
import EventListItem from "@/models/eventListItem";
import BookSpot from "@/components/BookSpot.vue";
import Withdraw from "@/components/Withdraw.vue";
import {useNomenclaturesStore} from "@/stores/nomenclatures";

const {t} = useI18n()
const firestore = inject('firestore')
const isLoading = ref(true)
const search = ref('')
const isSearching = ref(false);
const nomenclatures = useNomenclaturesStore()
const userStore = useUserStore()
const showOnlyCreatedByMe = ref(false)
const showOnlyBookedByMe = ref(false)
const events = ref([])

watch(showOnlyCreatedByMe, function () {
  setTimeout(function(){
    filterEvents()
  }, 50)
})
watch(showOnlyBookedByMe, function () {
  setTimeout(function(){
    filterEvents()
  }, 50)
})

watch(search, function (newSearch, oldSearch) {
  setTimeout(function(){
    filterEvents()
  }, 50)
})

function filterEvents() {
  isSearching.value = true;

  let newSearch = search.value;
  if (!newSearch || typeof newSearch === 'undefined' || newSearch.length === 0) {
    events.value.map(function (eventListItem) {

      if (showOnlyCreatedByMe.value === false) {
        eventListItem.isVisible = true;
        return;
      }

      if (showOnlyCreatedByMe.value === true && eventListItem.spotEvent.author.id === userStore.id) {
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

        if (showOnlyCreatedByMe.value === false) {
          eventListItem.isVisible = true;
          return;
        }

        if (showOnlyCreatedByMe.value === true && eventListItem.spotEvent.author.id === userStore.id) {
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
        if (showOnlyCreatedByMe.value === false) {
          eventListItem.isVisible = true;
          return;
        }

        if (showOnlyCreatedByMe.value === true && eventListItem.spotEvent.author.id === userStore.id) {
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
  let now = moment().format('YYYY-MM-DD HH:mm')

  const q = query(collection(firestore, "spot_events"), where('date', '>=', now), orderBy('date', 'asc')).withConverter(eventConverter);
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    isLoading.value = false;
    events.value = [];

    querySnapshot.forEach((doc) => {
      let data = doc.data();

      events.value.push(new EventListItem(data))
    });

    filterEvents()

  });
}

function deleteSpotEvent(spotEvent) {

  if (!spotEvent.isAuthor(userStore.id)) {
    Swal.fire({
      icon: 'warning',
      title: 'Permission denied',
      confirmButtonColor: "#3085d6"
    })
    return
  }

  Swal.fire({
    title: t('common.confirm.title'),
    //text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: t('common.confirm.delete_confirm'),
  }).then((result) => {
    if (result.isConfirmed) {
      deleteDoc(doc(firestore, "spot_events", spotEvent.id));
    }
  })

}

</script>

<style scoped>

</style>