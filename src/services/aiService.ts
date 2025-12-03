import type { UserAnswer, Scenario, EvaluationResult, Evaluation } from '@/types'
import { titles } from '@/data/titles'

export async function evaluateAnswers(
  answers: UserAnswer[],
  scenarios: Scenario[]
): Promise<EvaluationResult> {
  const response = await fetch('/api/evaluate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answers, scenarios }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || '评价失败')
  }

  const evaluation = await response.json()
  return buildResult(evaluation)
}

function buildResult(evaluation: Evaluation & { comment: string }): EvaluationResult {
  const matchedTitle = titles.find(title => title.condition(evaluation)) || titles[titles.length - 1]
  
  return {
    ...evaluation,
    title: matchedTitle.name,
    description: matchedTitle.description,
    advice: matchedTitle.advice,
  }
}
