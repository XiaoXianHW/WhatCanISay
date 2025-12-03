import { motion } from 'framer-motion'

interface ChatMessageProps {
  text: string
  sender?: string
  avatar?: string
  time?: string
  isUser?: boolean
  delay?: number
}

export default function ChatMessage({ 
  text, 
  sender = '对方', 
  avatar,
  time,
  isUser = false, 
  delay = 0 
}: ChatMessageProps) {
  const getInitials = (name: string) => {
    return name.slice(0, 1).toUpperCase()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: 'easeOut' }}
      className={`flex gap-2 mb-4 px-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* 头像 */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium shadow-sm">
        {avatar ? (
          <img src={avatar} alt={sender} className="w-full h-full rounded-full object-cover" />
        ) : (
          getInitials(sender)
        )}
      </div>

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} flex-1`}>
        {/* 用户名和时间 */}
        {!isUser && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{sender}</span>
            {time && <span className="text-xs text-tertiary">{time}</span>}
          </div>
        )}
        
        {/* 消息气泡 */}
        <div className={`chat-bubble ${isUser ? 'chat-bubble-sent' : 'chat-bubble-received'}`}>
          <p className="text-sm leading-relaxed">{text}</p>
        </div>
        
        {/* 用户消息的时间 */}
        {isUser && time && (
          <span className="text-xs text-tertiary mt-1 px-1">{time}</span>
        )}
      </div>
    </motion.div>
  )
}
