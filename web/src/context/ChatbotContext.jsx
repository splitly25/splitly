import { createContext, useContext, useState } from 'react'

const ChatbotContext = createContext(undefined)

export const ChatbotProvider = ({ children }) => {
  const [chatbotWindowOpen, setChatbotWindowOpen] = useState(false)
  const [numberOfNotifications, setNumberOfNotifications] = useState(0)
  const [newMessage, setNewMessage] = useState('')

  const addNotification = (message) => {
    setNewMessage(message)
    setNumberOfNotifications((prev) => prev + 1)
  }

  const clearNotifications = () => {
    setNumberOfNotifications(0)
    setNewMessage('')
  }

  const openChatbot = () => {
    setChatbotWindowOpen(true)
    clearNotifications()
  }

  const closeChatbot = () => {
    setChatbotWindowOpen(false)
  }

  const toggleChatbot = () => {
    if (chatbotWindowOpen) {
      closeChatbot()
    } else {
      openChatbot()
    }
  }

  const value = {
    chatbotWindowOpen,
    setChatbotWindowOpen,
    numberOfNotifications,
    setNumberOfNotifications,
    newMessage,
    setNewMessage,
    addNotification,
    clearNotifications,
    openChatbot,
    closeChatbot,
    toggleChatbot,
  }

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
}

export const useChatbot = () => {
  const context = useContext(ChatbotContext)
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider')
  }
  return context
}
