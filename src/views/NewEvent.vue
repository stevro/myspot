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
                  <v-autocomplete v-model="newEvent.category" clearable :label="$t('spotEvent.category')"
                                  :items="nomenclatures.categories" item-title="name" return-object
                                  :rules="rules.required"
                  >

                  </v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="3">
                  <v-text-field v-model="newEvent.title" :label="$t('spotEvent.title')"
                                :rules="rules.required"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="newEvent.description" :label="$t('spotEvent.description')"
                                ></v-text-field>
                </v-col>

              </v-row>
            </v-card-text>
          </v-form>
        </v-window-item>

        <v-window-item :value="2">
          <v-form ref="step2Form">
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-validation
                      :rules="rules.required"
                      v-model="newEvent.date"
                  >

                    <VueDatePicker
                        :placeholder="$t('spotEvent.date')"
                        v-model="newEvent.date"
                        model-type="yyyy-MM-dd HH:mm"
                        format="dd-MM-yyyy HH:mm"
                        :is-24="true"
                        :min-date="currentDate"
                        teleport="body"
                        :locale="userStore.locale"
                        required
                    >

                    </VueDatePicker>

                  </v-validation>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="newEvent.location" :label="$t('spotEvent.location')"
                                :rules="rules.required"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-select :items="nomenclatures.durations" v-model="newEvent.duration" :label="$t('spotEvent.duration')"
                            item-title="name"
                            item-value="value"
                            :return-object="false"
                            :rules="rules.required"
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
                  <small>{{$t("spotEvent.allowReserves_hint")}}</small>
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
            <v-alert :title="$t('spotEvent.actions.created')" :text="$t('spotEvent.created')" type="success"></v-alert>
          </v-col>
          <v-col cols="12">
            <v-btn :to="{name:'dashboard'}" block>
              {{$t('common.btn.go_to_list')}}
            </v-btn>
          </v-col>
        </v-row>

      </v-card-actions>
    </v-card>

  </v-container>
</template>

<script setup>

import {computed, inject, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {useNomenclaturesStore} from "@/stores/nomenclatures";
import {addDoc, collection} from "firebase/firestore";
import {useUserStore} from "@/stores/user";
import moment from "moment/moment";
import eventConverter from "@/converters/eventConverter";
import SpotEvent from "@/models/spotEvent";
import Author from "@/models/author";


const {t} = useI18n()
const firestore = inject('firestore')
const nomenclatures = useNomenclaturesStore()
const userStore = useUserStore()
const step = ref(1)
const step1Form = ref(null);
const step2Form = ref(null);
const isSaved = ref(false)

const currentDate = computed(function(){
  return moment().format('YYYY-MM-DD HH:mm')
})

const rules = ref({
  'required': [
    v => !!v || 'Is required',
  ],
  'greaterThan0': v => v > 0 || 'Must be greater than 0',
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
      if (await isStepValid(step2Form.value)) step.value++
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

    const docRef = (await addDoc(collection(firestore, "spot_events").withConverter(eventConverter), newEvent.value));
    console.log("Document written with ID: ", docRef.id);
    isSaved.value = true
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}


</script>

<style scoped>

</style>