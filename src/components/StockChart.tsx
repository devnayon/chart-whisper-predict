import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { Card } from '@/components/ui/card';

interface StockDataPoint {
  date: string;
  price: number;
  movingAverage?: number;
  prediction?: number;
}

interface StockChartProps {
  data: StockDataPoint[];
  symbol: string;
  prediction?: number;
}

export function StockChart({ data, symbol, prediction }: StockChartProps) {
  const latestPrice = data[data.length - 1]?.price || 0;
  const priceChange = data.length > 1 ? latestPrice - data[data.length - 2].price : 0;
  const priceChangePercent = data.length > 1 ? (priceChange / data[data.length - 2].price) * 100 : 0;

  return (
    <Card className="p-6 border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{symbol}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-3xl font-bold text-foreground">
              ${latestPrice.toFixed(2)}
            </span>
            <span 
              className={`px-2 py-1 rounded text-sm font-medium ${
                priceChange >= 0 
                  ? 'bg-chart-success/20 text-chart-success' 
                  : 'bg-chart-danger/20 text-chart-danger'
              }`}
            >
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        {prediction && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Tomorrow's Prediction</p>
            <p className="text-xl font-bold text-chart-primary animate-pulse-glow">
              ${prediction.toFixed(2)}
            </p>
          </div>
        )}
      </div>
      
      <div className="h-96 w-full animate-fade-in">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
              labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="hsl(var(--chart-primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--chart-primary))', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, fill: 'hsl(var(--chart-primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
              name="Price"
            />
            <Line 
              type="monotone" 
              dataKey="movingAverage" 
              stroke="hsl(var(--chart-secondary))" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Moving Average"
            />
            {prediction && (
              <ReferenceLine 
                y={prediction} 
                stroke="hsl(var(--chart-warning))" 
                strokeDasharray="3 3"
                label={{ value: "Prediction", position: "top" }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}