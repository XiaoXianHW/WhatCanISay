export type ScenarioCategory = '职场求生' | '情感拉扯' | '网络对线'

export type InputType = 'text' | 'choice'

export interface ChatMessage {
  sender: string
  content: string
  timestamp?: string
}

export interface Scenario {
  id: string
  category: ScenarioCategory
  title: string // 场景主标题（简短）
  subtitle: string // 场景副标题（简要描述）
  messages: ChatMessage[] // 对话消息列表
  timeLimit?: number
  inputType: InputType
  choices?: string[]
  // 兼容旧版本
  narration?: string
  situation?: string
  context?: string
}

export interface UserAnswer {
  scenarioId: string
  answer: string
  timeTaken: number
}

export interface Evaluation {
  rizz: number
  abstract: number
  npcEnergy: number
  toxic: number
}

export interface EvaluationResult extends Evaluation {
  title: string
  description: string
  comment: string
  advice: string[]
}

export interface Title {
  name: string
  description: string
  condition: (evaluation: Evaluation) => boolean
  advice: string[]
}

export type ThemeMode = 'light' | 'dark'

export interface AppConfig {
  ai: {
    provider: string
    apiKey: string
    endpoint: string
    model: string
    temperature: number
  }
  app: {
    title: string
    subtitle: string
    description: string
    maxScenarios: number
    timePerScenario: number
    enableSound: boolean
  }
  theme: {
    defaultMode: ThemeMode
  }
}
