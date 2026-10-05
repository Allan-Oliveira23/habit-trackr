import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface DailyPoint {
  day: number
  percentage: number
}

export default function ProgressChart({ data }: { data: DailyPoint[] }) {
  return (
    <div className="h-56 w-full" role="img" aria-label="Gráfico de progresso diário em porcentagem">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="okFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1e2733" vertical={false} />
          <XAxis dataKey="day" stroke="#8b98a8" fontSize={11} tickLine={false} />
          <YAxis domain={[0, 100]} unit="%" stroke="#8b98a8" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: '#11171f', border: '1px solid #1e2733', borderRadius: 8 }}
            labelFormatter={(d) => `Dia ${d}`}
            formatter={(v) => [`${v}%`, 'Progresso']}
          />
          <Area type="monotone" dataKey="percentage" stroke="#2dd4bf" strokeWidth={2} fill="url(#okFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
