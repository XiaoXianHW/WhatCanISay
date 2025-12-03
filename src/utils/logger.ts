import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const logsDir = path.join(__dirname, '..', '..', 'logs')

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

export function logEvaluation(ip: string, answers: any[], scenarios: any[], result: any) {
  const timestamp = new Date().toISOString()
  const date = timestamp.split('T')[0]
  const logFile = path.join(logsDir, `${date}.log`)

  const logContent = {
    timestamp,
    ip,
    answers: answers.map((answer) => {
      const scenario = scenarios.find(s => s.id === answer.scenarioId)
      return {
        scenarioId: answer.scenarioId,
        category: scenario?.category,
        title: scenario?.title,
        answer: answer.answer,
        timeTaken: answer.timeTaken
      }
    }),
    result: {
      rizz: result.rizz,
      abstract: result.abstract,
      npcEnergy: result.npcEnergy,
      toxic: result.toxic,
      comment: result.comment
    }
  }

  const logLine = JSON.stringify(logContent) + '\n'
  
  fs.appendFileSync(logFile, logLine, 'utf-8')
}
