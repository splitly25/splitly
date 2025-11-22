import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export function CTASection() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="contact" ref={sectionRef} className="relative py-8 px-4 sm:px-6 lg:px-8 mb-32">
      <div className="relative max-w-4xl mx-auto">
        <div
          className={`text-center p-8 md:p-10 rounded-3xl border border-[#EF9A9A]/30 bg-white/80 backdrop-blur-sm shadow-xl transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-slate-800 mb-6 text-balance leading-tight">
            Sẵn sàng làm cho{" "}
            <span className="font-medium italic bg-gradient-to-r from-[#EF9A9A] to-[#E57373] bg-clip-text text-transparent">
              chia hóa đơn trở nên dễ dàng
            </span>
            ?
          </h3>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Tham gia với hàng ngàn nhóm đã sử dụng Splitly để chia chi phí công bằng và duy trì tình bạn.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/register"
              className="group inline-flex items-center gap-3 px-8 py-4 md:px-12 md:py-6 bg-gradient-to-r from-[#EF9A9A] to-[#E57373] text-white rounded-full font-semibold text-base md:text-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Bắt đầu chia miễn phí
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          <p className="text-sm text-slate-400 mt-6">
            Không cần thẻ tín dụng • Miễn phí mãi mãi cho tính năng cơ bản
          </p>
        </div>
      </div>
    </section>
  )
}
