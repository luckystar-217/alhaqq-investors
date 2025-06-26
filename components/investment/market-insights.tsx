import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Globe, BarChart3 } from "lucide-react"

export default function MarketInsights() {
  const marketData = [
    { symbol: "S&P 500", value: "4,567.89", change: "+1.2%", trend: "up" },
    { symbol: "NASDAQ", value: "14,234.56", change: "+0.8%", trend: "up" },
    { symbol: "DOW", value: "34,567.12", change: "-0.3%", trend: "down" },
    { symbol: "FTSE 100", value: "7,456.78", change: "+0.5%", trend: "up" },
  ]

  const insights = [
    {
      title: "Digital Investment Revolution",
      description: "How technology is transforming investment strategies",
      image: "/images/digital-investment-interface.jpeg",
      category: "Technology",
      readTime: "5 min read",
    },
    {
      title: "Market Analysis & Trends",
      description: "Latest market movements and what they mean for investors",
      image: "/images/stock-market-chart.jpeg",
      category: "Market Analysis",
      readTime: "8 min read",
    },
    {
      title: "Sustainable Growth Strategies",
      description: "Building long-term wealth through sustainable investing",
      image: "/images/plant-growth-investment.jpeg",
      category: "ESG Investing",
      readTime: "6 min read",
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Market Insights</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Stay informed with real-time market data and expert analysis to make better investment decisions.
          </p>
        </div>

        {/* Market Data Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {marketData.map((market, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  {market.trend === "up" ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div className="text-sm text-gray-500 mb-1">{market.symbol}</div>
                <div className="text-lg font-bold">{market.value}</div>
                <div className={`text-sm ${market.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {market.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Market Chart Section */}
        <div className="mb-16">
          <Card className="overflow-hidden">
            <div className="relative h-64 lg:h-80">
              <Image
                src="/images/stock-market-chart.jpeg"
                alt="Stock market analysis and charts"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Real-Time Market Analysis</h3>
                <p className="opacity-90">Advanced charting and technical analysis tools</p>
              </div>
              <div className="absolute top-6 right-6">
                <Button variant="secondary" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Full Chart
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Insights Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {insights.map((insight, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={insight.image || "/placeholder.svg"}
                  alt={insight.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">{insight.category}</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{insight.title}</CardTitle>
                <CardDescription className="line-clamp-3">{insight.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{insight.readTime}</span>
                  <Button variant="ghost" size="sm">
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Global Markets Section */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Globe className="h-6 w-6 text-blue-600" />
                    <h3 className="text-2xl font-bold">Global Market Access</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Invest in markets worldwide with our comprehensive platform. Access stocks, bonds, ETFs, and
                    alternative investments from major global exchanges.
                  </p>
                  <div className="flex space-x-4">
                    <Button>Explore Markets</Button>
                    <Button variant="outline">View All Assets</Button>
                  </div>
                </div>
                <div className="relative h-64">
                  <Image
                    src="/images/financial-dashboard.jpeg"
                    alt="Global financial markets dashboard"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
