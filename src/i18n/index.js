import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import CN from './config/tw/index'
import EN from './config/en/index'
import JP from './config/jp/index'
import KO from './config/ko/index'
import DE from './config/de/index'
import ES from './config/es/index'
import FR from './config/fr/index'
import IT from './config/it/index'
import PT from './config/pt/index'
import ID from './config/id/index'
import VI from './config/vi/index'

const systemLangStr = localStorage.getItem('locale') || 'EN';
if (systemLangStr.includes('CN')) {
  localStorage.setItem('locale', 'CN')
} else if (systemLangStr.includes('JP')) {
  localStorage.setItem('locale', 'JP')
} else if (systemLangStr.includes('KO')) {
  localStorage.setItem('locale', 'KO')
} else if (systemLangStr.includes('DE')) {
  localStorage.setItem('locale', 'DE')
} else if (systemLangStr.includes('ES')) {
  localStorage.setItem('locale', 'ES')
} else if (systemLangStr.includes('FR')) {
  localStorage.setItem('locale', 'FR')
} else if (systemLangStr.includes('IT')) {
  localStorage.setItem('locale', 'IT')
} else if (systemLangStr.includes('PT')) {
  localStorage.setItem('locale', 'PT')
} else if (systemLangStr.includes('ID')) {
  localStorage.setItem('locale', 'ID')
} else if (systemLangStr.includes('VI')) {
  localStorage.setItem('locale', 'VI')
} else {
  localStorage.setItem('locale', 'EN')
}

const i18n = new VueI18n({
  locale: localStorage.getItem('locale') || 'EN',
  messages: {
    CN,
    EN,
    JP,
    KO,
    DE,
    ES,
    FR,
    IT,
    PT,
    ID,
    VI
  }
})

export default i18n
