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
    profileLoaded: (state) => state.displayName !== null,
  },
  actions: {
    setUser(user) {

      localStorage.setItem('user-uid', user.uid);
      localStorage.setItem('user-displayName', user.displayName);
      localStorage.setItem('user-email', user.email);
      localStorage.setItem('user-locale', user.locale||'en');

      this.setUserProfile(user)
    },
    setUserProfile(user) {

      this.displayName = user.displayName
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

      this.$reset()
    }
  }
})
