import icon from '../../assets/logo.png'

function isNotificationAllowed () {
  if (!('Notification' in window)) {
    return false
  }
  if (window.Notification.permission === 'granted') {
    return true
  }
  let isAllowed = false
  if (window.Notification.permission !== 'denied') {
    window.Notification.requestPermission((permission) => {
      isAllowed = permission === 'granted'
    })
    return isAllowed
  }
  return isAllowed
}
export default {
  push (title, body) {
    const options = {
      body,
      icon
    }
    if (!isNotificationAllowed()) {
      return window.alert([title, body].join('. '))
    }

    const notification = new window.Notification(title, options)
    window.setTimeout(notification.close.bind(notification), 5000)
    return notification
  }
}

// The notification exposes several other useful events
// notification.addEventListener('click', () => {
//   console.log('onclick')
// })
// notification.addEventListener('show', () => {
  // console.log('shown')
// })
// notification.addEventListener('error', () => {
  // console.log('error')
// })
