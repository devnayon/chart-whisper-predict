import { Calculator, TrendingUp, Brain } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PredictionResultsProps {
  symbol: string;
  currentPrice: number;
  movingAveragePrediction: number;
  linearRegressionPrediction: number;
  confidence: number;
}

export function PredictionResults({ 
  symbol, 
  currentPrice, 
  movingAveragePrediction, 
  linearRegressionPrediction,
  confidence 
}: PredictionResultsProps) {
  const avgPrediction = (movingAveragePrediction + linearRegressionPrediction) / 2;
  const priceChange = avgPrediction - currentPrice;
  const priceChangePercent = (priceChange / currentPrice) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
      <Card className="p-4 border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <Calculator className="h-5 w-5 text-chart-secondary" />
          <h3 className="font-semibold text-foreground">Moving Average</h3>
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-chart-secondary">
            ${movingAveragePrediction.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            Based on 5-day average
          </p>
        </div>
      </Card>

      <Card className="p-4 border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp className="h-5 w-5 text-chart-warning" />
          <h3 className="font-semibold text-foreground">Linear Regression</h3>
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-chart-warning">
            ${linearRegressionPrediction.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            Trend-based prediction
          </p>
        </div>
      </Card>

      <Card className="p-4 border-border bg-card/50 backdrop-blur-sm animate-pulse-glow">
        <div className="flex items-center gap-3 mb-3">
          <Brain className="h-5 w-5 text-chart-primary" />
          <h3 className="font-semibold text-foreground">Final Prediction</h3>
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-chart-primary">
            ${avgPrediction.toFixed(2)}
          </p>
          <div className="flex items-center gap-2">
            <span 
              className={`text-sm font-medium ${
                priceChange >= 0 ? 'text-chart-success' : 'text-chart-danger'
              }`}
            >
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
            </span>
            <Badge variant="outline" className="text-xs">
              {confidence}% confidence
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}