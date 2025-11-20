import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { jsonToMarkdown } from '~/utils/assistantHelpers'

const ChatbotContext = createContext(undefined)

export const ChatbotProvider = ({ children }) => {
    const [chatbotWindowOpen, setChatbotWindowOpen] = useState(false)
    const [numberOfNotifications, setNumberOfNotifications] = useState(0)
    const [newMessage, setNewMessage] = useState('')
    const [pageContext, setPageContext] = useState(null)


    const addNotification = useCallback((message) => {
        setNewMessage(message)
        setNumberOfNotifications((prev) => prev + 1)
    }, [])

    const clearNotifications = useCallback(() => {
        setNumberOfNotifications(0)
        setNewMessage('')
    }, [])

    const openChatbot = useCallback(() => {
        setChatbotWindowOpen(true)
        clearNotifications()
    }, [clearNotifications])

    const closeChatbot = useCallback(() => {
        setChatbotWindowOpen(false)
    }, [])

    const toggleChatbot = useCallback(() => {
        if (chatbotWindowOpen) {
            closeChatbot()
        } else {
            openChatbot()
        }
    }, [chatbotWindowOpen, closeChatbot, openChatbot])

    const updatePageContext = useCallback((contextData) => {
        setPageContext(prevContext => {
            // Only update if data actually changed (deep comparison)
            try {
                const prevString = JSON.stringify(prevContext)
                const newString = JSON.stringify(contextData)
                if (prevString === newString) {
                    return prevContext
                }
            } catch (error) {
                console.error('Error comparing context data:', error)
            }
            return contextData
        })

        console.log('Updated page context:', contextData)
    }, [])

    const clearPageContext = useCallback(() => {
        setPageContext(null)
    }, [])

    const getPageContextSummary = useCallback(() => {
        if (!pageContext) return null

        let summary = jsonToMarkdown(pageContext)
        return summary.trim()
    }, [pageContext])

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
        pageContext,
        updatePageContext,
        clearPageContext,
        getPageContextSummary,
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
