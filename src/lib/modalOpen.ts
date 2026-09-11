let openCount = 0
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function subscribeModalOpen(onStoreChange: () => void) {
  listeners.add(onStoreChange)
  return () => {
    listeners.delete(onStoreChange)
  }
}

export function getModalOpen() {
  return openCount > 0
}

export function getModalOpenServer() {
  return false
}

export function lockModalOpen(active: boolean) {
  if (active) openCount += 1
  else openCount = Math.max(0, openCount - 1)
  emit()
}
