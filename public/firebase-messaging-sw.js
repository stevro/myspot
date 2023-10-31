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
    apiKey: "AIzaSyCTGjg4n-tbjw4FnGOqNt5SFmqRepXzam8",
    authDomain: "my-spot.app",
    projectId: "myspot-346e8",
    storageBucket: "myspot-346e8.appspot.com",
    messagingSenderId: "61211815199",
    appId: "1:61211815199:web:6a4c3e726c1dcc2271542a"
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



