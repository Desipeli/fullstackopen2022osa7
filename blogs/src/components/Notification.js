import { useSelector } from 'react-redux'

const Notification = () => {
  const selector = (state) => state.notification
  const notification = useSelector(selector)
  if (!notification.message) {
    return null
  }

  return (
    <div className={notification.notificationClass}>{notification.message}</div>
  )
}

export default Notification
