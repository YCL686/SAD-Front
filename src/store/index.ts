
import { createStore } from "vuex";
import i18n from '../locales/index'

const store = createStore({
  state: () => {
    return {
      isLogined: false,
      locale: localStorage.getItem('locale') || 'en'
    }
  },
  mutations: {
    SET_LOCALE: (state, locale) => {
      state.locale = locale
      localStorage.setItem('locale', locale)
      i18n.global.locale = locale;
    },
    SET_IS_LOGINED: (state, isLogined) => {
      
      state.isLogined = isLogined;
      console.log("state.isLogined:", isLogined, state.isLogined)
    },
  },

  actions: {
    setLocale({ commit }, locale) {
      commit('SET_LOCALE', locale)
      localStorage.setItem('locale', locale)
      console.log(i18n)
      i18n.global.locale = locale;
    },
    setIsLogined({ commit }, isLogined) {
      commit('SET_IS_LOGINED', isLogined)
    },
  },

  getters: {
    language: (state) => {
      return state.locale
    },
  },
})

export default store