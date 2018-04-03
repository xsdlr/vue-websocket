import { isDef } from './utils/lang'

export default function install(Vue) {
  if (install.installed) return
  install.installed = true

  Vue.mixin({
    beforeCreate() {
      if (isDef(this.$options.ws)) {
        this.$_wsRoot = this
        this._ws = this.$options.ws
        this._ws.init()
      } else {
        this.$_wsRoot = (this.$parent && this.$parent.$_wsRoot) || this
      }
    },
    destroyed() {
      const ws = this.$_wsRoot._ws
      ws.off(this)
      if (isDef(this.$options.ws)) {
        ws.destroy()
      }
    }
  })
  Object.defineProperty(Vue.prototype, '$ws', {
    get() {
      const _this = this
      return {
        on(type, cb) {
          const ws = _this.$_wsRoot._ws
          ws.on(_this, type, cb)
        },
        off(type) {
          const ws = _this.$_wsRoot._ws
          ws.off(_this, type)
        },
        send(json) {
          const ws = _this.$_wsRoot._ws
          ws.send(json)
        }
      }
    }
  })
}
