import { install } from './install'
import { inBrowser } from './utils/dom'

export default class Plugin {
}

Plugin.install = install
Plugin.version = '__VERSION__'

if (inBrowser && window.Vue) {
  window.Vue.use(Plugin)
}
