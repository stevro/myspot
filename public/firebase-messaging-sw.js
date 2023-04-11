/* eslint-disable no-undef */

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));

self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', function (event) {

    console.log(event);
    let notification = event.notification;

    let action = event.action;

    event.notification.close();

    if (!action) {
        return;
    }

    let fcmNotification = notification.data?.FCM_MSG?.notification || {}
    let data = notification.data?.FCM_MSG?.data || {}

    switch (action) {
        case 'OK':
            //ajax pt ok
            console.log('ok');
            break;
        case 'NOT_OK':
            //ajax pt not ok
            console.log('not ok');
            break;
        case 'GO_TO_URL':
            return self.clients.openWindow(data.url);
        case 'GO_TO_APP':
        default:

            event.waitUntil(clients.matchAll({includeUncontrolled: true}).then((clientList) => {

                if (clientList.length > 0) {
                    return clientList[0].focus().then(function (client) {
                        return client.postMessage({
                            appNotification: {
                                id: data.id,
                                title: fcmNotification.title,
                                body: fcmNotification.body,
                                payload: data
                            }, isUrgent: data.isUrgent === '1' || false
                        })
                    });
                }

                // if (clients.openWindow)
                //   return clients.openWindow('/');

                if (clients.openWindow) {
                    console.log('new window')
                    //urgent message don't wait for the user to click on a button
                    let url = data.url || '/';
                    return clients.openWindow(url).then(function (client) {

                        console.log(client)

                        setTimeout(function(){
                            console.log('post message')
                            client.postMessage({
                                appNotification: {
                                    id: data.id,
                                    title: fcmNotification.title,
                                    body: fcmNotification.body,
                                    payload: data
                                }, isUrgent: data.isUrgent === '1' || false
                            })
                        }, 1000)

                    });
                }

            }));

            break;
    }

}, false);


importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
    apiKey: "AIzaSyBDrWNuu2m_ewFAxrFXDPYf_Q4eFvS19ao",
    authDomain: "yaleemba23.firebaseapp.com",
    projectId: "yaleemba23",
    storageBucket: "yaleemba23.appspot.com",
    messagingSenderId: "749301824759",
    appId: "1:749301824759:web:e30d064d8b0efe0de3a7f2"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );

    let notification = payload.notification || {};
    let data = payload.data || {};

    // Customize notification here
    const notificationTitle = notification.title || 'New message while in background';
    const notificationOptions = {
        body: notification.body || '',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);


    clients.matchAll({includeUncontrolled: true}).then((clientList) => {
        if (clientList.length > 0) {
            return clientList[0].postMessage({
                appNotification: {
                    id: data.id,
                    title: payload.notification.title,
                    body: payload.notification.body,
                    payload: data
                }
            })
        }


    });
});



