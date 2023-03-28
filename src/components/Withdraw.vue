<template>
  <v-btn size="small" color="error" variant="flat" block @click="withdraw">{{
      $t('eventItem.withdraw')
    }}
  </v-btn>
</template>

<script setup>

import SpotEvent from "@/models/spotEvent";
import {useUserStore} from "@/stores/user";
import {deleteDoc, doc, setDoc} from "firebase/firestore";
import eventConverter from "@/converters/eventConverter";
import {inject} from "vue";
import Swal from "sweetalert2";
import {useI18n} from "vue-i18n";
const {t} = useI18n()
const firestore = inject('firestore')

const userStore = useUserStore()
const props = defineProps({
  spotEvent: SpotEvent
})

async function withdraw() {

  Swal.fire({
    title: t('common.confirm.title'),
    //text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: t('common.confirm.withdraw_confirm')
  }).then((result) => {
    if (result.isConfirmed) {
      let spotEvent = props.spotEvent

      if (!spotEvent.isParticipant(userStore.id) && !spotEvent.isReserve(userStore.id)) {
        return false;
      }

      spotEvent.withdraw(userStore.id)

      setDoc(doc(firestore, "spot_events", spotEvent.id).withConverter(eventConverter), spotEvent);
    }
  })


}

</script>

<style scoped>

</style>