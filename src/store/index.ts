
import { createStore } from "vuex";
import i18n from '../locales/index'

const store = createStore({
    state: () => {
        return {
            locale: localStorage.getItem('locale') || 'en'
        }
    },
    mutations: {
      SET_LOCALE: (state, locale) => {
        state.locale = locale
        localStorage.setItem('locale', locale)
        i18n.global.locale = locale;
      },
    },
  
    actions: {
      setLocale({ commit }, locale) {
        commit('SET_LOCALE', locale)
        localStorage.setItem('locale', locale)
        console.log(i18n)
        i18n.global.locale = locale;
        console.log(i18n.global.t('buttons.connectWallet'))
      },
    },
  
    getters: {
      language: (state) => {
        return state.locale
      },
    },
})

export default store