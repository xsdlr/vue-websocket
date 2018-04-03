import install from './install'
import { inBrowser } from './utils/dom'
import SmartWebsocket from 'smart-websocket'
import { groupBy, isRegExp } from 'lodash'
import Vue from 'vue'
import { isVm } from './utils/lang'
import { assert, tryCatch } from './utils/warn'

function defaultParse(data) {
  const { type, body } = JSON.parse(data)
  return [type, body]
}

export default class WS {
  constructor(options) {
    this.bus = new Vue()
    this.listeners = []
    const { url, debug, parse = defaultParse } = options
    this.parse = tryCatch(parse, '解析错误')
    this.debug = debug
    this.socket = new SmartWebsocket(url, options)
  }
  init() {
    const { debug, socket } = this
    if (debug) {
      socket.addEventListener('connecting', ({ reconnectCount }) => console.log('[ws] connecting', reconnectCount))
      socket.addEventListener('open', ({ reconnectCount }) => console.log('[ws] open', reconnectCount))
      socket.addEventListener('close', ({ reconnectCount }) => console.log('[ws] close', reconnectCount))
      socket.addEventListener('error', ({ reconnectCount }) => console.log('[ws] error', reconnectCount))
    }
    socket.addEventListener('message', ({ reconnectCount, data }) => {
      try {
        const [type, body] = this.parse(data)
        assert(type, '类型错误')
        this.emit(type, body)
      } catch (err) {
        console.error(err)
      }
    })
  }
  destroy() {
    const listeners = ['connecting', 'open', 'close', 'error', 'message']
    this.bus.$off()
    listeners.forEach(this.socket.removeEventListener.bind(this.socket))
  }
  genKey(data) {
    const vnode = data.$vnode || {}
    return isVm(data) ? vnode.key || (vnode.isComment ? 'comment' : vnode.tag) : data
  }
  emit(type, payload) {
    this.listeners
      .filter(listener => {
        const listenerType = listener.type
        return isRegExp(listenerType) ? listenerType.test(type) : listenerType === type
      })
      .forEach(({ key }) => {
        this.bus.$emit(key, payload)
      })
  }
  on(vm, type, cb) {
    const key = this.genKey(vm)
    const listeners = this.listeners.concat({ key, type })
    this.listeners = listeners
    this.bus.$on(key, cb)
    this.debug && console.log('[ws] addListeners', listeners, this.listeners)
  }
  off(vm, type) {
    const key = this.genKey(vm)
    const listeners = groupBy(this.listeners, ({ key: lKey, type: lType }) => {
      return key === lKey && (!type || type === lType) ? 'filter' : 'remain'
    })
    const { filter = [], remain = [] } = listeners
    this.listeners = remain
    filter.forEach(({ key }) => this.bus.$off(key))
    this.debug && filter.length && console.log('[ws] removeListeners', filter, this.listeners)
  }
  send(json) {
    this.socket.send(JSON.stringify(json))
  }
}

WS.install = install
WS.version = '__VERSION__'

if (inBrowser && window.Vue) {
  window.Vue.use(WS)
}
