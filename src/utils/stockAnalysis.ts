interface StockDataPoint {
  date: string;
  price: number;
  movingAverage?: number;
  prediction?: number;
}

// Calculate moving average
export function calculateMovingAverage(data: number[], window: number = 5): number[] {
  const result: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      result.push(NaN);
    } else {
      const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / window);
    }
  }
  
  return result;
}

// Simple linear regression prediction
export function linearRegressionPredict(prices: number[]): number {
  const n = prices.length;
  if (n < 2) return prices[0] || 0;

  // Create x values (time indices)
  const x = Array.from({ length: n }, (_, i) => i);
  const y = prices;

  // Calculate means
  const xMean = x.reduce((sum, val) => sum + val, 0) / n;
  const yMean = y.reduce((sum, val) => sum + val, 0) / n;

  // Calculate slope (m) and intercept (b)
  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (x[i] - xMean) * (y[i] - yMean);
    denominator += (x[i] - xMean) ** 2;
  }

  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = yMean - slope * xMean;

  // Predict next value (x = n)
  return slope * n + intercept;
}

// Moving average prediction (simple approach)
export function movingAveragePredict(prices: number[], window: number = 5): number {
  if (prices.length < window) return prices[prices.length - 1] || 0;
  
  const lastValues = prices.slice(-window);
  return lastValues.reduce((sum, price) => sum + price, 0) / window;
}

// Generate mock historical data for demonstration
export function generateMockStockData(symbol: string, days: number = 30): StockDataPoint[] {
  const basePrice = getBasePriceForSymbol(symbol);
  const data: StockDataPoint[] = [];
  let currentPrice = basePrice;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some realistic price movement
    const volatility = 0.03; // 3% daily volatility
    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    const trend = Math.sin(i / 5) * 0.01; // Subtle trend
    
    currentPrice = currentPrice * (1 + randomChange + trend);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Math.max(currentPrice, 1) // Ensure price doesn't go negative
    });
  }
  
  // Calculate moving averages
  const prices = data.map(d => d.price);
  const movingAverages = calculateMovingAverage(prices, 5);
  
  data.forEach((point, index) => {
    if (!isNaN(movingAverages[index])) {
      point.movingAverage = movingAverages[index];
    }
  });
  
  return data;
}

function getBasePriceForSymbol(symbol: string): number {
  const basePrices: { [key: string]: number } = {
    'AAPL': 230,
    'GOOGL': 175,
    'MSFT': 420,
    'TSLA': 240,
    'AMZN': 185,
    'META': 730,
    'NVDA': 140,
    'NFLX': 690,
    'AMD': 140,
    'INTC': 22
  };
  
  return basePrices[symbol] || 100 + Math.random() * 200;
}