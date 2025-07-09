import { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface StockInputProps {
  onSearch: (symbol: string) => void;
  loading?: boolean;
}

export function StockInput({ onSearch, loading }: StockInputProps) {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      onSearch(symbol.toUpperCase());
    }
  };

  const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META'];

  return (
    <Card className="p-6 border-border bg-card/50 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-6 w-6 text-chart-primary" />
            <h1 className="text-2xl font-bold text-foreground">Stock Price Predictor</h1>
          </div>
          <p className="text-muted-foreground">
            Enter a stock symbol to analyze historical data and predict tomorrow's price
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="pl-10 bg-background/50"
              disabled={loading}
            />
          </div>
          <Button 
            type="submit" 
            disabled={!symbol.trim() || loading}
            className="px-6"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </form>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Popular stocks:</p>
          <div className="flex flex-wrap gap-2">
            {popularStocks.map((stock) => (
              <Button
                key={stock}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSymbol(stock);
                  onSearch(stock);
                }}
                disabled={loading}
                className="text-xs"
              >
                {stock}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}