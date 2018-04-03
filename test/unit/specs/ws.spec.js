import plugin from '@'
import Vue from 'vue'
Vue.use(plugin)

describe('$ws', () => {
  let vm

  beforeEach(() => {
    vm = new Vue()
  })

  it('ws', () => {
    assert.equal(!!vm, true)
  })
})
