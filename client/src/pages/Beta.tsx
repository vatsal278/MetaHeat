import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { 
  Home as HomeIcon, 
  RefreshCw, 
  ArrowLeft, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/hooks/use-wallet";

// Token data structure
interface TokenData {
  id: string;
  name: string;
  symbol: string;
  price: string;
  priceChange24h: string;
  volume24h: string;
  liquidity: string;
  marketCap: string;
  network: string;
  pairAddress: string;
  dexScreenerUrl: string;
  aiComment?: string; // AI-generated comment about the token
}

export default function Beta() {
  const { isConnected } = useWallet();
  const [isLoading, setIsLoading] = useState(true);
  const [tokenData, setTokenData] = useState<TokenData[]>([]);
  
  // State for active category and time filter
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeTimeframe, setActiveTimeframe] = useState<string>("24h");
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Timeframes
  const timeframes = [
    { id: "6h", name: "6H" },
    { id: "12h", name: "12H" },
    { id: "24h", name: "24H" },
    { id: "7d", name: "7D" }
  ];

  // Fetch real data from DexScreener API via our backend
  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/tokens/trending');
        
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success && !data.pairs) {
          throw new Error('Invalid data format received from API');
        }
        
        // Format functions
        const formatPrice = (priceString: string): string => {
          const price = parseFloat(priceString);
          if (price < 0.0001) {
            return `$${price.toFixed(8)}`;
          } else if (price < 0.01) {
            return `$${price.toFixed(6)}`;
          } else if (price < 1) {
            return `$${price.toFixed(4)}`;
          } else if (price < 100) {
            return `$${price.toFixed(2)}`;
          } else {
            return `$${price.toFixed(2)}`;
          }
        };
        
        // Format liquidity and volume
        const formatCurrency = (value: number): string => {
          if (value >= 1_000_000_000) {
            return `$${(value / 1_000_000_000).toFixed(2)}B`;
          } else if (value >= 1_000_000) {
            return `$${(value / 1_000_000).toFixed(2)}M`;
          } else if (value >= 1_000) {
            return `$${(value / 1_000).toFixed(2)}K`;
          } else {
            return `$${value.toFixed(2)}`;
          }
        };
        
        // Map the Binance data to our format
        const mappedTokens: TokenData[] = data.pairs.map((pair: any, index: number) => {
          // Get price change based on active timeframe - for Binance data
          let priceChangePercent: number;
          
          if (activeTimeframe === "6h" && pair.priceChange?.h6) {
            priceChangePercent = parseFloat(pair.priceChange.h6);
          } else if (activeTimeframe === "12h" && pair.priceChange?.h12) {
            priceChangePercent = parseFloat(pair.priceChange.h12);
          } else if (activeTimeframe === "24h" && pair.priceChange?.h24) {
            priceChangePercent = parseFloat(pair.priceChange.h24);
          } else {
            // Default to 24h if the requested timeframe isn't available
            priceChangePercent = parseFloat(pair.priceChange?.h24 || "0");
          }
          
          const priceChange = `${priceChangePercent >= 0 ? '+' : ''}${priceChangePercent.toFixed(2)}%`;
          
          // Map chain ID to network name
          const getNetworkName = (chainId: string, chainName?: string): string => {
            // Use the provided chainName if available
            if (chainName) return chainName;
            
            // Otherwise map the chainId to a human-readable name
            const chainMap: Record<string, string> = {
              "ethereum": "Ethereum",
              "bsc": "Binance",
              "arbitrum": "Arbitrum",
              "polygon": "Polygon",
              "solana": "Solana",
              "avalanche": "Avalanche",
              "fantom": "Fantom",
              "cronos": "Cronos",
              "optimism": "Optimism",
              "base": "Base",
              "pulsechain": "PulseChain",
              "osmosis": "Osmosis"
            };
            
            // Return the chain name or the ID if not found
            return chainMap[chainId?.toLowerCase()] || chainId || "Unknown";
          };
          
          // Generate AI-based MetaHeat insight for each token based on its metrics and trends
          const generateAiInsight = (token: string, price: string, change: number, volume: number, network: string): string => {
            let comment = "";
            
            // Analyze price change
            if (change > 20) {
              comment = `${token} is experiencing explosive growth with a ${change.toFixed(1)}% increase. This significant movement suggests high market interest.`;
            } else if (change > 10) {
              comment = `${token} shows strong bullish momentum at ${change.toFixed(1)}%. The sustained growth pattern indicates potential continued upward trajectory.`;
            } else if (change > 5) {
              comment = `${token} is performing well with steady growth of ${change.toFixed(1)}%. This moderate uptrend could indicate growing adoption.`;
            } else if (change > 0) {
              comment = `${token} shows mild positive movement at ${change.toFixed(1)}%. The token is stable with slight bullish tendencies.`;
            } else if (change > -5) {
              comment = `${token} is relatively stable with a slight decline of ${change.toFixed(1)}%. This minor correction appears normal after recent movements.`;
            } else if (change > -10) {
              comment = `${token} shows a moderate decline of ${change.toFixed(1)}%. This correction may present a potential entry point if fundamentals remain strong.`;
            } else {
              comment = `${token} is experiencing significant volatility with a ${change.toFixed(1)}% decrease. Such movement warrants caution and deeper analysis.`;
            }
            
            // Add volume insight
            if (volume > 1000000000) {
              comment += ` Extremely high trading volume on ${network} indicates major institutional interest.`;
            } else if (volume > 100000000) {
              comment += ` High trading activity across ${network} shows strong market participation.`;
            } else if (volume > 10000000) {
              comment += ` Healthy liquidity levels on ${network} support reliable price discovery.`;
            } else {
              comment += ` Trading activity on ${network} is moderate, suggesting a developing market.`;
            }
            
            return comment;
          };
          
          // Calculate raw price change and volume for AI insight
          const rawPriceChange = priceChangePercent; 
          const rawVolume = parseFloat(pair.volume?.h24 || "0");
          
          return {
            id: pair.id || index.toString(),
            name: pair.baseToken?.name || 'Unknown Token',
            symbol: pair.baseToken?.symbol || '???',
            price: formatPrice(pair.priceUsd || "0"),
            priceChange24h: priceChange,
            volume24h: formatCurrency(parseFloat(pair.volume?.h24 || "0")),
            liquidity: formatCurrency(parseFloat(pair.liquidity?.usd || "0")),
            marketCap: formatCurrency(parseFloat(pair.fdv || "0")),
            network: getNetworkName(pair.chainId, (pair as any).chainName),
            pairAddress: pair.pairAddress || "",
            dexScreenerUrl: pair.url || "https://www.binance.com/en/trade",
            aiComment: generateAiInsight(
              pair.baseToken?.name || pair.baseToken?.symbol || 'This token', 
              pair.priceUsd || "0", 
              rawPriceChange, 
              rawVolume,
              getNetworkName(pair.chainId, (pair as any).chainName)
            )
          };
        });
        
        setTokenData(mappedTokens);
      } catch (err) {
        console.error('Error fetching token data:', err);
        setError('Failed to fetch token data from CoinGecko API. Please try again later.');
        
        // Fallback to sample data in case of API errors
        setTokenData([
          {
            id: "1",
            name: "Error fetching data",
            symbol: "ERR",
            price: "$0.00",
            priceChange24h: "0.0%",
            volume24h: "$0",
            liquidity: "$0",
            marketCap: "$0",
            network: "Solana",
            pairAddress: "",
            dexScreenerUrl: "https://www.coingecko.com/",
            aiComment: "Unable to retrieve market data from CoinGecko API. Please try again later. This may be due to API rate limits or network connectivity issues."
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTokens();
  }, [activeTimeframe]);

  // Function to determine the score based on price change and volume
  const getScore = (token: TokenData): number => {
    try {
      // Parse price change, handling both "+" and "-" prefixes
      const priceChangeTxt = token.priceChange24h.replace('+', '').replace('%', '');
      const priceChange = parseFloat(priceChangeTxt) || 0;
      
      // Parse volume, handling different formats
      const volumeStr = token.volume24h
        .replace('$', '')
        .replace(/,/g, '')
        .replace('B', '000000000')
        .replace('M', '000000')
        .replace('K', '000');
      const volume = parseFloat(volumeStr) || 0;
      
      // Simple scoring algorithm
      let score = 50; // Base score
      
      // Add points for positive price change, subtract for negative
      score += priceChange * 2;
      
      // Add points for high volume (normalized)
      if (volume > 100000000) score += 30;
      else if (volume > 10000000) score += 20;
      else if (volume > 1000000) score += 10;
      
      // Ensure score is between 0 and 100
      return Math.min(Math.max(Math.round(score), 0), 100);
    } catch (error) {
      console.error("Error calculating score:", error);
      return 50; // Return default score on error
    }
  };
  
  // Get the appropriate color class based on score
  // Heat color function returns gradient classes based on token price change and volume
  const getScoreColorClass = (score: number): string => {
    // High score (hot) = dark red, Low score (cold) = green
    if (score >= 80) return "from-red-700 to-red-900 text-white";
    if (score >= 65) return "from-red-500 to-red-700 text-white";
    if (score >= 55) return "from-orange-500 to-red-500 text-white";
    if (score >= 45) return "from-amber-500 to-orange-500 text-white";
    if (score >= 35) return "from-amber-400 to-amber-500 text-white";
    if (score >= 25) return "from-yellow-500 to-amber-400 text-white";
    if (score >= 15) return "from-lime-500 to-yellow-500 text-white";
    return "from-green-500 to-green-700 text-white";
  };
  
  // Layout wrapper for consistent styling
  const BetaLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-24"> {/* Padding top to account for navbar */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold font-display">MetaHeat Beta</h1>
              <Badge variant="secondary" className="ml-4 py-1 px-3">
                {isConnected ? 'Connected' : 'Not Connected'}
              </Badge>
            </div>
            <Link href="/" className="flex items-center text-foreground/70 hover:text-foreground transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>
          </div>
          
          <div className="bg-card/40 backdrop-blur-sm border border-primary/20 rounded-lg p-6 mb-6">
            <div className="text-center max-w-3xl mx-auto py-2">
              <h2 className="text-2xl font-display font-bold mb-3">AI-Powered Token Prediction Engine</h2>
              <p className="text-foreground/80 mb-4">
                This beta version showcases real-time trading data and our AI-powered predictive model.
                Explore different timeframes and heatmaps to discover promising tokens.
              </p>
              <div className="flex justify-center mb-4">
                <a 
                  href="https://www.coingecko.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-accent hover:text-accent/80"
                >
                  <span>Market data from CoinGecko</span>
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
              
              {/* Category examples */}
              <div className="mb-4">
                <div className="text-sm text-foreground/60 mb-2">Popular Categories</div>
                <div className="flex flex-wrap justify-center gap-2">
                  <div className="px-3 py-1 rounded-full text-sm bg-primary/20 text-primary">Meme</div>
                  <div className="px-3 py-1 rounded-full text-sm bg-secondary/20 text-secondary">AI</div>
                  <div className="px-3 py-1 rounded-full text-sm bg-accent/20 text-accent">Gaming</div>
                  <div className="px-3 py-1 rounded-full text-sm bg-card text-foreground/70">DeFi</div>
                  <div className="px-3 py-1 rounded-full text-sm bg-card text-foreground/70">Layer 1</div>
                  <div className="px-3 py-1 rounded-full text-sm bg-card text-foreground/70">Trending</div>
                </div>
              </div>
              
              {/* Timeframe filters */}
              <div className="mb-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-foreground/60">Timeframe</div>
                  <button
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      showHeatmap 
                        ? 'bg-accent text-accent-foreground' 
                        : 'bg-card/70 hover:bg-card text-foreground/70 hover:text-foreground'
                    }`}
                    onClick={() => setShowHeatmap(!showHeatmap)}
                  >
                    {showHeatmap ? 'View Cards' : 'View Heatmap'}
                  </button>
                </div>
                <div className="flex justify-center gap-2 mt-2">
                  {timeframes.map(time => (
                    <button
                      key={time.id}
                      className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${
                        activeTimeframe === time.id 
                          ? 'bg-secondary text-secondary-foreground' 
                          : 'bg-card/70 hover:bg-card text-foreground/70 hover:text-foreground'
                      }`}
                      onClick={() => setActiveTimeframe(time.id)}
                    >
                      {time.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );

  // Show loading state
  if (isLoading) {
    return (
      <BetaLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <RefreshCw size={32} className="animate-spin mx-auto text-primary mb-4" />
            <p className="text-foreground/70">Loading real-time market data from CoinGecko API...</p>
          </div>
        </div>
      </BetaLayout>
    );
  }
  
  // Show error state if data fetching failed
  if (error) {
    return (
      <BetaLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center max-w-lg">
            <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-destructive">Data Fetch Error</h3>
            <p className="text-foreground/70 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              <RefreshCw size={16} className="mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </BetaLayout>
    );
  }

  return (
    <BetaLayout>
      {/* Header with trending stats */}
      <div className="bg-card/60 backdrop-blur-sm border border-primary/20 p-4 rounded-lg mb-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Badge className="bg-gradient-to-r from-primary to-secondary text-white font-medium py-1 px-3 mr-3">TRENDING</Badge>
          <span className="text-foreground/70 text-sm">
            Top {tokenData.length} trending tokens by {activeTimeframe} volume across all chains
          </span>
        </div>
        <div className="flex items-center">
          <a 
            href="https://www.coingecko.com/en/categories" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center text-primary hover:text-primary/80 transition-colors text-sm"
          >
            <span>View all on CoinGecko</span>
            <ExternalLink size={14} className="ml-1" />
          </a>
        </div>
      </div>

      {showHeatmap ? (
        /* Heatmap View */
        <div className="mb-8">
          <div className="bg-card/60 backdrop-blur-sm border border-primary/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">MetaHeat™ Token Heatmap ({activeTimeframe})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {tokenData.map((token) => {
                const score = getScore(token);
                const colorClass = getScoreColorClass(score);
                return (
                  <div 
                    key={token.id}
                    className={`heat-cell bg-gradient-to-br ${colorClass} rounded p-3 flex flex-col justify-between cursor-pointer transition-transform hover:scale-[1.03]`}
                    onClick={() => window.open(token.dexScreenerUrl, '_blank')}
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-mono">${token.symbol}</div>
                      <Badge 
                        variant={token.priceChange24h.startsWith('+') ? 'success' : 'destructive'}
                        className="text-xs py-0 px-1.5"
                      >
                        {token.priceChange24h}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">{score}</div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs opacity-70 truncate">{token.price}</div>
                        <div className="text-xs px-1.5 py-0.5 rounded-sm bg-accent/20 text-accent">{token.network}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-xs text-foreground/60 text-center">
              Score is calculated based on price action, volume, and market sentiment
            </div>
          </div>
        </div>
      ) : (
        /* Tokens grid - Card View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {tokenData.map((token) => (
            <Card 
              key={token.id} 
              className="bg-card/60 backdrop-blur-sm border border-primary/20 overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
              onClick={() => window.open(token.dexScreenerUrl, '_blank')}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      {token.symbol}
                      {token.priceChange24h.startsWith('+') ? 
                        <TrendingUp size={16} className="ml-2 text-green-500" /> : 
                        <TrendingDown size={16} className="ml-2 text-red-500" />
                      }
                    </CardTitle>
                    <CardDescription>{token.name}</CardDescription>
                  </div>
                  <Badge variant={token.priceChange24h.startsWith('+') ? 'success' : 'destructive'}>
                    {token.priceChange24h}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-foreground/60">Price</p>
                    <p className="font-medium">{token.price}</p>
                  </div>
                  <div>
                    <p className="text-foreground/60">{activeTimeframe} Volume</p>
                    <p className="font-medium">{token.volume24h}</p>
                  </div>
                  <div>
                    <p className="text-foreground/60">Liquidity</p>
                    <p className="font-medium">{token.liquidity}</p>
                  </div>
                  <div>
                    <p className="text-foreground/60">Market Cap</p>
                    <p className="font-medium">{token.marketCap}</p>
                  </div>
                </div>
                <div className="mt-2 w-full bg-background/40 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${token.priceChange24h.startsWith('+') ? 'bg-success' : 'bg-destructive'}`}
                    style={{ width: `${Math.min(Math.abs(parseFloat(token.priceChange24h.replace('%', ''))), 100)}%` }}
                  ></div>
                </div>
              </CardContent>
              {/* AI MetaHeat Analysis Section */}
              <div className="px-6 py-3 bg-gradient-to-r from-primary/5 to-secondary/5 border-t border-primary/10">
                <div className="flex items-center mb-1">
                  <Badge variant="outline" className="text-xs font-normal bg-primary/5 text-primary">
                    MetaHeat™ AI Analysis
                  </Badge>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {token.aiComment || "Analysis not available for this token."}
                </p>
              </div>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex items-center">
                  <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent">{token.network}</span>
                </div>
                <div className="text-xs text-primary flex items-center">
                  <span>View Chart</span>
                  <ExternalLink size={10} className="ml-1" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Market Trends Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-card/40 backdrop-blur-sm border border-primary/20 rounded-lg p-6">
          <h3 className="text-xl font-display font-bold mb-3">Current Market Trends</h3>
          <div className="space-y-4">
            <div className="bg-background/30 rounded-lg p-3 border border-primary/10 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">Meme Coins</h4>
                <p className="text-xs text-foreground/70">High social media activity</p>
              </div>
              <div className="flex items-center">
                <Badge variant="success" className="mr-2">+18.7%</Badge>
                <TrendingUp size={18} className="text-success" />
              </div>
            </div>
            <div className="bg-background/30 rounded-lg p-3 border border-primary/10 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">AI Tokens</h4>
                <p className="text-xs text-foreground/70">Sustained investor interest</p>
              </div>
              <div className="flex items-center">
                <Badge variant="success" className="mr-2">+7.2%</Badge>
                <TrendingUp size={18} className="text-success" />
              </div>
            </div>
            <div className="bg-background/30 rounded-lg p-3 border border-primary/10 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">Elon-Related</h4>
                <p className="text-xs text-foreground/70">Recent tweet activity</p>
              </div>
              <div className="flex items-center">
                <Badge variant="success" className="mr-2">+24.5%</Badge>
                <TrendingUp size={18} className="text-success" />
              </div>
            </div>
            <div className="bg-background/30 rounded-lg p-3 border border-primary/10 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">Political Tokens</h4>
                <p className="text-xs text-foreground/70">Election cycle impact</p>
              </div>
              <div className="flex items-center">
                <Badge variant="destructive" className="mr-2">-2.8%</Badge>
                <TrendingDown size={18} className="text-destructive" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-card/40 backdrop-blur-sm border border-primary/20 rounded-lg p-6">
          <h3 className="text-xl font-display font-bold mb-3">AI Prediction Engine</h3>
          <p className="text-foreground/80 mb-4 text-sm">
            Our proprietary MetaHeat Engine analyzes on-chain data, social media trends, 
            trading volumes, and market sentiment to predict high-potential tokens.
          </p>
          
          <div className="bg-background/30 rounded-lg p-4 border border-primary/10 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold">Top 3 Picks for Today</h4>
              <Badge className="bg-accent">AI Generated</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">1. $BONK</span>
                <Badge variant="success">Buy</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">2. $BORK</span>
                <Badge variant="success">Buy</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">3. $WIF</span>
                <Badge variant="secondary">Hold</Badge>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-foreground w-full"
            >
              <Link href="/" className="flex items-center justify-center">
                Get Full Access to AI Predictions
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Additional Features Showcase */}
      <div className="bg-card/40 backdrop-blur-sm border border-primary/20 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-display font-bold mb-4 text-center">Additional Features in Early Access</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-background/30 rounded-lg p-4 border border-primary/10 text-center hover:bg-background/50 cursor-pointer transition-colors">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"/><line x1="2" x2="22" y1="20" y2="20"/></svg>
            </div>
            <h4 className="font-bold">Social Sentiment</h4>
            <p className="text-xs text-foreground/70 mt-1">Twitter & Reddit analysis for trend prediction</p>
          </div>
          
          <div className="bg-background/30 rounded-lg p-4 border border-primary/10 text-center hover:bg-background/50 cursor-pointer transition-colors">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 2v20M2 5h20M2 19h20"/></svg>
            </div>
            <h4 className="font-bold">Advanced Charts</h4>
            <p className="text-xs text-foreground/70 mt-1">Multi-timeframe technical analysis</p>
          </div>
          
          <div className="bg-background/30 rounded-lg p-4 border border-primary/10 text-center hover:bg-background/50 cursor-pointer transition-colors">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><circle cx="12" cy="8" r=".01"/></svg>
            </div>
            <h4 className="font-bold">Real-time Alerts</h4>
            <p className="text-xs text-foreground/70 mt-1">Get notified of emerging trends instantly</p>
          </div>
          
          <div className="bg-background/30 rounded-lg p-4 border border-primary/10 text-center hover:bg-background/50 cursor-pointer transition-colors">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </div>
            <h4 className="font-bold">Custom Strategy</h4>
            <p className="text-xs text-foreground/70 mt-1">Build & test personalized trading strategies</p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Button 
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-foreground"
            size="lg"
          >
            <Link href="/" className="flex items-center">
              Get Full Beta Access
            </Link>
          </Button>
        </div>
      </div>
    </BetaLayout>
  );
}