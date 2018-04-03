export function isVm(vm) {
  return !!vm.$vnode
}

export const isDef = v => v !== undefined
