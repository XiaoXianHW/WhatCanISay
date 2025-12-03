import type { Title } from '../types'

export const titles: Title[] = [
  // 优先匹配特殊极端情况
  {
    name: '社交炸弹',
    description: '你的发言永远是那么的...震撼。建议在说话前先在心里默念三遍。',
    condition: (evaluation) => 
      evaluation.toxic >= 70,
    advice: [
      '说话前想一想可能的后果',
      '攻击性太强会疏远他人',
      '学会用更温和的方式表达观点',
      '情绪管理和社交能力同样重要',
    ],
  },
  {
    name: '莽夫战士',
    description: '你是真实，但也是真莽。说话不过脑，怼天怼地怼空气，活在自己的世界里横冲直撞。',
    condition: (evaluation) => 
      evaluation.toxic >= 50 && evaluation.npcEnergy >= 60 && evaluation.rizz < 50,
    advice: [
      '真实是好事，但也要考虑场合',
      '降低攻击性，学会温和表达',
      '多思考对方的感受',
      '情商和个性可以并存',
    ],
  },
  {
    name: '出厂设置NPC',
    description: '你的回答像极了早期的Siri，毫无感情，全是技巧。建议重新刷机，你的聊天记录比白开水还淡。',
    condition: (evaluation) => 
      evaluation.npcEnergy >= 70 && evaluation.toxic < 40 && evaluation.abstract < 50,
    advice: [
      '尝试在回答中加入更多个人情感',
      '不要总是给出"标准答案"',
      '真诚比完美的话术更重要',
      '多观察别人是怎么在不同场景下应对的',
    ],
  },
  {
    name: '话题终结者',
    description: '只要你一开口，群聊就变成了停尸房。沉默是金，对你来说是真的。',
    condition: (evaluation) => 
      evaluation.npcEnergy >= 60 && evaluation.rizz < 35 && evaluation.abstract < 40,
    advice: [
      '多观察社交场景中的气氛',
      '学习一些基本的社交话术',
      '不要害怕表达，沉默不一定是最好的选择',
      '从简单的回应开始，逐渐建立信心',
    ],
  },
  // 正面高分称号
  {
    name: '赛博外交官',
    description: '你的嘴是抹了蜜的开塞露，任何尴尬局面都能被你丝滑化解。',
    condition: (evaluation) => 
      evaluation.rizz >= 75 && evaluation.npcEnergy < 30 && evaluation.toxic < 40,
    advice: [
      '保持这种共情能力，但也要注意不要过度迎合',
      '在某些场合，直接一点也许更有效',
      '继续发挥你的社交天赋，但记得做自己',
    ],
  },
  {
    name: '情商战神',
    description: '你深谙人际交往之道，既能化解尴尬又不失真诚。Man! What can I say? 你是懂说话的。',
    condition: (evaluation) => 
      evaluation.rizz >= 65 && evaluation.abstract >= 50 && evaluation.npcEnergy < 45,
    advice: [
      '你的社交能力已经很强了，保持这种平衡',
      '适当的幽默感让你更有魅力',
      '继续保持对不同社交场景的敏感度',
    ],
  },
  {
    name: '冲浪达人',
    description: '你对网络文化的理解已经炉火纯青，梗图信手拈来，抽象文学张口就来。',
    condition: (evaluation) => 
      evaluation.abstract >= 70 && evaluation.rizz >= 50,
    advice: [
      '你的网感很强，但要注意场合',
      '在线下社交中也要保持这种应变能力',
      '梗玩得好也是一种社交能力',
    ],
  },
  {
    name: '抽象大帝',
    description: '正常人听不懂你在说什么，但你的同类会奉你为神。你的大脑回路像那个旋转的直升机一样难以捉摸。',
    condition: (evaluation) => 
      evaluation.abstract >= 70 && evaluation.rizz < 55,
    advice: [
      '考虑一下受众，不是所有人都懂梗',
      '在正式场合收敛一下抽象程度',
      '保持个性很好，但也要学会切换模式',
    ],
  },
  {
    name: '网络浪人',
    description: '半懂不懂的抽象，时而温柔时而暴躁。在网上冲浪很溜，但线下社交还需修炼。',
    condition: (evaluation) => 
      evaluation.abstract >= 60 && evaluation.npcEnergy >= 60 && evaluation.rizz < 50,
    advice: [
      '你有一定的网感，继续提升',
      '降低模板化回答，多点真实表达',
      '控制情绪，减少攻击性',
      '线上线下社交要有所区别',
    ],
  },
  {
    name: '纯爱战神',
    description: '真诚、直接、不玩虚的。虽然有时显得笨拙，但这份真诚难能可贵。',
    condition: (evaluation) => 
      evaluation.rizz >= 50 && evaluation.toxic < 35 && evaluation.abstract < 45 && evaluation.npcEnergy < 50,
    advice: [
      '保持这份真诚，但也可以学点技巧',
      '适度的幽默感会让你更有魅力',
      '真诚是你的优势，不要轻易改变',
    ],
  },
  // 兜底称号
  {
    name: '社交学徒',
    description: '你正在学习社交的艺术，虽然还不够老练，但已经在正确的道路上。',
    condition: () => true,
    advice: [
      '多观察，多练习，社交能力是可以提升的',
      '不要害怕犯错，每次互动都是学习机会',
      '保持真诚，这比任何技巧都重要',
      '慢慢来，社交能力的培养需要时间',
    ],
  },
]
