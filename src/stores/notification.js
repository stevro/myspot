import {defineStore} from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => {
    return {
      /*
      {
      id: String,
      title: String,
      body: String,
      isRead: Boolean
      }
       */
      notifications: JSON.parse(localStorage.getItem('notifications')) || []
    }
  },
  getters: {
    count: (state) => state.notifications.length,
    unreadCount: (state) => state.notifications.filter(notif => notif.isRead === false).length,
    hasUnread: (state) => state.notifications.some(notif => notif.isRead === false),
  },
  actions: {

    addNotification(notification) {

      let newNotification = {
        id: Math.random(),
        title: null,
        body: null,
        isRead: false,
      }

      Object.assign(newNotification, notification)

      if (this.notifications.some(notif => notif.id === newNotification.id) === true) {
        //notification already added
        return;
      }

      this.notifications.unshift(newNotification)

      this.saveNotifications()
    },
    readNotification(id, token) {

      this.notifications = this.notifications.filter((n) => n.id !== id);

      this.saveNotifications()
    },
    saveNotifications() {
      localStorage.setItem('notifications', JSON.stringify(this.notifications))
    },
    clearNotificationsData() {
      this.$reset()
    }
  }
})
