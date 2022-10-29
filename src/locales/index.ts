import { createI18n } from 'vue-i18n'
import zhCn from './zh-cn'
import en from './en'
import fre from './fre'
import ger from './ger'
import jpn from './jpn'
import kor from './kor'
import zhTc from './zh-tc'

// 创建 i18n
const i18n = createI18n({
  legacy: false,
  globalInjection: true, // 全局模式，可以直接使用 $t
  locale: localStorage.getItem('locale') || 'en',
  messages: {
    zhCn,
    en,
    fre,
    ger,
    jpn,
    kor,
    zhTc
  }
})

export default i18n