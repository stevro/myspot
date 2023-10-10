<template>

  <v-btn v-if="spotEvent.isParticipant(userStore.id)" size="small" color="success" disabled variant="flat" block>{{
      $t('eventItem.is_participant')
    }}
  </v-btn>
  <v-btn v-else-if="spotEvent.isReserve(userStore.id)" size="small" color="purple" disabled variant="flat" block>{{
      $t('eventItem.is_reserve')
    }}
  </v-btn>
  <v-btn size="small" color="primary" variant="flat" disabled block
      v-else-if="props.spotEvent.isFull()"
  >
    {{$t('eventItem.fully_booked')}}
  </v-btn>

  <v-btn size="small" color="primary" variant="flat" block
         @click="bookSpot"
         v-else-if="!props.spotEvent.hasBookedSpot(userStore.id)"
  >
    {{ $t('eventItem.book_spot') }}
  </v-btn>


</template>

<script setup>
import {inject} from "vue";
import SpotEvent from "@/models/spotEvent";
import {useUserStore} from "@/stores/user";
import {doc, setDoc} from "firebase/firestore";
import eventConverter from "@/converters/eventConverter";
import {useI18n} from "vue-i18n";

const firestore = inject('firestore')
const {t} = useI18n()
const props = defineProps({
  spotEvent: SpotEvent
})
const userStore = useUserStore()

async function bookSpot() {

  let spotEvent = props.spotEvent

  if (spotEvent.hasBookedSpot(userStore.id)) {
    console.log('already booked')
    return false;
  }

  if(spotEvent.hasDatePassed()){
    console.log('date passed')
    return false;
  }

  spotEvent.addParticipant(userStore.publicProfile())

  await setDoc(doc(firestore, "spot_events", spotEvent.id).withConverter(eventConverter), spotEvent);

}

</script>

<style scoped>

</style>