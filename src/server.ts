import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'
import { serverConfig } from '../config/config.js'
import { logEvaluation } from './utils/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = serverConfig.server.port
const isProduction = process.argv.includes('--production') || process.env.NODE_ENV === 'production'

// 静态文件服务（生产环境）
if (isProduction) {
  const distPath = path.join(__dirname, '..', '..', 'dist')
  app.use(express.static(distPath))
}

app.use(cors({
  origin: serverConfig.server.allowedOrigins,
  credentials: true
}))

app.use(express.json())

// API 限流
app.use('/api/evaluate', rateLimit({
  windowMs: serverConfig.security.rateLimitWindowMs,
  max: serverConfig.security.rateLimitMaxRequests,
  message: { error: '请求过于频繁，请稍后再试' }
}))

// API 端点
app.post('/api/evaluate', async (req, res) => {
  try {
    const { answers, scenarios } = req.body

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: '无效的答案数据' })
    }

    if (!scenarios || !Array.isArray(scenarios) || scenarios.length === 0) {
      return res.status(400).json({ error: '无效的场景数据' })
    }

    if (!serverConfig.ai.apiKey) {
      return res.status(503).json({ error: '服务未配置API Key，请联系管理员' })
    }

    const prompt = buildPrompt(answers, scenarios)
    const evaluation = await callAI(prompt)

    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
    logEvaluation(clientIp as string, answers, scenarios, evaluation)

    res.json(evaluation)
  } catch (error) {
    console.error('评价失败:', error)
    res.status(500).json({ error: '评价失败，请稍后重试' })
  }
})

function buildPrompt(answers: any[], scenarios: any[]): string {
  const answerTexts = answers.map((answer, index) => {
    const scenario = scenarios.find(s => s.id === answer.scenarioId)
    const messages = scenario?.messages?.map((msg: any) => 
      `${msg.sender}: ${msg.content}`
    ).join('\n') || ''
    
    return `
━━━━━━━━━━━━━━━━━━━━━━
场景 ${index + 1}【${scenario?.category}】${scenario?.title}
${scenario?.subtitle}

【当前情况】
${scenario?.narration}

【对话内容】
${messages}

【用户回复】
${answer.answer} (用时: ${answer.timeTaken}秒)
━━━━━━━━━━━━━━━━━━━━━━
`
  }).join('\n')

  return `你是一个专业的社交能力评估专家，擅长分析人们在不同社交场景下的应对能力。

请根据以下用户在6个真实聊天场景中的回答，对其社交能力进行多维度评价。

每个场景都包含：当前情况描述、之前的对话内容、以及用户的回复。
请综合考虑场景语境、对话上下文和用户回复的合理性来评分。

${answerTexts}

请从以下4个维度进行评分（0-100分）：

1. **高情商(rizz)**: 是否能够化解尴尬、让人舒服、显示出同理心、回复得体
2. **抽象值(abstract)**: 网络文化理解度、含梗量、创意程度、幽默感
3. **NPC指数(npcEnergy)**: 回答是否模板化、缺乏个性、像机器人（越低越好）
4. **攻击性(toxic)**: 回答是否带有攻击性、容易引起冲突（越低越好）

请严格按照以下JSON格式返回评价结果，不要包含任何其他文字：

{
  "rizz": 数值,
  "abstract": 数值,
  "npcEnergy": 数值,
  "toxic": 数值,
  "comment": "综合点评，100字左右，要幽默风趣、直接犀利，可以带点网络梗"
}

评分标准：
- 回复能完美应对场景、化解尴尬 → 高情商高分
- 回复有创意、有梗、幽默 → 抽象值高分
- 回复空洞、敷衍、模板化 → NPC指数高分（这是负面指标）
- 回复冲撞、阴阳怪气、容易引战 → 攻击性高分（这是负面指标）
- 点评要结合实际回答内容，不要泛泛而谈`
}

async function callAI(prompt: string) {
  const response = await fetch(serverConfig.ai.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serverConfig.ai.apiKey}`,
    },
    body: JSON.stringify({
      model: serverConfig.ai.model,
      messages: [
        { role: 'system', content: '你是一个幽默风趣的社交能力评估专家。' },
        { role: 'user', content: prompt }
      ],
      temperature: serverConfig.ai.temperature,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`AI API请求失败: ${response.status} - ${errorText}`)
  }

  const data = await response.json() as any
  const content = data.choices[0].message.content

  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('无法解析AI响应')
  }

  const parsed = JSON.parse(jsonMatch[0])
  return {
    rizz: Math.min(100, Math.max(0, parsed.rizz)),
    abstract: Math.min(100, Math.max(0, parsed.abstract)),
    npcEnergy: Math.min(100, Math.max(0, parsed.npcEnergy)),
    toxic: Math.min(100, Math.max(0, parsed.toxic)),
    comment: parsed.comment || '你的社交能力有待提升。',
  }
}

// 所有非API请求返回前端页面（生产环境）
if (isProduction) {
  const distPath = path.join(__dirname, '..', '..', 'dist')
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`)
  console.log(isProduction ? `✅ 生产模式` : `⚡ 开发模式 - 前端: http://localhost:5173`)
})
