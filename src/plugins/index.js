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
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

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

  app.component('VueDatePicker', VueDatePicker);

  try{
    initFirebase(app)
  }catch (e){
    console.error(e);
  }
}
