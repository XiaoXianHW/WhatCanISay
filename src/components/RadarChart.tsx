import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import type { EvaluationResult } from '@/types'

interface RadarChartProps {
  data: EvaluationResult
}

export default function RadarChart({ data }: RadarChartProps) {
  const chartData = [
    { subject: '高情商', value: data.rizz },
    { subject: '抽象值', value: data.abstract },
    { subject: 'NPC指数', value: data.npcEnergy },
    { subject: '攻击性', value: data.toxic },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsRadar data={chartData}>
        <PolarGrid stroke="currentColor" className="text-gray-300 dark:text-gray-600" />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: 'currentColor', fontSize: 12 }}
          className="text-gray-700 dark:text-gray-300"
        />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
        <Radar
          name="评分"
          dataKey="value"
          stroke="#2563eb"
          fill="#2563eb"
          fillOpacity={0.5}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  )
}
