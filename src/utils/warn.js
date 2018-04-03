export function assert(codition, message) {
  if (!codition) throw new Error(message)
}

export const tryCatch = (fn, message) => (...args) => {
  try {
    return fn.apply(null, args)
  } catch (e) {
    throw Object.assign(e, { message: message || e.message })
  }
}
