<template>
  <v-container>

<v-form>
    <v-card
        class="mx-auto"

    >
      <v-card-title class="text-h6 font-weight-regular justify-space-between">
        <span>{{ currentTitle }}</span>
        &nbsp;
        <v-avatar
            color="primary"
            size="24"
            v-text="step"
        ></v-avatar>
      </v-card-title>

      <v-window v-model="step">
        <v-window-item :value="1">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-autocomplete  v-model="newEvent.category" clearable :label="$t('event.category')"
                                :items="nomenclatures.categories" item-title="name" return-object></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="3" >
                <v-text-field  v-model="newEvent.title" :label="$t('event.title')" :hint="$t('event.titleHint')"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field  v-model="newEvent.description" :label="$t('event.description')" :hint="$t('event.descriptionHint')"></v-text-field>
              </v-col>

            </v-row>
          </v-card-text>
        </v-window-item>

        <v-window-item :value="2">
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <vue-ctk-date-time-picker v-model="newEvent.date"
                                          :label="$t('event.date')"
                                          minute-interval="5"
                                          min-date="now"
                                          first-day-of-week="1"
                                          format="YYYY-MM-DD hh:mm"
                                          formatted="DD-MM-YYYY hh:mm"
                                          output-format="YYYY-MM-DD hh:mm"
                ></vue-ctk-date-time-picker>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" >
                <v-text-field v-model="newEvent.location" :label="$t('event.location')"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" >
                <v-select  v-model="newEvent.duration" :label="$t('event.duration')"></v-select>
              </v-col>
              <v-col cols="12" >
                <v-text-field  type="number" v-model="newEvent.totalSpots"
                               :label="$t('event.totalSpots')"></v-text-field>
              </v-col>
              <v-col cols="12" >
                <v-switch inset color="primary" v-model="newEvent.allowReserves"
                          :label=" newEvent.allowReserves ? $t('event.allowReserves') : $t('event.doNotAllowReserves')"
                ></v-switch>
              </v-col>
              <v-col cols="12">
                Allowing reserves will let people join your event even if it's fully booked and if any of the participants resigns then the system will automatically notify the first reserve about the open spot.
              </v-col>
            </v-row>
          </v-card-text>
        </v-window-item>

        <v-window-item :value="3">
          <div class="pa-4 text-center">
            <v-img
                class="mb-4"
                contain
                height="128"
                src="https://cdn.vuetifyjs.com/images/logos/v.svg"
            ></v-img>
            <h3 class="text-h6 font-weight-light mb-2">
              Welcome to Vuetify
            </h3>
            <span class="text-caption text-grey">Thanks for signing up!</span>
          </div>
        </v-window-item>
      </v-window>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn
            v-if="step > 1"
            variant="text"
            @click="step--"
        >
          Back
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
            v-if="step < 3"
            color="primary"
            variant="flat"
            @click="step++"
        >
          Next
        </v-btn>
      </v-card-actions>
    </v-card>

    </v-form>
  </v-container>
</template>

<script setup>

import {computed, ref} from "vue";
import {useI18n} from "vue-i18n";
import {useNomenclaturesStore} from "@/stores/nomenclatures";

const {t} = useI18n()

const nomenclatures = useNomenclaturesStore()

const step = ref(1)
const currentTitle = computed(()=>{
  switch(step.value){
    case 1:
      return 'General info';
    case 2:
      return 'Date & Location';
    case 3:
      return 'Review'
  }
})

const newEvent = ref({
  id: null,
  title: '',
  category: null,
  location: "",
  date: '',
  duration: '',
  description: '',
  icon: '',
  bookedSpots: null,
  totalSpots: null,
  createdBy: '',
  allowReserves: true,
  participants: []
})

</script>

<style scoped>

</style>