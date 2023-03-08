/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import router from '../router'
import { createPinia } from 'pinia'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import {initFirebase} from "@/plugins/firebase";
import i18n from './i18n'

export function registerPlugins (app) {
  loadFonts()

  const pinia = createPinia()

  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(i18n)

  app.component('VueCtkDateTimePicker', VueCtkDateTimePicker);

  try{
    initFirebase(app)
  }catch (e){
    console.error(e);
  }
}
