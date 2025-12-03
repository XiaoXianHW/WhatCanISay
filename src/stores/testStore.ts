import { create } from 'zustand'
import type { UserAnswer, EvaluationResult } from '../types'

interface TestStore {
  currentScenarioIndex: number
  answers: UserAnswer[]
  evaluationResult: EvaluationResult | null
  isTestComplete: boolean
  
  setCurrentScenarioIndex: (index: number) => void
  addAnswer: (answer: UserAnswer) => void
  setEvaluationResult: (result: EvaluationResult) => void
  nextScenario: () => void
  resetTest: () => void
  completeTest: () => void
}

export const useTestStore = create<TestStore>((set) => ({
  currentScenarioIndex: 0,
  answers: [],
  evaluationResult: null,
  isTestComplete: false,
  
  setCurrentScenarioIndex: (index) => set({ currentScenarioIndex: index }),
  
  addAnswer: (answer) =>
    set((state) => ({
      answers: [...state.answers, answer],
    })),
  
  setEvaluationResult: (result) => set({ evaluationResult: result }),
  
  nextScenario: () =>
    set((state) => ({
      currentScenarioIndex: state.currentScenarioIndex + 1,
    })),
  
  completeTest: () => set({ isTestComplete: true }),
  
  resetTest: () =>
    set({
      currentScenarioIndex: 0,
      answers: [],
      evaluationResult: null,
      isTestComplete: false,
    }),
}))
