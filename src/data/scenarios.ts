import type { Scenario } from '../types'

export const scenarios: Scenario[] = [
  {
    id: 'scenario-1',
    category: '职场求生',
    title: '公司群聊',
    subtitle: '老板冷笑话遇冷，你要当破冰勇士还是装死？',
    narration: '公司大群里，老板刚发了个冷笑话。3分钟过去了，200多人的群里一片死寂。你是第一个看到消息的人，所有人都在线但没人说话。此时你的回应将打破这令人窒息的沉默...',
    messages: [
      {
        sender: '老板',
        content: '哈哈，今天天气不错，适合加班！😄',
      },
    ],
    timeLimit: 120,
    inputType: 'text',
  },
  {
    id: 'scenario-2',
    category: '情感拉扯',
    title: '深夜消息',
    subtitle: 'TA说你变了，你是解释还是反问回去？',
    narration: '晚上10点，你刚下班拖着疲惫的身躯回到家。手机震动，对方发来了消息。语气平静但带着一丝探究，没有说变好还是变坏...',
    messages: [
      {
        sender: 'TA',
        content: '我觉得你最近变了',
      },
    ],
    timeLimit: 60,
    inputType: 'text',
  },
  {
    id: 'scenario-3',
    category: '网络对线',
    title: '抽象视频',
    subtitle: '旋转鸡块配悲伤BGM，懂还是不懂？',
    narration: '深夜，朋友发来一个极其抽象的视频——旋转的鸡块配上悲伤的音乐。这是一个关于网络文化理解度的测试，你需要证明自己不是老年人也不是机器人...',
    messages: [
      {
        sender: '朋友',
        content: '[视频]',
      },
      {
        sender: '朋友',
        content: '懂？',
      },
    ],
    timeLimit: 120,
    inputType: 'text',
  },
  {
    id: 'scenario-4',
    category: '职场求生',
    title: '会议迟到',
    subtitle: '迟到一小时成全场焦点，找理由还是直接道歉？',
    narration: '今天的重要会议，你迟到了整整一个小时。推开会议室的门，所有人的目光齐刷刷地转向你。老板正在讲话，突然停了下来，整个房间陷入了尴尬的沉默。你需要说点什么来化解这个局面...',
    messages: [
      {
        sender: '老板',
        content: '哦，终于来了啊。',
      },
    ],
    timeLimit: 30,
    inputType: 'text',
  },
  {
    id: 'scenario-5',
    category: '情感拉扯',
    title: '收到礼物',
    subtitle: '收到土味礼物，是假装惊喜还是委婉吐槽？',
    narration: '对方递给你一份精心包装的礼物。打开后，你发现是一件你完全不喜欢的东西——可能是土味十足的装饰品，或者是完全不符合你审美的衣服。但对方显然花了心思挑选，正眼巴巴地看着你...',
    messages: [
      {
        sender: 'TA',
        content: '喜欢吗？我挑了好久呢！',
      },
    ],
    timeLimit: 30,
    inputType: 'text',
  },
  {
    id: 'scenario-6',
    category: '网络对线',
    title: '游戏团灭',
    subtitle: '你送了一波大的，是认错还是硬刚队友？',
    narration: '游戏中，你的一个失误操作导致团灭。队友们开始在语音里阴阳怪气地嘲讽。"哇，这波操作真是绝了"、"我看专业的"... 语音频道陷入了诡异的沉默，所有人都在等你回应...',
    messages: [
      {
        sender: '队友A',
        content: '？？？',
      },
      {
        sender: '队友B',
        content: '兄弟你这是什么操作啊',
      },
    ],
    timeLimit: 20,
    inputType: 'text',
  },
]
