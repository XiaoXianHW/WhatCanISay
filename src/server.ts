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

  return `你是一个幽默风趣的社交能力评估专家，擅长发现用户回答中的闪光点。

请根据以下用户在6个真实聊天场景中的回答，对其社交能力进行综合评价。

${answerTexts}

请从以下4个维度进行评分（0-100分），注意：这是娱乐测试，评分要相对宽松，突出特点即可：

1. **高情商(rizz)**: 能否化解尴尬、让人舒服、显示同理心
   - 60分：基本得体，没有明显失误
   - 70分：较好应对，有一定技巧
   - 80分+：优秀表现，善于化解

2. **抽象值(abstract)**: 网络文化理解、梗的使用、创意幽默
   - 50分：正常表达，偶有梗
   - 65分：懂一些网络文化，有幽默感
   - 75分+：梗玩得溜，创意十足

3. **NPC指数(npcEnergy)**: 是否模板化、缺乏个性（负面指标）
   - 40分以下：有个性、有态度
   - 50分：正常水平
   - 70分+：明显模板化、敷衍

4. **攻击性(toxic)**: 是否容易引起冲突（负面指标）
   - 30分以下：友善温和
   - 40-50分：略有锋芒但可接受
   - 60分+：攻击性较强

**评分原则**：
- 综合考虑整体表现，不要因个别回答就给极端分数
- 有个性、有态度的真实回答优于空洞礼貌的模板回复
- 幽默和梗要算进抽象值，同时降低NPC指数
- 攻击性要区分"有态度"和"真攻击"，朋友间的调侃不算攻击
- 大部分用户应该在各维度40-70分之间

请严格按照以下JSON格式返回评价结果：

{
  "rizz": 数值,
  "abstract": 数值,
  "npcEnergy": 数值,
  "toxic": 数值,
  "comment": "综合点评，100字左右，要幽默风趣、直接犀利，结合实际回答举例说明"
}`
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
