<template>
  <div>
    <input type="text" v-model="inputMessage"/>
    <button @click="send">发送</button>
    <div v-html="outMessage"></div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      inputMessage: '',
      outMessage: ''
    }
  },
  methods: {
    send() {
      this.$ws.send(this.inputMessage)
      this.inputMessage = ''
    }
  },
  mounted() {
    this.$ws.on('reply', value => {
      this.outMessage += `<div><span style="color: red;">欢迎信息：</span>${value}</div>`
    })
    this.$ws.on('echo', value => {
      this.outMessage += `<div><span style="color: #006600;">服务器返回：</span>${value}</div>`
    })
  }
}
</script>

<style scoped>
</style>
