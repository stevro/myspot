<template>
  <v-container>
    <v-card
        v-if="!notFound"
        class="mx-auto"
        :loading="isLoading"
    >
      <template v-slot:prepend>
        <span class="text-h6 font-weight-regular justify-space-between">{{ spotEvent?.title }}</span>
      </template>


      <v-card-text v-if="spotEvent">
        <v-form ref="spotEventForm">
          <v-row>
            <v-col cols="12" md="3">
              <v-autocomplete v-model="spotEvent.category" clearable :label="$t('event.category')"
                              :items="nomenclatures.categories" item-title="name" return-object
                              :rules="rules.required"
              >

              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field v-model="spotEvent.title" :label="$t('event.title')"
                            :hint="$t('event.titleHint')"
                            :rules="rules.required"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="spotEvent.description" :label="$t('event.description')"
                            :hint="$t('event.descriptionHint')"></v-text-field>
            </v-col>

          </v-row>

          <v-row>
            <v-col cols="12">
              <v-validation
                  :rules="rules.required"
                  v-model="spotEvent.date"
              >

                <vue-ctk-date-time-picker v-model="spotEvent.date"
                                          :label="$t('event.date')"
                                          minute-interval="5"
                                          min-date="now"
                                          :first-day-of-week="1"
                                          format="YYYY-MM-DD HH:mm"
                                          formatted="DD-MM-YYYY HH:mm"
                                          output-format="YYYY-MM-DD HH:mm"

                ></vue-ctk-date-time-picker>
              </v-validation>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="spotEvent.location" :label="$t('event.location')"
                            :rules="rules.required"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select :items="nomenclatures.durations" v-model="spotEvent.duration" :label="$t('event.duration')"
                        item-title="name"
                        item-value="value"
                        :return-object="false"
                        :rules="rules.required"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field type="number" v-model="spotEvent.totalSpots"
                            :label="$t('event.totalSpots')"
                            :rules="[rules.required, rules.greaterThan0]"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-switch inset color="primary" v-model="spotEvent.allowReserves"
                        :label=" spotEvent.allowReserves ? $t('event.allowReserves') : $t('event.doNotAllowReserves')"
              ></v-switch>
              <small>{{
                  $t("Allowing reserves will let people join your event even if it\'s fully booked and if any of the participants resigns then the system will automatically notify the first reserve about the open spot.")
                }}</small>
            </v-col>

          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-row v-if="!isSaved">
          <v-col cols="12" md="4">
            <v-btn
                color="accent"
                variant="flat"
                @click="cancel"
                block
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="12" md="4">
            <v-btn
                color="primary"
                variant="flat"
                @click="submitEvent"
                block
            >
              Submit
            </v-btn>
          </v-col>
        </v-row>


        <v-row v-if="isSaved">
          <v-col cols="12">
            <v-alert title="Event updated" text="Your event has been updated successfully" type="success"></v-alert>
          </v-col>
          <v-col cols="12">
            <v-btn :to="{name:'dashboard'}" block>
              Go to list
            </v-btn>
          </v-col>
        </v-row>

      </v-card-actions>


    </v-card>
    <v-card v-else>
      <v-card-text>Event not found!</v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>

import {inject, onMounted, ref} from "vue";
import {doc, getDoc, setDoc} from "firebase/firestore";
import eventConverter from "@/converters/eventConverter";
import {useRoute, useRouter} from "vue-router";
import {useNomenclaturesStore} from "@/stores/nomenclatures";
import moment from "moment";

import SpotEvent from "@/models/spotEvent";

const firestore = inject('firestore')
const spotEvent = ref(new SpotEvent())
const isLoading = ref(false)
const notFound = ref(false)
const route = useRoute()
const router = useRouter()
const nomenclatures = useNomenclaturesStore()
const isSaved = ref(false)
const spotEventForm = ref(null)

const rules = ref({
  'required': [
    v => !!v || 'Is required',
  ],
  'greaterThan0': v => v > 0 || 'Must be greater than 0',
},)

async function getEvent() {
  isLoading.value = true;
  const snapshot = await getDoc(doc(firestore, "spot_events", route.params.eventId).withConverter(eventConverter));

  if (snapshot.exists()) {
    spotEvent.value = snapshot.data()
    notFound.value = false;
  } else {
    notFound.value = true;
  }
  isLoading.value = false;
}

onMounted(function () {
  getEvent()
})

async function cancel() {
  router.push({name: 'dashboard'})
}

async function submitEvent() {
  try {

    spotEvent.value.updatedAt = moment().format('YYYY-MM-DD HH:mm Z')

    const docRef = (await setDoc(doc(firestore, "spot_events", spotEvent.value.id).withConverter(eventConverter), spotEvent.value));

    isSaved.value = true
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

</script>

<style scoped>

</style>