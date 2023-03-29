import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            id: localStorage.getItem('user-uid') || null,
            displayName: localStorage.getItem('user-displayName') || null,
            email: localStorage.getItem('user-email') || null,
            locale: localStorage.getItem('user-locale') || 'en',
        }
    },
    getters: {
        profileLoaded: (state) => state.id !== null,
        publicProfile: (state) => function () {
            return {
                id: state.id,
                displayName: state.displayName,
            }
        }
    },
    actions: {
        setUser(user) {

            localStorage.setItem('user-uid', user.uid);
            localStorage.setItem('user-displayName', user.displayName || user.email.split('@',1).pop());
            localStorage.setItem('user-email', user.email);
            localStorage.setItem('user-locale', user.locale || 'en');

            this.setUserProfile(user)
        },
        setUserProfile(user) {

            this.id = user.uid;
            this.displayName = user.displayName || user.email.split('@',1).pop()
            this.email = user.email
            this.locale = user.locale || 'en'

        },
        async changeUserLocale(token, locale) {
            this.locale = locale || 'en'
            localStorage.setItem('user-locale', locale);

        },
        clearUserData() {


            localStorage.removeItem('user-displayName');
            localStorage.removeItem('user-email');
            localStorage.removeItem('user-locale');
            localStorage.removeItem('user-id');

            this.$reset()
        }
    }
})
