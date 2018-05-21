import Vue from 'vue'
import VueSocket from 'vue-plugin'
import App from './components/App.vue'

Vue.use(VueSocket)

const ws = new VueSocket({
  url: 'ws://localhost:8080/ws',
  debug: true,
  maxReconnectCount: 3,
  parse(data) {
    // 自定义解析ws返回数据
    // 需要和服务端协商传输数据格式都是json
    try {
      const { type, message } = JSON.parse(data)
      return [type, message]
    } catch (e) {
      return ['server', data]
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  ws,
  // replace the content of <div id="app"></div> with App
  render: h => h(App)
})
