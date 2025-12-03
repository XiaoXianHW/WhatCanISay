import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTestStore } from '@/stores/testStore'
import { scenarios } from '@/data/scenarios'
import ScenarioCard from '@/components/ScenarioCard'
import ProgressBar from '@/components/ProgressBar'
import { evaluateAnswers } from '@/services/aiService'

export default function TestPage() {
  const navigate = useNavigate()
  const {
    currentScenarioIndex,
    answers,
    nextScenario,
    addAnswer,
    setEvaluationResult,
    completeTest,
  } = useTestStore()

  const [isEvaluating, setIsEvaluating] = useState(false)
  const currentScenario = scenarios[currentScenarioIndex]
  const totalScenarios = scenarios.length

  useEffect(() => {
    if (currentScenarioIndex >= totalScenarios && !isEvaluating) {
      handleTestComplete()
    }
  }, [currentScenarioIndex, totalScenarios, isEvaluating])

  const handleTestComplete = async () => {
    setIsEvaluating(true)
    try {
      const result = await evaluateAnswers(answers, scenarios)
      setEvaluationResult(result)
      completeTest()
      navigate('/result')
    } catch (error) {
      console.error('评价失败:', error)
      alert('评价过程出现问题，请重试')
      setIsEvaluating(false)
    }
  }

  const handleAnswer = (answer: string, timeTaken: number) => {
    addAnswer({
      scenarioId: currentScenario.id,
      answer,
      timeTaken,
    })
    nextScenario()
  }

  if (isEvaluating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-12 text-center max-w-md">
          <div className="w-12 h-12 mx-auto mb-6 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-xl font-semibold mb-2">AI正在评价...</p>
          <p className="text-sm text-secondary">
            分析你的回答中，请稍候
          </p>
        </div>
      </div>
    )
  }

  if (!currentScenario) {
    return null
  }

  return (
    <div className="h-[calc(100vh-4rem)] py-4 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col min-h-0">
        <ProgressBar current={currentScenarioIndex + 1} total={totalScenarios} />
        <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScenario.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ScenarioCard
                scenario={currentScenario}
                onAnswer={handleAnswer}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
