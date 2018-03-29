import plugin from '@'
import Vue from 'vue'
Vue.use(plugin)

describe('$hello', () => {
  let vm

  beforeEach(() => {
    vm = new Vue()
  })

  it('hello world', () => {
    assert.equal(vm.$hello(), 'hello world')
  })

  it('hello xsdlr', () => {
    assert.equal(vm.$hello('xsdlr'), 'hello xsdlr')
  })
})
