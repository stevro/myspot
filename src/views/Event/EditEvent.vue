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
              <v-autocomplete v-model="spotEvent.category" clearable :label="$t('spotEvent.category')"
                              :items="nomenclatures.categories" item-title="name" return-object
                              :rules="[rules.required]"
              >

              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field v-model="spotEvent.title" :label="$t('spotEvent.title')"

                            :rules="[rules.required]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea v-model="spotEvent.description" :label="$t('spotEvent.description')"
                            ></v-textarea>
            </v-col>

          </v-row>

          <v-row>
            <v-col cols="12">
              <v-validation
                      :rules="[rules.required]"
                  v-model="spotEvent.date"
              >

                <VueDatePicker
                    :placeholder="$t('spotEvent.date')"
                    v-model="spotEvent.date"
                    model-type="timestamp"
                    format="dd-MM-yyyy HH:mm"
                    :is-24="true"
                    :min-date="currentDate"
                    :minutes-increment="5"
                    :minutes-grid-increment="10"
                    teleport="body"
                    :locale="userStore.locale"
                    required
                    :rules="[rules.required]"
                    auto-apply
                    :close-on-auto-apply="false"
                    :clearable="true"
                >

                </VueDatePicker>
              </v-validation>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-switch inset color="primary" v-model="spotEvent.availableImmediatelyForBooking"
                        @update:model-value="spotEvent.availableImmediatelyForBooking ? spotEvent.minutesAvailableForBooking = null : ''"
                        :label=" spotEvent.availableImmediatelyForBooking ? $t('spotEvent.availableImmediatelyForBooking') : $t('spotEvent.notAvailableImmediatelyForBooking')"
                        :disabled="spotEvent.isRecurring()"
                        :rules="[rules.availableImmediatelyForBooking]"
              ></v-switch>
            </v-col>
            <v-col cols="12" v-if="!spotEvent.availableImmediatelyForBooking">
              <v-select v-model="spotEvent.minutesAvailableForBooking" item-title="name" item-value="value"
                        :items="minutesAvailableForBooking"
                        :label="$t('spotEvent.minutesAvailableForBooking')"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
                <vue-google-autocomplete v-if="spotEvent.location" :rules="[rules.required]" :initialValue="spotEvent.location" country="ro" id="location" placeholder="Search a location" @change="getLocation" @placechanged="onLocationChange" enable-geolocation>
                </vue-google-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select :items="durationOptions" v-model="spotEvent.duration" :label="$t('spotEvent.duration')"
                        item-title="name"
                        item-value="value"
                        :return-object="false"
                        :rules="[rules.required]"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field type="number" v-model="spotEvent.totalSpots"
                            :label="$t('spotEvent.totalSpots')"
                            :rules="[rules.required, rules.greaterThan0]"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-switch inset color="primary" v-model="spotEvent.allowReserves"
                        :label=" spotEvent.allowReserves ? $t('spotEvent.allowReserves') : $t('spotEvent.doNotAllowReserves')"
              ></v-switch>
              <small>{{$t("spotEvent.allowReserves_hint")}}</small>
            </v-col>

          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-row v-if="!isSaved">
          <v-col cols="12" md="2">
            <v-btn
                color="accent"
                variant="flat"
                @click="cancel"
                block
            >
              {{ $t('common.btn.cancel') }}
            </v-btn>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
                color="primary"
                variant="flat"
                @click="submitEvent"
                block
            >
              {{ $t('common.btn.submit') }}
            </v-btn>
          </v-col>
        </v-row>


        <v-row v-if="isSaved">
          <v-col cols="12">
            <v-alert :title="$t('spotEvent.actions.updated')" :text="$t('spotEvent.updated')" type="success"></v-alert>
          </v-col>
          <v-col cols="12">
            <v-btn :to="{name:'dashboard'}" block>
              {{$t('common.btn.go_to_list')}}
            </v-btn>
          </v-col>
        </v-row>

      </v-card-actions>


    </v-card>
    <v-card v-else>
      <v-card-text>{{$('spotEvent.not_found')}}</v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>

import {computed, inject, onMounted, ref} from "vue";
import {doc, getDoc, setDoc} from "firebase/firestore";
import eventConverter from "@/converters/eventConverter";
import {useRoute, useRouter} from "vue-router";
import {useNomenclaturesStore} from "@/stores/nomenclatures";
import moment from "moment";

import SpotEvent from "@/models/spotEvent";
import {useUserStore} from "@/stores/user";
import Swal from 'sweetalert2'
import VueGoogleAutocomplete from "@/components/GoogleAutocomplete.vue";
import Coordinates from "@/models/coordinates";
import {buildListOfDurationOptions} from "@/services/EventsServices";

const firestore = inject('firestore')
const spotEvent = ref(new SpotEvent())
const isLoading = ref(false)
const notFound = ref(false)
const route = useRoute()
const router = useRouter()
const nomenclatures = useNomenclaturesStore()
const isSaved = ref(false)
const spotEventForm = ref(null)
const userStore = useUserStore()

const rules = ref({
  'required': v => !!v || 'Is required',
  'greaterThan0': v => v > 0 || 'Must be greater than 0',
},)

const currentDate = computed(function(){
  return moment().format('YYYY-MM-DD HH:mm')
})

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

    if (!spotEvent.value.isAuthor(userStore.id)) {
      Swal.fire({
        icon: 'warning',
        title: 'Permission denied',
        confirmButtonColor: "#3085d6"
      })
      return
    }

    spotEvent.value.updatedAt = moment().format('YYYY-MM-DD HH:mm Z')

    const docRef = (await setDoc(doc(firestore, "spot_events", spotEvent.value.id).withConverter(eventConverter), spotEvent.value));

    isSaved.value = true
  } catch (e) {
    isSaved.value = false
    console.error("Error adding document: ", e);
  }
}

function getLocation(location){

    spotEvent.value.location = '';

    if(typeof location === 'string'){
        spotEvent.value.location = location;
    }


    if(typeof location === 'object' && typeof location.target !== 'undefined'){
        spotEvent.value.location = location.target.value;
    }

}

function onLocationChange(formattedLocation){
  spotEvent.value.coordinates = new Coordinates(formattedLocation.latitude, formattedLocation.longitude);
}

const minutesAvailableForBooking = computed(() => {
  return buildListOfDurationOptions(30, 1440 * 7)
})

const durationOptions = computed(() => {
  return buildListOfDurationOptions(30, 1440 * 7)
})



</script>

<style scoped>

</style>