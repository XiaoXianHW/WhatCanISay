import { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { HiClock, HiPaperAirplane } from 'react-icons/hi2'
import type { Scenario } from '@/types'
import ChatMessage from './ChatMessage'

interface ScenarioCardProps {
  scenario: Scenario
  onAnswer: (answer: string, timeTaken: number) => void
}

export default function ScenarioCard({ scenario, onAnswer }: ScenarioCardProps) {
  const [answer, setAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(scenario.timeLimit || 30)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  
  const startTimeRef = useRef(Date.now())
  const answerRef = useRef('')
  const hasSubmittedRef = useRef(false)

  // 更新 ref
  useEffect(() => {
    answerRef.current = answer
  }, [answer])

  useEffect(() => {
    // 重置状态
    setAnswer('')
    setTimeLeft(scenario.timeLimit || 30)
    setIsSubmitting(false)
    setShowMessages(true)
    startTimeRef.current = Date.now()
    hasSubmittedRef.current = false
    answerRef.current = ''
    
    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(timer)
          if (!hasSubmittedRef.current) {
            hasSubmittedRef.current = true
            const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000)
            const finalAnswer = answerRef.current.trim() || '(未回答)'
            onAnswer(finalAnswer, timeTaken)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [scenario.id, onAnswer])

  const handleSubmit = () => {
    if (isSubmitting || hasSubmittedRef.current) return
    setIsSubmitting(true)
    hasSubmittedRef.current = true
    
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000)
    const finalAnswer = answer.trim() || '(未回答)'
    onAnswer(finalAnswer, timeTaken)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && answer.trim()) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const isUrgent = timeLeft <= 10

  // 获取主要发送者信息（取第一条消息的发送者）
  const getSenderInfo = () => {
    const firstSender = scenario.messages && scenario.messages.length > 0 
      ? scenario.messages[0].sender 
      : '对方'
    
    // 根据类型设置状态
    const status = scenario.category === '网络对线' ? '活跃' : '在线'
    
    return { name: firstSender, status }
  }

  const senderInfo = getSenderInfo()
  const currentTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex flex-col h-full">
      {/* 场景信息头部 */}
      <div className="card mb-3 overflow-hidden shrink-0">
        <div className="chat-app-header flex items-center justify-between">
          <div className="flex-1 mr-4">
            <div className="text-base font-bold">{scenario.title}</div>
            <div className="text-xs text-secondary mt-0.5">
              {scenario.subtitle}
            </div>
          </div>
          {/* 计时器 */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
            <HiClock className={`w-4 h-4 ${isUrgent ? 'text-red-500 animate-pulse' : 'text-secondary'}`} />
            <span className={`text-sm font-mono font-medium ${
              isUrgent ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'
            }`}>
              {String(timeLeft).padStart(2, '0')}s
            </span>
          </div>
        </div>

        {/* 聊天消息区域 */}
        <div className="flex-1 overflow-y-auto py-4 bg-gray-50 dark:bg-neutral-900 min-h-0">
          <AnimatePresence>
            {showMessages && (
              <>
                {/* 日期分隔 */}
                <div className="flex justify-center mb-4">
                  <div className="px-3 py-1 text-xs text-tertiary bg-white dark:bg-neutral-800 rounded-full shadow-sm border border-line">
                    {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
                  </div>
                </div>

                {/* 当前现状旁白 */}
                {scenario.narration && (
                  <div className="mx-4 mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg max-w-[90%] mx-auto">
                    <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                      {scenario.narration}
                    </p>
                  </div>
                )}

                {/* 对话消息 */}
                {scenario.messages && scenario.messages.map((msg, index) => (
                  <ChatMessage
                    key={index}
                    text={msg.content}
                    sender={msg.sender}
                    time={msg.timestamp || currentTime}
                    isUser={false}
                    delay={0.3 + index * 0.2}
                  />
                ))}

                {/* 兼容旧版本 */}
                {!scenario.messages && scenario.situation && (
                  <ChatMessage
                    text={scenario.situation}
                    sender={senderInfo.name}
                    time={currentTime}
                    isUser={false}
                    delay={0.3}
                  />
                )}

                {/* 正在输入提示 */}
                {!isSubmitting && (
                  <div className="px-4 mt-2">
                    <div className="flex items-center gap-2 text-xs text-tertiary">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span>轮到你回复了...</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* 输入区域 */}
        <div className="border-t border-line p-4 bg-white dark:bg-neutral-800 shrink-0">
          <div className="flex items-end gap-3">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="输入消息..."
              className="chat-input flex-1 resize-none text-sm"
              rows={1}
              disabled={isSubmitting}
            />
            <button
              onClick={handleSubmit}
              disabled={!answer.trim() || isSubmitting}
              className="btn-primary px-6 py-3 flex items-center justify-center gap-2 text-sm shrink-0 min-w-[90px] h-[52px]"
            >
              <HiPaperAirplane className="w-4 h-4" />
              <span>发送</span>
            </button>
          </div>
          <p className="text-xs text-tertiary mt-2">
            Enter 发送消息 · Shift+Enter 换行
          </p>
        </div>
      </div>
    </div>
  )
}
