import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, Share2, Shield, Zap, Globe, TrendingUp, DollarSign } from "lucide-react"
import InvestmentHero from "@/components/investment/investment-hero"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="/images/alhaqq-logo.png"
              alt="AlHaqq Investment Platform"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-gray-900 dark:text-white">AlHaqq Connect</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Investment Hero Section */}
      <InvestmentHero />

      {/* Investment Growth Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Watch Your Investments Grow</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Our platform combines advanced investment strategies with social networking to help you build wealth while
              connecting with like-minded investors.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>Automated portfolio rebalancing</span>
              </li>
              <li className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>Low fees and transparent pricing</span>
              </li>
              <li className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Bank-level security and insurance</span>
              </li>
            </ul>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Start Investing Today
            </Button>
          </div>
          <div className="relative">
            <Image
              src="/images/investment-growth-coins.jpeg"
              alt="Investment growth with coins and upward trend"
              width={600}
              height={400}
              className="rounded-lg shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Why Choose AlHaqq Connect?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageSquare className="w-10 h-10 text-blue-600 mb-4" />
              <CardTitle>Investment Discussions</CardTitle>
              <CardDescription>
                Connect with fellow investors, share insights, and discuss market trends in real-time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Share2 className="w-10 h-10 text-green-600 mb-4" />
              <CardTitle>Portfolio Sharing</CardTitle>
              <CardDescription>
                Share your investment journey, showcase your portfolio performance, and learn from others.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="w-10 h-10 text-purple-600 mb-4" />
              <CardTitle>Secure Platform</CardTitle>
              <CardDescription>
                Your investments and personal data are protected with bank-level security measures.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="w-10 h-10 text-yellow-600 mb-4" />
              <CardTitle>Real-time Updates</CardTitle>
              <CardDescription>
                Get instant notifications about market changes, investment opportunities, and social updates.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Globe className="w-10 h-10 text-indigo-600 mb-4" />
              <CardTitle>Global Markets</CardTitle>
              <CardDescription>
                Access international investment opportunities and connect with investors worldwide.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-10 h-10 text-red-600 mb-4" />
              <CardTitle>Expert Network</CardTitle>
              <CardDescription>
                Connect with certified financial advisors, investment professionals, and successful investors.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Digital Investment Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/digital-investment-interface.jpeg"
            alt="Digital investment interface"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Advanced Investment Technology</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Experience the future of investing with our cutting-edge platform that combines AI-powered insights with
            intuitive social features.
          </p>
          <Button size="lg" variant="secondary">
            Explore Our Technology
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Investment Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of investors who are already building wealth and connections on AlHaqq Connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Create Your Account
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
              View Investment Plans
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/contact-banner.png" alt="Contact us background" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="text-lg mb-8 opacity-90">
            Have questions about our platform? Our team is here to help you get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Contact Support
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/images/alhaqq-logo.png"
                  alt="AlHaqq Investment Platform"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold">AlHaqq Connect</span>
              </div>
              <p className="text-gray-400">Building wealth through smart investments and meaningful connections.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Investment Plans
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Social Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Our Team
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AlHaqq Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
