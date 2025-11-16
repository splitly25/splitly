// insert a new notification message into sessionStorage 
export const addNotificationMessage = (message) => {
    try {
        const notifications = JSON.parse(sessionStorage.getItem('chatMessages')) || []
        const newNotification = {
            id: notifications.length + 1,
            content: message,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
            role: 'notification'
        }
        notifications.push(newNotification)
        sessionStorage.setItem('chatMessages', JSON.stringify(notifications))
    } catch (error) {
        console.error('Error adding notification message:', error)
    }
}