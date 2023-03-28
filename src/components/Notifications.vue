<template>
  <v-menu open-on-hover bottom offset-y max-height="250px">
    <template v-slot:activator="{ props }">
      <v-btn
        text
        v-bind="props"
      >
        <v-badge v-if="notificationsCount > 0" :content="notificationsCount" bottom color="red">
          <v-icon small>mdi-bell-ring</v-icon>
        </v-badge>

        <v-icon v-else small>mdi-bell-ring</v-icon>

      </v-btn>
    </template>

    <v-list v-if="notificationsCount">

      <v-list-item v-for="notification in notifications" :key="notification.id"
                   @click="showNotification(notification)">
        <v-list-item-title>{{ notification.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
    <v-list v-else>

      <v-list-item>
        <v-list-item-title>{{ $t('notifications.empty') }}</v-list-item-title>
      </v-list-item>
    </v-list>

  </v-menu>

  <v-snackbar
    v-model="showNotificationPopup"
    multi-line
    location="top"
    timeout="-1"
    color="primary"
    elevation="24"
  >
    <template v-slot:default v-if="currentNotification">
      {{ currentNotification.title }}
      <span v-if="currentNotification.body"><br/>{{ currentNotification.body }}</span>
    </template>


    <template v-slot:actions>
      <v-btn
        color="white"
        variant="tonal"
        @click="closeNotification(currentNotification)"
        icon="mdi-close"
        size="small"
      ></v-btn>
    </template>
  </v-snackbar>

</template>

<script setup>

import {computed, ref} from "vue";
import {useNotificationStore} from "@/stores/notification";
import {useAuthenticationStore} from "@/stores/auth";

const authenticationStore = useAuthenticationStore()
const notificationStore = useNotificationStore()

const currentNotification = ref(null);
const showNotificationPopup = ref(false);
const notifications = computed(() => notificationStore.notifications)

const notificationsCount = computed(function () {
  return notificationStore.unreadCount;
})

function showNotification(notification) {
  currentNotification.value = notification;
  showNotificationPopup.value = true;
}

function closeNotification(notification) {
  notificationStore.readNotification(notification.id, authenticationStore.token);
  currentNotification.value = null;
  showNotificationPopup.value = false;
}

</script>

<style scoped>

</style>
