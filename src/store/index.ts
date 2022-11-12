
import { createStore } from "vuex";
import i18n from '../locales/index'

const store = createStore({
  state: () => {
    return {
      isMobile: navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i),
      isLogined: localStorage.getItem('token') != null ? true : false,
      locale: localStorage.getItem('locale') || 'en',
      userId: localStorage.getItem('userId') || 0,
      nickName:localStorage.getItem('nickName') || '',
      avatarUrl: localStorage.getItem('avatarUrl') || ''
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
    SET_NICKNAME: (state, nickName) =>{
      state.nickName = nickName;
      localStorage.setItem('nickName', nickName)
    },
    SET_AVATAR_URL: (state, avatarUrl) => {
      state.avatarUrl = avatarUrl
      localStorage.setItem('avatarUrl', avatarUrl)
    },
    SET_USER_ID:(state, userId) => {
      state.userId = userId
      localStorage.setItem('userId', userId)
    }
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
    setNickName({commit}, nickName){
      commit('SET_NICKNAME', nickName)
    },
    setAvatarUrl({commit}, avatarUrl){
      commit('SET_AVATAR_URL', avatarUrl)
    },
    setUserId({commit}, userId){
      commit('SET_USER_ID', userId)
    }
  },

  getters: {
    language: (state) => {
      return state.locale
    },
  },
})

export default store