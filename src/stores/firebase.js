import {defineStore} from 'pinia'
import {getMessaging, getToken, onMessage} from "firebase/messaging";


import {useNotificationStore} from "@/stores/notification";


export const useFirebaseStore = defineStore('firebase', {
    state: () => {
        return {
            token: localStorage.getItem('firebaseDeviceToken') || null,
        }
    },
    getters: {},
    actions: {
        // no context as first argument, use `this` instead
        init(authToken, firebase) {

            const messaging = getMessaging(firebase);

            const notificationStore = useNotificationStore()

            //this is for foreground messages
            onMessage(messaging, (payload) => {

                console.log(payload);

                let notification = payload.notification || {}

                notificationStore.addNotification({
                    id: payload.messageId,
                    title: notification.title || "New message",
                    body: notification.body || '',
                    isRead: false,
                })


            });

            getToken(messaging, {
                vapidKey:
                import.meta.env.VITE_FIREBASE_VAPID_KEY,
            })
                .then((currentToken) => {

                    if (currentToken) {
                        this.setFirebaseToken(currentToken);
                        localStorage.setItem("firebaseDeviceToken", currentToken);
                    }

                })
                .catch((e) => {
                    console.error(e);
                    localStorage.removeItem("firebaseDeviceToken");

                });


            //this is needed for messages passed from background SW to foreground SW
            navigator.serviceWorker.addEventListener("message", (event) => {

                if (typeof event.data.appNotification === "undefined") {
                    return;
                }

                console.log('message from SW');
                console.log(event);

                let swNotification = event.data.appNotification;

                notificationStore.addNotification({
                    id: swNotification.id || window.btoa(swNotification.title),
                    title: swNotification.title || 'New message',
                    body: swNotification.body || '',

                })

            });

        },

        setFirebaseToken(_token) {
            this.token = _token
        },
        clearFirebaseToken() {
            localStorage.removeItem('firebaseDeviceToken');
            this.$reset()
        }
    }
})
