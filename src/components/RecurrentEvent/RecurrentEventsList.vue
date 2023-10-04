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
              <v-list-item
                  density="compact"
                  prepend-icon="mdi-repeat"
              >
                <v-list-item-title>
                  {{ eventItem.spotEvent.displayFrequency() }}
                </v-list-item-title>
              </v-list-item>
            </v-list>

          </v-card-text>

          <v-divider></v-divider>
          <v-card-actions>
            <v-row>

              <v-col cols="12" class="text-left pt-0" v-if="eventItem.spotEvent.isAuthor(userStore.id)">
                <v-divider></v-divider>
                <v-btn
                    color="accent"
                    icon="mdi-note-edit-outline"
                    :to="{name:'edit-recurrent-event',params:{'eventId':eventItem.spotEvent.id}}"
                    variant="plain"

                ></v-btn>
                <v-btn
                    color="red"
                    icon="mdi-delete"
                    @click="deleteRecurrentEvent(eventItem.spotEvent)"
                    variant="plain"

                ></v-btn>
              </v-col>

            </v-row>
          </v-card-actions>

        </v-card>
      </v-col>
    </v-row>

  </v-container>


</template>

<script setup>

import {useI18n} from "vue-i18n";
import {computed, inject, onMounted, ref, watch} from "vue";
import {collection, deleteDoc, doc, onSnapshot, orderBy, query, where} from "firebase/firestore";
import recurrentEventConverter from "@/converters/recurrentEventConverter";
import {useUserStore} from "@/stores/user";
import Swal from 'sweetalert2'
import EventListItem from "@/models/eventListItem";
import {useNomenclaturesStore} from "@/stores/nomenclatures";

const {t} = useI18n()
const firestore = inject('firestore')
const isLoading = ref(true)
const search = ref('')
const isSearching = ref(false);
const nomenclatures = useNomenclaturesStore()
const userStore = useUserStore()


const events = ref([])


watch(search, function (newSearch, oldSearch) {
  setTimeout(function () {
    filterEvents()
  }, 50)
})

function filterEvents() {
  isSearching.value = true;

  let newSearch = search.value;
  if (!newSearch || typeof newSearch === 'undefined' || newSearch.length === 0) {
    isSearching.value = false;
    return;
  }

  if (typeof newSearch === 'string') {
    if (newSearch.length < 3) {
      isSearching.value = false;

      return;
    }

    events.value.map(function (eventListItem) {
      eventListItem.isVisible = eventListItem.spotEvent.title.includes(newSearch) || eventListItem.spotEvent.description.includes(newSearch)
    })
  }

  if (typeof newSearch === 'object') {
    events.value.map(function (eventListItem) {
      eventListItem.isVisible = eventListItem.spotEvent.category.id === newSearch.id
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

  const q = query(collection(firestore, "recurrent_events"), where('author.id', '==', userStore.id), orderBy('createdAt', 'desc')).withConverter(recurrentEventConverter);
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

function deleteRecurrentEvent(recurrentEvent) {

  if (!recurrentEvent.isAuthor(userStore.id)) {
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
      deleteDoc(doc(firestore, "recurrent_events", recurrentEvent.id));
    }
  })

}

</script>

<style scoped>

</style>