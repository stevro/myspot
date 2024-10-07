<template>
  <v-container>


    <v-card
        class="mx-auto"

    >

      <template v-slot:prepend>
        <span class="text-h6 font-weight-regular justify-space-between">{{ currentTitle }}</span>
      </template>
      <template v-slot:append>
        <v-avatar
            color="primary"
            size="36"
            density="compact"
            v-text="step + '/3'"
        ></v-avatar>
      </template>


      <v-window v-model="step">
        <v-window-item :value="1">
          <v-form ref="step1Form">
            <v-card-text>
              <v-row>
                <v-col cols="12" md="3">
                  <v-autocomplete v-model="newEvent.category" clearable
                                  :label="$t('spotEvent.category')"
                                  :items="nomenclatures.categories" item-title="name" return-object
                                  :rules="[rules.required]"
                  >

                  </v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="3">
                  <v-text-field v-model="newEvent.title" :label="$t('spotEvent.title')"
                                :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-textarea v-model="newEvent.description" :label="$t('spotEvent.description')"
                  ></v-textarea>
                </v-col>

              </v-row>
            </v-card-text>
          </v-form>
        </v-window-item>

        <v-window-item :value="2">
          <v-form ref="step2Form">
            <v-card-text>
              <v-row>
                <v-col cols="10">

                  <VueDatePicker
                      :placeholder="$t('spotEvent.date')"
                      v-model="newEvent.date"
                      model-type="timestamp"
                      format="dd-MM-yyyy HH:mm"
                      :is-24="true"
                      :minutes-increment="5"
                      :minutes-grid-increment="15"
                      :min-date="minDateForEvent"
                      teleport="body"
                      :locale="userStore.locale"
                      required
                      :rules="[rules.required()]"
                      auto-apply
                      :close-on-auto-apply="false"
                      :clearable="true"
                  >

                  </VueDatePicker>


                </v-col>
                <v-col cols="2">
                  <v-btn prepend-icon="mdi-repeat" variant="text" size="small"
                         :title="$t('spotEvent.recurrent_event_btn_title')"
                         @click="initRecurrentEvent">{{$t('spotEvent.enable_recurrent_event')}}</v-btn>
                </v-col>
              </v-row>

              <v-row v-if="newEvent.isRecurring()" align="center" justify="center">

                <v-col cols="6">
                  {{ $t('spotEvent.recurrent_event_title') }}
                </v-col>
                <v-col cols="6">
                  <v-btn prepend-icon="mdi-repeat-off" block variant="text" color="orange"
                         size="small" @click="disableRepeatableEvent">{{$t('spotEvent.disable_recurrent_event')}}
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <v-select :items="RecurrentSpotEvent.shortcuts()"
                            v-model="newEvent.shortcut"
                            @update:model-value="newEvent.shortcutUpdated()"

                  ></v-select>
                </v-col>


                <v-col cols="12">
                  {{ $t('repeatableSpotEvent.ends') }}
                </v-col>
                <v-col cols="12">
                  <v-radio-group v-model="newEvent.endsOn" @update:model-value="changeFrequencyType()">
                    <v-radio label="On" :value="ENDS_ON_FIXED_DATE">
                      <template v-slot:label>
                        <v-row align="center" justify="center">
                          <v-col cols="3">
                            {{$t('spotEvent.endsOnDate_title')}}
                          </v-col>
                          <v-col cols="9" :disabled="newEvent.endsOn !== ENDS_ON_FIXED_DATE">
                            <VueDatePicker

                                v-model="newEvent.endingDate"
                                :clearable="false"
                                :enable-time-picker="false"
                                model-type="timestamp"
                                format="dd-MM-yyyy"
                                :min-date="minDateForEvent"
                                teleport="body"
                                :locale="userStore.locale"
                            >

                            </VueDatePicker>
                          </v-col>
                        </v-row>
                      </template>
                    </v-radio>
                    <v-radio :value="ENDS_ON_X_OCCURRENCES">
                      <template v-slot:label>

                        <v-row align="center" justify="center">
                          <v-col cols="3">
                            {{$t('spotEvent.endsOnXOccurrences_title')}}
                          </v-col>
                          <v-col cols="9" :disabled="newEvent.endsOn !== ENDS_ON_X_OCCURRENCES">
                            <v-text-field :readonly="newEvent.endsOn !== ENDS_ON_X_OCCURRENCES" type="number"
                                          v-model="newEvent.endingOccurrences"
                                          :suffix="$t('repeatableSpotEvent.occurrences')"></v-text-field>
                          </v-col>
                        </v-row>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-col>

              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-switch inset color="primary" v-model="newEvent.availableImmediatelyForBooking"
                            @update:model-value="newEvent.availableImmediatelyForBooking ? newEvent.minutesAvailableForBooking = null : ''"
                            :label=" newEvent.availableImmediatelyForBooking ? $t('spotEvent.availableImmediatelyForBooking') : $t('spotEvent.notAvailableImmediatelyForBooking')"
                            :disabled="newEvent.isRecurring()"
                            :rules="[rules.availableImmediatelyForBooking]"
                  ></v-switch>
                </v-col>
                <v-col cols="12" v-if="!newEvent.availableImmediatelyForBooking">
                  <v-select v-model="newEvent.minutesAvailableForBooking" item-title="name" item-value="value"
                            :items="minutesAvailableForBooking"
                            :label="$t('spotEvent.minutesAvailableForBooking')"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <vue-google-autocomplete country="ro" :rules="[rules.required]" id="location"
                                           placeholder="Search a location" @change="getLocation"
                                           @placechanged="onLocationChange"
                                           types=""
                                           enable-geolocation>
                  </vue-google-autocomplete>
                  <!--                  <v-text-field v-model="newEvent.location" :label="$t('spotEvent.location')"-->
                  <!--                                :rules="rules.required"-->
                  <!--                  ></v-text-field>-->
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-select :items="durationOptions" v-model="newEvent.duration"
                            :label="$t('spotEvent.duration')"
                            item-title="name"
                            item-value="value"
                            :return-object="false"
                            :rules="[rules.required]"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-text-field type="number" v-model="newEvent.totalSpots"
                                :label="$t('spotEvent.totalSpots')"
                                :rules="[rules.required, rules.greaterThan0]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-switch inset color="primary" v-model="newEvent.allowReserves"
                            :label=" newEvent.allowReserves ? $t('spotEvent.allowReserves') : $t('spotEvent.doNotAllowReserves')"
                  ></v-switch>
                  <small>{{ $t("spotEvent.allowReserves_hint") }}</small>
                </v-col>

              </v-row>
            </v-card-text>
          </v-form>
        </v-window-item>

        <v-window-item :value="3">

          <v-card-text>
            <v-row no-gutters>
              <v-col cols="12" class="py-1">
                <v-icon>{{ newEvent.category.icon }}</v-icon>
                {{ newEvent.title }}
              </v-col>
              <v-col cols="12" class="py-1">
                {{ newEvent.description }}
              </v-col>

              <v-col cols="12" class="py-1">
                <v-icon>mdi-calendar-month</v-icon>
                {{ newEvent.displayDate() }}
                <span v-if="newEvent.isRecurring()">
                                  <small>({{ $t('spotEvent.date_of_first_event') }})</small>
                                </span>
              </v-col>
              <v-col v-if="newEvent.isRecurring()" cols="12" class="py-1">
                <v-icon>mdi-repeat</v-icon>
                {{ newEvent.displayFrequency() }}
              </v-col>
              <v-col cols="12" class="py-1">
                <v-icon>mdi-map-marker</v-icon>
                {{ newEvent.location }}
              </v-col>
              <v-col cols="12" class="py-1">
                <v-icon>mdi-account-group</v-icon>
                {{ newEvent.totalSpots }} (<span
                  v-if="newEvent.allowReserves">{{ $t('spotEvent.reserves_allowed') }}</span><span
                  v-else>{{ $t('spotEvent.reserves_not_allowed') }}</span>)
              </v-col>
              <v-col cols="12" class="py-1" v-if="newEvent.minutesAvailableForBooking">
                <v-icon>mdi-calendar-clock</v-icon>
                {{
                  $t('spotEvent.step3.availableTimeForBookingDisplay', {'time': newEvent.displayTimeAvailableForBooking()})
                }}
              </v-col>
              <v-col cols="12" class="py-1" v-else>
                <v-icon>mdi-calendar-clock</v-icon>
                {{
                  $t('spotEvent.step3.availableImmediatelyForBookingDisplay')
                }}
              </v-col>


            </v-row>
          </v-card-text>
        </v-window-item>
      </v-window>

      <v-divider></v-divider>

      <v-card-actions v-if="!isSaved">
        <v-btn
            v-if="step > 1"
            variant="text"
            @click="step--"
        >
          {{ $t('common.btn.back') }}
        </v-btn>
        <v-btn
            v-if="step === 1"
            variant="text"
            :to="{name:'dashboard'}"
        >
          {{ $t('common.btn.back_to_list') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
            v-if="step < 3"
            color="primary"
            variant="flat"
            @click="validateStep"
        >
          {{ $t('common.btn.next') }}
        </v-btn>
        <v-btn
            v-if="step === 3"
            color="primary"
            variant="flat"
            @click="submitEvent"
        >
          {{ $t('common.btn.submit') }}
        </v-btn>
      </v-card-actions>
      <v-card-actions v-else>

        <v-row>
          <v-col cols="12">
            <v-alert :title="$t('spotEvent.actions.created')" :text="$t('spotEvent.created')"
                     type="success"></v-alert>
          </v-col>
          <v-col cols="12">
            <v-btn :to="{name:'dashboard'}" block>
              {{ $t('common.btn.go_to_list') }}
            </v-btn>
          </v-col>
        </v-row>

      </v-card-actions>
    </v-card>

  </v-container>
</template>

<script setup>

import {computed, inject, nextTick, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {useNomenclaturesStore} from "@/stores/nomenclatures";
import {addDoc, collection} from "firebase/firestore";
import {useUserStore} from "@/stores/user";
import moment from "moment-timezone";
import eventConverter from "@/converters/eventConverter";
import SpotEvent from "@/models/spotEvent";
import Author from "@/models/author";
import VueGoogleAutocomplete from "@/components/GoogleAutocomplete.vue";
import RecurrentSpotEvent, {ENDS_ON_FIXED_DATE, ENDS_ON_X_OCCURRENCES} from "@/models/recurrentSpotEvent";
import recurrentEventConverter from "@/converters/recurrentEventConverter";
import Coordinates from "@/models/coordinates";
import {buildListOfDurationOptions} from "@/services/EventsServices";


const {t} = useI18n()
const firestore = inject('firestore')
const nomenclatures = useNomenclaturesStore()
const userStore = useUserStore()
const step = ref(1)
const step1Form = ref(null);
const step2Form = ref(null);
const isSaved = ref(false)

const minDateForEvent = computed(function () {
  return moment().add(5, 'minutes').format('YYYY-MM-DD HH:mm')
})

const rules = ref({
  'required': v => !!v || 'Is required',
  'greaterThan0': v => v > 0 || 'Must be greater than 0',
  'availableImmediatelyForBooking': function (v) {
    if (!newEvent.value.isRecurring()) {
      return true;
    }
    return !v || 'A recurrent event cannot be available for booking immediately';
  }
},)

watch(step, function () {
  if (step.value < 1) {
    step.value = 1
  }
  if (step.value > 3) {
    step.value = 3;
  }
})

const currentTitle = computed(() => {
  switch (step.value) {
    case 1:
      return t('spotEvent.step1.title');
    case 2:
      return t('spotEvent.step2.title');
    case 3:
      return t('spotEvent.step3.title');
  }
})

const newEvent = ref(new SpotEvent())

function changeFrequencyType() {

  if (!newEvent.value.isRecurring()) {
    return
  }
  nextTick(function () {
    newEvent.value.applyDefaultFrequencyType(newEvent.value.frequencyType)
  })

}

async function isStepValid(stepForm) {
  const {valid} = await stepForm.validate()

  return valid;
}

async function validateStep() {


  switch (step.value) {
    case 1:
      if (await isStepValid(step1Form.value)) step.value++
      break;
    case 2:
      if (await isStepValid(step2Form.value)){
        if(newEvent.value.isRecurring()) {
          newEvent.value.computeEndDate()
        }
        step.value++
      }
      break;
    case 3:
    default:
      //do nothing
  }


}


async function submitEvent() {
  try {

    newEvent.value.createdAt = moment().format('YYYY-MM-DD HH:mm Z')
    newEvent.value.author = new Author(userStore.id, userStore.displayName)

    let docRef = null;
    if (newEvent.value.isRecurring()) {
      docRef = (await addDoc(collection(firestore, "recurrent_events").withConverter(recurrentEventConverter), newEvent.value));
    } else {
      docRef = (await addDoc(collection(firestore, "spot_events").withConverter(eventConverter), newEvent.value));
    }
    console.log("Document written with ID: ", docRef.id);
    isSaved.value = true
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

function getLocation(location) {
  newEvent.value.location = location;
}

function onLocationChange(formattedLocation) {

  newEvent.value.coordinates = new Coordinates(formattedLocation.latitude, formattedLocation.longitude);
}

function initRecurrentEvent() {

  if (newEvent.value.isRecurring()) {
    return;
  }

  const repeatableEvent = new RecurrentSpotEvent()

  Object.assign(repeatableEvent, newEvent.value);

  newEvent.value = repeatableEvent;

  changeFrequencyType()

  newEvent.value.availableImmediatelyForBooking = false
  newEvent.value.minutesAvailableForBooking = 1440
}

function disableRepeatableEvent() {

  if (!newEvent.value.isRecurring()) {
    return;
  }

  const newObj = new SpotEvent()
  Object.assign(newObj, newEvent.value);
  newEvent.value = newObj;
}

watch(() => newEvent.value.repeatOn, function () {
  newEvent.value.repeatOn.sort()
})
watch(() => newEvent.value.date, function () {
    changeFrequencyType()
})

const minutesAvailableForBooking = computed(() => {
  return buildListOfDurationOptions(30, 1440 * 7)
})
const durationOptions = computed(() => {
  return buildListOfDurationOptions(30, 1440 * 7)
})



</script>

<style scoped>

</style>