"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, DollarSign, PieChart, BarChart3, Target } from "lucide-react"
import Header from "@/components/layout/header"
import InvestmentHero from "@/components/investment/investment-hero"
import InvestmentStrategies from "@/components/investment/investment-strategies"
import MarketInsights from "@/components/investment/market-insights"

export default function InvestmentsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const portfolioStats = {
    totalValue: 125000,
    totalGain: 15000,
    gainPercentage: 13.6,
    monthlyReturn: 2.4,
  }

  const investments = [
    {
      id: 1,
      name: "Tech Growth Fund",
      type: "Mutual Fund",
      value: 45000,
      gain: 5400,
      gainPercentage: 13.6,
      risk: "Medium",
      image: "/images/digital-investment-interface.jpeg",
    },
    {
      id: 2,
      name: "Real Estate Portfolio",
      type: "REIT",
      value: 35000,
      gain: 4200,
      gainPercentage: 13.6,
      risk: "Low",
      image: "/images/real-estate-investing-sign.jpeg",
    },
    {
      id: 3,
      name: "Sustainable Growth",
      type: "ESG Fund",
      value: 25000,
      gain: 3000,
      gainPercentage: 13.6,
      risk: "Medium",
      image: "/images/plant-growth-investment.jpeg",
    },
    {
      id: 4,
      name: "Global Markets Fund",
      type: "International",
      value: 20000,
      gain: 2400,
      gainPercentage: 13.6,
      risk: "High",
      image: "/images/stock-market-chart.jpeg",
    },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <InvestmentHero />

      <div className="container mx-auto px-4 py-8">
        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${portfolioStats.totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gains</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+${portfolioStats.totalGain.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{portfolioStats.gainPercentage}% overall</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Return</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">+{portfolioStats.monthlyReturn}%</div>
              <p className="text-xs text-muted-foreground">Above market average</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
              <Target className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">6.2/10</div>
              <p className="text-xs text-muted-foreground">Moderate risk profile</p>
            </CardContent>
          </Card>
        </div>

        {/* Investment Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
            <TabsTrigger value="investments">My Investments</TabsTrigger>
            <TabsTrigger value="opportunities">New Opportunities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5" />
                    <span>Asset Allocation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Stocks (60%)</span>
                      <span className="text-sm font-medium">$75,000</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Bonds (25%)</span>
                      <span className="text-sm font-medium">$31,250</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Real Estate (15%)</span>
                      <span className="text-sm font-medium">$18,750</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Chart</CardTitle>
                  <CardDescription>Your portfolio performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-48">
                    <Image
                      src="/images/hands-growing-coins.jpeg"
                      alt="Investment growth visualization"
                      fill
                      className="object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm opacity-90">Portfolio Growth</p>
                      <p className="text-2xl font-bold">+13.6%</p>
                      <p className="text-sm opacity-90">vs Market: +11.2%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="investments" className="space-y-6">
            <div className="grid gap-6">
              {investments.map((investment) => (
                <Card key={investment.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={investment.image || "/placeholder.svg"}
                          alt={investment.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">{investment.name}</h3>
                          <Badge variant="outline">{investment.type}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Value: ${investment.value.toLocaleString()}</span>
                          <span className="text-green-600">
                            +${investment.gain.toLocaleString()} ({investment.gainPercentage}%)
                          </span>
                          <Badge className={getRiskColor(investment.risk)} variant="secondary">
                            {investment.risk} Risk
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button size="sm">Invest More</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src="/images/digital-investment-interface.jpeg"
                    alt="Tech investment opportunity"
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-600">Recommended</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>AI & Technology Fund</CardTitle>
                  <CardDescription>High-growth potential in artificial intelligence sector</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Expected Return</span>
                      <span className="font-semibold text-green-600">15-20%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Risk Level</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Medium-High</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Minimum Investment</span>
                      <span className="font-semibold">$1,000</span>
                    </div>
                    <Button className="w-full">Learn More</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src="/images/plant-growth-investment.jpeg"
                    alt="Sustainable investment opportunity"
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-600">ESG Focused</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>Sustainable Growth Portfolio</CardTitle>
                  <CardDescription>Invest in renewable energy and clean technology</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Expected Return</span>
                      <span className="font-semibold text-green-600">12-15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Risk Level</span>
                      <Badge className="bg-green-100 text-green-800">Medium</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Minimum Investment</span>
                      <span className="font-semibold">$500</span>
                    </div>
                    <Button className="w-full">Learn More</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Investment Strategies Section */}
      <InvestmentStrategies />

      {/* Market Insights Section */}
      <MarketInsights />
    </div>
  )
}
