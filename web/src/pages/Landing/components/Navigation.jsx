import { useState, useEffect, useRef } from "react"
import { Menu, X, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "../../../utils/cn"

const navigation = [
  { name: "Tính năng", href: "#features" },
  { name: "Cách hoạt động", href: "#how-it-works" },
  { name: "Đánh giá", href: "#testimonials" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasLoaded(true)
    }, 100)

    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY

        if (currentScrollY > 50) {
          if (currentScrollY > lastScrollY.current && currentScrollY - lastScrollY.current > 5) {
            setIsVisible(false)
          } else if (lastScrollY.current - currentScrollY > 5) {
            setIsVisible(true)
          }
        } else {
          setIsVisible(true)
        }

        lastScrollY.current = currentScrollY
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar, { passive: true })

      return () => {
        window.removeEventListener("scroll", controlNavbar)
        clearTimeout(timer)
      }
    }

    return () => clearTimeout(timer)
  }, [])

  const scrollToSection = (href) => {
    const element = document.querySelector(href)
    if (element) {
      const rect = element.getBoundingClientRect()
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop
      const elementAbsoluteTop = rect.top + currentScrollY
      const navbarHeight = 100
      const targetPosition = Math.max(0, elementAbsoluteTop - navbarHeight)

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
    setIsOpen(false)
  }

  return (
    <>
      <nav
        className={cn(
          "fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500",
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-20 md:-translate-y-24 opacity-0",
          hasLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
        style={{
          transition: hasLoaded ? "all 0.5s ease-out" : "opacity 0.8s ease-out, transform 0.8s ease-out",
        }}
      >
        <div className="w-[90vw] max-w-xs md:max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-md border border-[#EF9A9A]/20 rounded-full px-4 py-3 md:px-6 md:py-2 shadow-lg">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                <span className="text-xl md:text-2xl font-bold text-slate-800">
                  Split<span className="text-[#EF9A9A]">ly</span>
                </span>
              </button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="text-slate-600 hover:text-slate-900 hover:scale-105 transition-all duration-200 font-medium cursor-pointer"
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {/* Desktop CTA Button */}
              <div className="hidden md:block">
                <Link
                  to="/login"
                  className="relative bg-[#EF9A9A] hover:bg-[#E57373] text-white font-medium px-6 py-2 rounded-full flex items-center transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group"
                >
                  <span className="mr-2">Login</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-slate-700 hover:scale-110 transition-transform duration-200 cursor-pointer"
              >
                <div className="relative w-6 h-6">
                  <Menu
                    size={24}
                    className={cn(
                      "absolute inset-0 transition-all duration-300",
                      isOpen ? "opacity-0 rotate-180 scale-75" : "opacity-100 rotate-0 scale-100"
                    )}
                  />
                  <X
                    size={24}
                    className={cn(
                      "absolute inset-0 transition-all duration-300",
                      isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-75"
                    )}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden relative">
          <div
            className={cn(
              "fixed inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300",
              isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            onClick={() => setIsOpen(false)}
            style={{ top: "0", left: "0", right: "0", bottom: "0", zIndex: -1 }}
          />

          <div
            className={cn(
              "mt-2 w-[90vw] max-w-xs mx-auto transition-all duration-500 ease-out transform-gpu",
              isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-8 scale-95 pointer-events-none"
            )}
          >
            <div className="bg-white/95 backdrop-blur-md border border-[#EF9A9A]/20 rounded-2xl p-4 shadow-2xl">
              <div className="flex flex-col space-y-1">
                {navigation.map((item, index) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg px-3 py-3 text-left transition-all duration-300 font-medium cursor-pointer transform hover:scale-[1.02] hover:translate-x-1"
                    style={{
                      animationDelay: isOpen ? `${index * 80 + 100}ms` : "0ms",
                    }}
                  >
                    {item.name}
                  </button>
                ))}
                <div className="h-px bg-slate-200 my-2" />
                <Link
                  to="/register"
                  className="relative bg-[#EF9A9A] hover:bg-[#E57373] text-white font-medium px-6 py-3 rounded-full flex items-center transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group"
                  style={{
                    animationDelay: isOpen ? `${navigation.length * 80 + 150}ms` : "0ms",
                  }}
                >
                  <span className="mr-2">Bắt đầu</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
