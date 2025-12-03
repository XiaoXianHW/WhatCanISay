import dotenv from 'dotenv'

dotenv.config()

export const publicConfig = {
  app: {
    title: 'What Can I Say?',
    subtitle: '拒绝做NPC，测测你的赛博情商',
    description: '在尴尬、高压、抽象的社交场景中，测试你的应对能力',
    maxScenarios: 6,
    timePerScenario: 30,
  },
  theme: {
    defaultMode: 'dark' as const,
    primaryColor: '#2563eb',
  },
}

export const serverConfig = {
  server: {
    port: parseInt(process.env.SERVER_PORT || '3001', 10),
    allowedOrigins: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ],
  },
  security: {
    rateLimitWindowMs: 15 * 60 * 1000,
    rateLimitMaxRequests: 10,
  },
  ai: {
    apiKey: process.env.AI_API_KEY || 'your-api-key-here',
    endpoint: process.env.AI_ENDPOINT || 'https://api.deepseek.com/v1/chat/completions',
    model: process.env.AI_MODEL || 'deepseek-chat',
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.8'),
  },
}

export const config = {
  ...publicConfig,
  server: serverConfig,
}

export default config
