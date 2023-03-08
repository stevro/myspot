import { createI18n } from 'vue-i18n'
import {messages} from "@/locales";

export default createI18n({
  legacy: true,
  allowComposition: true,
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: messages

})
