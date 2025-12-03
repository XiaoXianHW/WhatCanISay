import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { HiSparkles, HiChatBubbleLeftRight, HiChartBar } from 'react-icons/hi2'
import { useTestStore } from '@/stores/testStore'
import config from '../../config/public.config'

const features = [
  {
    icon: HiChatBubbleLeftRight,
    title: '真实场景模拟',
    description: '从职场求生到情感拉扯，6大尴尬场景等你来战',
  },
  {
    icon: HiSparkles,
    title: 'AI智能评价',
    description: '多维度分析你的应答能力，给出专属称号',
  },
  {
    icon: HiChartBar,
    title: '能力可视化',
    description: '直观展示你的情商、抽象度、NPC指数等数据',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { resetTest } = useTestStore()

  const handleStartTest = () => {
    resetTest()
    navigate('/test')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl w-full text-center"
      >
        <div className="space-y-12">
          <div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {config.app.title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 font-medium px-4">
              {config.app.subtitle}
            </p>
            <p className="text-sm sm:text-base md:text-lg text-secondary px-4">
              {config.app.description}
            </p>
          </div>

          <div>
          <button
            onClick={handleStartTest}
            className="btn-primary text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          >
            开始测试 🚀
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 shadow-md">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-secondary">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">🎮 测试规则</h2>
          <div className="text-left space-y-3">
            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>共有 {config.app.maxScenarios} 个场景等待你的应对</span>
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>每个场景有 20-30 秒的思考时间</span>
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>请真实作答，AI会根据你的回答进行评价</span>
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>完成所有场景后，你将获得专属的社交能力称号</span>
            </p>
          </div>
        </div>
        </div>
      </motion.div>
    </div>
  )
}
