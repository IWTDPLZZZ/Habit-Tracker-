import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Star, Zap } from 'lucide-react'
import type { ToastNotification } from '@/types/gamification'

interface ToastProps {
  notification: ToastNotification
  onClose: () => void
}

const Toast = ({ notification, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const getIcon = () => {
    switch (notification.type) {
      case 'achievement':
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 'points':
        return <Star className="w-6 h-6 text-blue-500" />
      case 'level_up':
        return <Zap className="w-6 h-6 text-purple-500" />
      default:
        return notification.icon ? <span className="text-2xl">{notification.icon}</span> : null
    }
  }

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'achievement':
        return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
      case 'points':
        return 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'
      case 'level_up':
        return 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
      default:
        return 'bg-white border-gray-200'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.3 
          }}
          className={`fixed top-4 right-4 z-50 max-w-sm w-full ${getBackgroundColor()} border rounded-xl shadow-lg p-4`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {notification.title}
                </h4>
                <button
                  onClick={() => {
                    setIsVisible(false)
                    setTimeout(onClose, 300)
                  }}
                  className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
              {notification.points && (
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-700">
                    +{notification.points} очков
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ToastContainerProps {
  notifications: ToastNotification[]
  onRemoveNotification: (id: string) => void
}

export const ToastContainer = ({ notifications, onRemoveNotification }: ToastContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={() => onRemoveNotification(notification.id)}
        />
      ))}
    </div>
  )
}

export default Toast
