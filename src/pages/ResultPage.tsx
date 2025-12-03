import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowPath, HiShare } from 'react-icons/hi2'
import { useTestStore } from '@/stores/testStore'
import RadarChart from '@/components/RadarChart'

export default function ResultPage() {
  const navigate = useNavigate()
  const { evaluationResult, resetTest } = useTestStore()

  useEffect(() => {
    if (!evaluationResult) {
      navigate('/')
    }
  }, [evaluationResult, navigate])

  if (!evaluationResult) {
    return null
  }

  const handleRestart = () => {
    resetTest()
    navigate('/test')
  }

  const handleShare = async () => {
    const text = `我在"What Can I Say?"获得了【${evaluationResult.title}】称号！\n${evaluationResult.description}`
    
    if (navigator.share) {
      try {
        await navigator.share({ text })
      } catch (error) {
        console.log('分享取消')
      }
    } else {
      navigator.clipboard.writeText(text)
      alert('结果已复制到剪贴板！')
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="text-6xl mb-4">🏆</div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            【{evaluationResult.title}】
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            {evaluationResult.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-6 text-center">能力雷达图</h2>
            <RadarChart data={evaluationResult} />
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold mb-6">各维度评分</h2>
            <div className="space-y-4">
              {[
                { label: '高情商', value: evaluationResult.rizz },
                { label: '抽象值', value: evaluationResult.abstract },
                { label: 'NPC指数', value: evaluationResult.npcEnergy },
                { label: '攻击性', value: evaluationResult.toxic },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm font-bold tabular-nums">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">AI点评</h2>
          <p className="text-sm text-secondary leading-relaxed mb-6">
            {evaluationResult.comment}
          </p>
          
          <h3 className="text-base font-semibold mb-3">提升建议</h3>
          <ul className="space-y-2">
            {evaluationResult.advice.map((advice, index) => (
              <li key={index} className="text-sm text-secondary flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-black dark:bg-white flex-shrink-0" />
                <span>{advice}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRestart}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <HiArrowPath className="w-5 h-5" />
            再测一次
          </button>
          <button
            onClick={handleShare}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <HiShare className="w-5 h-5" />
            分享结果
          </button>
        </div>
      </motion.div>
    </div>
  )
}
