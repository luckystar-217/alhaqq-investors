import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, DollarSign, PieChart, Target } from "lucide-react"

export default function InvestmentHero() {
  const stats = [
    { icon: DollarSign, label: "Total Invested", value: "$2.5M+", color: "text-green-600" },
    { icon: TrendingUp, label: "Average Return", value: "15.2%", color: "text-blue-600" },
    { icon: PieChart, label: "Active Portfolios", value: "1,200+", color: "text-purple-600" },
    { icon: Target, label: "Success Rate", value: "94%", color: "text-orange-600" },
  ]

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/financial-dashboard.jpeg"
          alt="Financial investment dashboard background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-6">Smart Investment Platform</h1>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of investors building wealth through our AI-powered investment platform. Connect, learn,
              and grow your portfolio with expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Start Investing
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Strategies
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-sm opacity-80">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Investment Growth Visual */}
          <div className="relative">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="relative h-64 mb-4">
                  <Image
                    src="/images/investment-growth-coins.jpeg"
                    alt="Investment growth visualization"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">Portfolio Growth</h3>
                <p className="text-white/80 text-sm">
                  Watch your investments grow with our proven strategies and expert guidance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
