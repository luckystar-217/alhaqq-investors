import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Shield, Building, Leaf } from "lucide-react"

export default function InvestmentStrategies() {
  const strategies = [
    {
      id: 1,
      title: "Growth Investing",
      description: "Focus on companies with high growth potential",
      image: "/images/plant-growth-investment.jpeg",
      icon: TrendingUp,
      risk: "Medium-High",
      expectedReturn: "12-18%",
      minInvestment: "$1,000",
      features: ["High growth potential", "Long-term focus", "Technology stocks"],
    },
    {
      id: 2,
      title: "Value Investing",
      description: "Invest in undervalued companies with strong fundamentals",
      image: "/images/hands-growing-coins.jpeg",
      icon: Shield,
      risk: "Low-Medium",
      expectedReturn: "8-12%",
      minInvestment: "$500",
      features: ["Stable returns", "Dividend income", "Blue-chip stocks"],
    },
    {
      id: 3,
      title: "Real Estate Investment",
      description: "Diversify with real estate investment trusts (REITs)",
      image: "/images/real-estate-investing-sign.jpeg",
      icon: Building,
      risk: "Medium",
      expectedReturn: "10-15%",
      minInvestment: "$2,000",
      features: ["Property exposure", "Regular dividends", "Inflation hedge"],
    },
    {
      id: 4,
      title: "ESG Investing",
      description: "Sustainable investing with environmental and social impact",
      image: "/images/plant-growth-investment.jpeg",
      icon: Leaf,
      risk: "Medium",
      expectedReturn: "9-14%",
      minInvestment: "$750",
      features: ["Sustainable focus", "Social impact", "Future-oriented"],
    },
  ]

  const getRiskColor = (risk: string) => {
    if (risk.includes("High")) return "bg-red-100 text-red-800"
    if (risk.includes("Medium")) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <Image
              src="/images/investment-strategies-diagram.jpeg"
              alt="Investment strategies overview"
              width={400}
              height={200}
              className="rounded-lg shadow-lg"
            />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Investment Strategies</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose from our carefully curated investment strategies designed to match your risk tolerance and financial
            goals.
          </p>
        </div>

        {/* Strategies Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {strategies.map((strategy) => (
            <Card key={strategy.id} className="hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <Image
                  src={strategy.image || "/placeholder.svg"}
                  alt={strategy.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <Badge className={getRiskColor(strategy.risk)}>{strategy.risk} Risk</Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-2 text-white">
                    <strategy.icon className="h-6 w-6" />
                    <span className="font-semibold">{strategy.title}</span>
                  </div>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{strategy.title}</span>
                  <span className="text-lg font-bold text-green-600">{strategy.expectedReturn}</span>
                </CardTitle>
                <CardDescription>{strategy.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Min. Investment</span>
                    <div className="font-semibold">{strategy.minInvestment}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Expected Return</span>
                    <div className="font-semibold text-green-600">{strategy.expectedReturn}</div>
                  </div>
                </div>

                <div>
                  <span className="text-gray-500 text-sm">Key Features</span>
                  <ul className="mt-2 space-y-1">
                    {strategy.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button className="flex-1">Invest Now</Button>
                  <Button variant="outline" className="flex-1">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="relative inline-block p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Investing?</h3>
            <p className="mb-6 opacity-90">
              Get personalized investment recommendations based on your goals and risk tolerance.
            </p>
            <Button size="lg" variant="secondary">
              Get Started Today
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
