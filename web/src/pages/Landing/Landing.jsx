import { Navigation } from "./components/Navigation"
import { HeroSection } from "./components/HeroSection"
import { FeaturesSection } from "./components/FeaturesSection"
import { HowItWorksSection } from "./components/HowItWorksSection"
import { TestimonialsSection } from "./components/TestimonialsSection"
import { CTASection } from "./components/CTASection"
import { Footer } from "./components/Footer"
import Aurora from "./components/Aurora"

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FFF5F5] overflow-hidden">
      <main className="min-h-screen relative overflow-hidden">
        {/* Aurora Background with soft pink/rose colors */}
        <div className="fixed inset-0 w-full h-full">
          <Aurora
            colorStops={["#F8BBD0", "#EF9A9A", "#E57373"]}
            amplitude={1.0}
            blend={0.5}
            speed={0.6}
          />
        </div>
        <div className="relative z-10">
          <Navigation />
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <CTASection />
          <Footer />
        </div>
      </main>
    </div>
  )
}
