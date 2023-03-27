<template>
  <v-btn size="small" color="error" variant="flat" block @click="withdraw">{{
      $t('eventItem.withdraw')
    }}
  </v-btn>
</template>

<script setup>

import SpotEvent from "@/models/spotEvent";
import {useUserStore} from "@/stores/user";
import {doc, setDoc} from "firebase/firestore";
import eventConverter from "@/converters/eventConverter";
import {inject} from "vue";
const firestore = inject('firestore')

const userStore = useUserStore()
const props = defineProps({
  spotEvent: SpotEvent
})

async function withdraw() {
  let spotEvent = props.spotEvent

  if(!spotEvent.isParticipant(userStore.id) && !spotEvent.isReserve(userStore.id)){
    return false;
  }

  spotEvent.withdraw(userStore.id)

  if(spotEvent.participants.length < spotEvent.totalSpots && spotEvent.reserves.length > 0){

    let firstReserve = spotEvent.reserves.shift()
      spotEvent.addParticipant(firstReserve)
  }

  await setDoc(doc(firestore, "spot_events", spotEvent.id).withConverter(eventConverter), spotEvent);
}

</script>

<style scoped>

</style>