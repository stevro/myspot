<template>

  <v-container>

    <v-row>
      <v-col cols="12" md="9">
        <v-text-field
            v-model="search"
            clearable
            label=""
            append-inner-icon="mdi-magnify"
            variant="solo"
            placeholder="Search for an event"
            density="compact"
            :loading="isSearching"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn prepend-icon="mdi-plus" block :to="{'name':'new-event'}">New</v-btn>
      </v-col>
    </v-row>

    <!--    <v-row>-->
    <!--      <v-col cols="12">-->

    <!--<v-progress-linear indeterminate color="primary"></v-progress-linear>-->
    <!--      </v-col>-->
    <!--    </v-row>-->

    <v-row v-for="event in events" v-bind:key="id">
      <v-col>
        <v-card :prepend-icon="event.icon" :title="event.title" :subtitle="event.category">
          <template v-slot:prepend>
            <v-icon size="x-large"></v-icon>
          </template>
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="12" class="py-1">
                {{ event.description }}
              </v-col>

              <v-col cols="12" class="py-1">
                <v-icon>mdi-calendar-month</v-icon>
                {{ event.date }}
              </v-col>
              <v-col cols="12" class="py-1">
                <v-icon>mdi-map-marker</v-icon>
                {{ event.location }}
              </v-col>


            </v-row>
          </v-card-text>


          <v-card-actions>
            <v-btn v-if="canBookSpot(event)" size="small" color="primary" variant="flat">{{
                $t('event.book_spot')
              }}
            </v-btn>
            <v-btn v-else size="small" color="primary" variant="flat" disabled>{{
                $t('event.fully_booked')
              }}
            </v-btn>
            <v-btn  size="small" color="error" variant="flat">{{
                $t('event.withdraw')
              }}
            </v-btn>
            <v-btn  size="small" color="success" disabled variant="flat">{{
                $t('event.booked')
              }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn

                color="accent"
                :icon="event.showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                @click="event.showDetails = !event.showDetails"
            ></v-btn>
          </v-card-actions>
          <v-expand-transition>
            <div v-show="event.showDetails">
              <v-divider></v-divider>

              <v-card-text>
                <v-row no-gutters>

                  <v-col cols="12" class="py-1">
                    <v-icon>mdi-account-group</v-icon>
                    {{ event.bookedSpots }} / {{ event.totalSpots }}
                  </v-col>
                  <v-col cols="12" class="py-1">
                    <v-icon>mdi-account</v-icon>
                    {{ event.createdBy }}
                  </v-col>
                </v-row>

              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>

  </v-container>


</template>

<script setup>

import {useI18n} from "vue-i18n";
import {computed, ref} from "vue";

const {t} = useI18n()

const search = ref('')
const isSearching = computed(function () {
  return search.value?.length > 0
})

const events = ref([])

events.value = [
  {
    id: 1,
    title: 'Meci volei',
    category: 'Volei',
    location: "Sala tudor",
    date: '2023-03-09 20:00 EET',
    duration: '120',
    description: 'Se joaca 3 echipe a cate 6 timp de 2 ore',
    icon: 'mdi-volleyball',
    bookedSpots: 3,
    totalSpots: 12,
    createdBy: 'John Doe',
    showDetails: false,
    allowReserves: true,
    participants: []
  },
  {
    id: 2,
    title: 'Meci volei',
    category: 'football',
    location: "Sala tudor",
    date: '2023-03-09 20:00 EET',
    duration: '120',
    description: 'Se joaca 3 echipe a cate 6 timp de 2 ore',
    icon: 'mdi-soccer',
    bookedSpots: 12,
    totalSpots: 12,
    createdBy: 'John Doe',
    showDetails: false,
    allowReserves: false,
    participants: []
  },
  {
    id: 3,
    title: 'Meci volei',
    category: 'basketball',
    location: "Sala tudor",
    date: '2023-03-09 20:00 EET',
    duration: '120',
    description: 'Se joaca 3 echipe a cate 6 timp de 2 ore',
    icon: 'mdi-basketball',
    bookedSpots: 14,
    totalSpots: 12,
    createdBy: 'John Doe',
    showDetails: false,
    allowReserves: true,
    participants: []
  },
  {
    id: 4,
    title: 'Meci volei',
    category: 'Volei',
    location: "Sala tudor",
    date: '2023-03-09 20:00 EET',
    duration: '120',
    description: 'Se joaca 3 echipe a cate 6 timp de 2 ore',
    icon: 'mdi-volleyball',
    bookedSpots: 3,
    totalSpots: 12,
    createdBy: 'John Doe',
    showDetails: false,
    allowReserves: true,
    participants: []
  },
];

function canBookSpot(event) {
  return !isFull(event) || event.allowReserves
}

function isFull(event) {
  return event.totalSpots === event.bookedSpots;
}

</script>

<style scoped>

</style>