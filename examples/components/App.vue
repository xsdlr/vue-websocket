<template>
  <div>
    <input type="text" v-model="inputMessage"/>
    <button @click="send">发送</button>
    <div>
      <button v-if="isListenOn.welcome" @click="removeListener('welcome')">解除welcome监听</button>
      <button v-else @click="listenOnWelcome">添加welcome监听</button>
      <button v-if="isListenOn.echo" @click="removeListener('echo')">解除echo监听</button>
      <button v-else @click="listenOnEcho">添加echo监听</button>
      <button v-if="isListenOn.reverseEcho" @click="removeListener('reverseEcho')">解除reverseEcho监听</button>
      <button v-else @click="listenOnReverseEcho">添加reverseEcho监听</button>
      <button v-if="isAllListenerOff" @click="addAllListener">添加所有监听</button>
      <button v-else @click="removeAllListener">解除所有监听</button>
    </div>
    <div v-html="outMessage"></div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      inputMessage: '',
      outMessage: '',
      isListenOn: {}
    }
  },
  computed: {
    isAllListenerOff() {
      return !Object.values(this.isListenOn).reduce((a, b) => a || b, false)
    }
  },
  methods: {
    send() {
      this.$ws.send(this.inputMessage)
      this.inputMessage = ''
    },
    listenOnWelcome() {
      this.addListener('welcome', value => {
        this.outMessage += `<div><span style="color: red;">欢迎信息：</span>${value}</div>`
      })
    },
    listenOnEcho() {
      this.addListener('echo', value => {
        this.outMessage += `<div><span style="color: #006600;">服务器返回：</span>${value}</div>`
      })
    },
    listenOnReverseEcho() {
      this.addListener('reverseEcho', value => {
        this.outMessage += `<div><span style="color: #006600;">服务器返回(reverse数据)：</span>${value}</div>`
      })
    },
    addAllListener() {
      this.listenOnWelcome()
      this.listenOnEcho()
      this.listenOnReverseEcho()
    },
    removeAllListener() {
      this.removeListener()
    },
    addListener(type, handler) {
      this.$ws.on(type, handler)
      this.$set(this.isListenOn, type, true)
    },
    removeListener(type) {
      this.$ws.off(type)
      if (type) {
        this.$set(this.isListenOn, type, false)
      } else {
        this.isListenOn = {}
      }
    }
  },
  mounted() {
    this.addAllListener()
  }
}
</script>

<style scoped>
</style>
