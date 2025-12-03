export const publicConfig = {
  app: {
    title: 'What Can I Say?',
    subtitle: '拒绝做NPC，测测你的赛博情商',
    description: '在尴尬、高压、抽象的社交场景中，测试你的应对能力',
    maxScenarios: 6,
    timePerScenario: 30, // 默认时间，实际每个场景时间可能不同(20-30秒)
  },
  theme: {
    defaultMode: 'dark' as const,
    primaryColor: '#2563eb',
  },
}

export default publicConfig
