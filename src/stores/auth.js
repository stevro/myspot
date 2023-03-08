import { defineStore } from 'pinia'



export const useAuthenticationStore = defineStore('authentication', {
  state: () => {
    return {
      token: localStorage.getItem('user-token') || null,
    }
  },
  getters: {
    loggedIn: (state) => state.token !== null,
  },
  actions: {
    // no context as first argument, use `this` instead
    authenticate (user) {
      localStorage.setItem('user-token', user.email);

      this.setAuthToken(user.email)

    },
    setAuthToken (_token) {
      this.token = _token
    },
    clearAuthToken () {
      localStorage.removeItem('user-token');
      this.$reset()
    }
  }
})
