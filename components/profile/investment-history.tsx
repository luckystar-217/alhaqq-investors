"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity } from "lucide-react"
import Image from "next/image"

interface Investment {
  id: string
  name: string
  type: "stock" | "crypto" | "real-estate" | "bond" | "mutual-fund"
  amount: number
  currentValue: number
  change: number
  changePercent: number
  purchaseDate: string
  image: string
  status: "active" | "sold" | "pending"
}

interface InvestmentHistoryProps {
  userId: string
}

export function InvestmentHistory({ userId }: InvestmentHistoryProps) {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "active" | "sold">("all")

  useEffect(() => {
    loadInvestmentHistory()
  }, [userId])

  const loadInvestmentHistory = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockInvestments: Investment[] = [
        {
          id: "inv-1",
          name: "Tech Growth Fund",
          type: "mutual-fund",
          amount: 15000,
          currentValue: 18500,
          change: 3500,
          changePercent: 23.33,
          purchaseDate: "2023-06-15",
          image: "/images/digital-investment-interface.jpeg",
          status: "active",
        },
        {
          id: "inv-2",
          name: "Real Estate REIT",
          type: "real-estate",
          amount: 25000,
          currentValue: 27800,
          change: 2800,
          changePercent: 11.2,
          purchaseDate: "2023-04-20",
          image: "/images/real-estate-investing-sign.jpeg",
          status: "active",
        },
        {
          id: "inv-3",
          name: "Green Energy Stocks",
          type: "stock",
          amount: 12000,
          currentValue: 13440,
          change: 1440,
          changePercent: 12.0,
          purchaseDate: "2023-08-10",
          image: "/images/plant-growth-investment.jpeg",
          status: "active",
        },
        {
          id: "inv-4",
          name: "Corporate Bonds",
          type: "bond",
          amount: 20000,
          currentValue: 20600,
          change: 600,
          changePercent: 3.0,
          purchaseDate: "2023-03-05",
          image: "/images/investment-growth-coins.jpeg",
          status: "active",
        },
        {
          id: "inv-5",
          name: "Bitcoin Investment",
          type: "crypto",
          amount: 8000,
          currentValue: 7200,
          change: -800,
          changePercent: -10.0,
          purchaseDate: "2023-09-01",
          image: "/images/financial-dashboard.jpeg",
          status: "sold",
        },
      ]

      setInvestments(mockInvestments)
    } catch (error) {
      console.error("Error loading investment history:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredInvestments = investments.filter((investment) => {
    if (filter === "all") return true
    return investment.status === filter
  })

  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalGain = totalValue - totalInvested
  const totalGainPercent = (totalGain / totalInvested) * 100

  const getTypeColor = (type: Investment["type"]) => {
    const colors = {
      stock: "bg-blue-100 text-blue-800",
      crypto: "bg-orange-100 text-orange-800",
      "real-estate": "bg-green-100 text-green-800",
      bond: "bg-purple-100 text-purple-800",
      "mutual-fund": "bg-indigo-100 text-indigo-800",
    }
    return colors[type]
  }

  const getStatusColor = (status: Investment["status"]) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      sold: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
    }
    return colors[status]
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="text-2xl font-bold">${totalInvested.toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
                <p className={`text-2xl font-bold ${totalGain >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {totalGain >= 0 ? "+" : ""}${totalGain.toLocaleString()}
                </p>
              </div>
              {totalGain >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Return %</p>
                <p className={`text-2xl font-bold ${totalGainPercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {totalGainPercent >= 0 ? "+" : ""}
                  {totalGainPercent.toFixed(1)}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Investment Portfolio</CardTitle>
              <CardDescription>Your investment history and current holdings</CardDescription>
            </div>

            <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="sold">Sold</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInvestments.map((investment) => (
              <div
                key={investment.id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="relative h-12 w-12 rounded-lg overflow-hidden">
                  <Image
                    src={investment.image || "/placeholder.svg"}
                    alt={investment.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{investment.name}</h3>
                    <Badge variant="secondary" className={getTypeColor(investment.type)}>
                      {investment.type.replace("-", " ")}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(investment.status)}>
                      {investment.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Purchased on {new Date(investment.purchaseDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Invested</p>
                      <p className="font-medium">${investment.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Value</p>
                      <p className="font-medium">${investment.currentValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gain/Loss</p>
                      <div className="flex items-center gap-1">
                        {investment.change >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`font-medium ${investment.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {investment.change >= 0 ? "+" : ""}${investment.change.toLocaleString()}
                        </span>
                        <span className={`text-sm ${investment.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                          ({investment.changePercent >= 0 ? "+" : ""}
                          {investment.changePercent.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredInvestments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No investments found for the selected filter.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
