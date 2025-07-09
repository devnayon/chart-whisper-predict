import { useState } from 'react';
import { StockChart } from '@/components/StockChart';
import { StockInput } from '@/components/StockInput';
import { PredictionResults } from '@/components/PredictionResults';
import { generateMockStockData, linearRegressionPredict, movingAveragePredict } from '@/utils/stockAnalysis';
import { useToast } from '@/hooks/use-toast';

interface StockDataPoint {
  date: string;
  price: number;
  movingAverage?: number;
  prediction?: number;
}

const Index = () => {
  const [stockData, setStockData] = useState<StockDataPoint[]>([]);
  const [currentSymbol, setCurrentSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<{
    movingAverage: number;
    linearRegression: number;
    final: number;
  } | null>(null);
  const { toast } = useToast();

  const handleStockSearch = async (symbol: string) => {
    setLoading(true);
    setCurrentSymbol(symbol);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data for demonstration
      const data = generateMockStockData(symbol, 30);
      setStockData(data);
      
      // Calculate predictions
      const prices = data.map(d => d.price);
      const movingAvgPrediction = movingAveragePredict(prices, 5);
      const linearRegPrediction = linearRegressionPredict(prices);
      const finalPrediction = (movingAvgPrediction + linearRegPrediction) / 2;
      
      setPredictions({
        movingAverage: movingAvgPrediction,
        linearRegression: linearRegPrediction,
        final: finalPrediction
      });
      
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${symbol} and generated predictions.`,
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch stock data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <StockInput onSearch={handleStockSearch} loading={loading} />
        
        {stockData.length > 0 && (
          <>
            <StockChart 
              data={stockData} 
              symbol={currentSymbol}
              prediction={predictions?.final}
            />
            
            {predictions && (
              <PredictionResults
                symbol={currentSymbol}
                currentPrice={stockData[stockData.length - 1].price}
                movingAveragePrediction={predictions.movingAverage}
                linearRegressionPrediction={predictions.linearRegression}
                confidence={75}
              />
            )}
          </>
        )}
        
        {stockData.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Enter a stock symbol above to start analyzing and predicting prices
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
