import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const TestimonialsColumn = ({ testimonials, duration = 10, className }) => {
  return (
    <div className={`relative overflow-hidden h-[700px] ${className}`}>
      <motion.div
        animate={{
          translateY: '-50%',
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...Array(2)].map((_, index) => (
          <div key={index}>
            {testimonials.map(({ text, name, role }, i) => (
              <div
                className="p-8 rounded-3xl border border-[#EF9A9A]/20 shadow-lg bg-white/80 backdrop-blur-sm max-w-xs w-full mb-6"
                style={{
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(251, 113, 133, 0.1)',
                }}
                key={i}
              >
                <div className="text-slate-600 text-sm leading-relaxed">{text}</div>
                <div className="mt-5">
                  <div className="font-medium tracking-tight leading-5 text-slate-800">{name}</div>
                  <div className="leading-5 opacity-60 tracking-tight text-slate-500">{role}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export function TestimonialsSection() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const testimonials = [
    {
      text: 'OMG! Cuối cùng, một ứng dụng giúp chia hóa đơn không còn drama! UI đẹp như mơ, màu hồng này tôi yêu quá đi! 💕',
      name: 'Gia Khang',
      role: 'Full Stack Developer, DevOps',
    },
    {
      text: 'Splitly literally cứu mạng! Không còn phải làm math trong đầu nữa. App này smooth và aesthetic vậy là đủ rồi! Love youuuu Splitly! 🥰',
      name: 'Trà Hoàng',
      role: 'AI Researcher, Developer',
    },
    {
      text: 'Quét hóa đơn = mind blown 🤯 Chụp ảnh xong tự động chia, ai nghĩ ra idea này genius quá! No cap, đây là app hay nhất năm!',
      name: 'Phi Hùng',
      role: 'Fullstack Developer',
    },
    {
      text: 'Từ giờ không còn awkward moments khi đi ăn nhóm! Splitly làm mọi thứ fair và square. Màu pastel này aesthetic vl! 💯',
      name: 'Gia Thành',
      role: 'Fullstack Developer',
    },
    {
      text: "Với người introvert như tôi, Splitly là lifesaver! Không phải làm 'bad guy' đòi tiền nữa. The app does the talking! 🙌",
      name: 'Lisa Thompson',
      role: 'Event Coordinator',
    },
    {
      text: "No more 'tôi chuyển tiền sau nhé' và biến mất! Splitly keeps everyone accountable. Design đẹp mê ly luôn! 🎨",
      name: 'James Wilson',
      role: 'Weekend Warrior',
    },
    {
      text: 'Just discovered Splitly và đã instantly fall in love! App này slay quá, giờ đi đâu cũng flex với bạn bè! Bestie forever! 💎',
      name: 'Maria Garcia',
      role: 'Social Media Influencer',
    },
    {
      text: 'Tôi nhét chữ chứ ko ai nói thế cả',
      name: 'No One',
      role: 'Vua nhét chữ',
    },
  ]

  return (
    <section id="testimonials" ref={sectionRef} className="relative pt-16 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-32">
          <div
            className={`inline-flex items-center gap-2 text-slate-500 text-sm font-medium tracking-wider uppercase mb-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="w-8 h-px bg-slate-300"></div>
            Câu chuyện thành công
            <div className="w-8 h-px bg-slate-300"></div>
          </div>
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-light text-slate-800 mb-8 tracking-tight text-balance transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Được yêu thích bởi <span className="font-medium italic text-[#EF9A9A]">các nhóm ở khắp mọi nơi</span>
          </h2>
          <p
            className={`text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Khám phá lý do tại sao hàng ngàn nhóm bạn, bạn cùng phòng và du khách tin tưởng Splitly cho chi phí chung
            của họ
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div
          className={`relative flex justify-center items-center min-h-[600px] md:min-h-[800px] overflow-hidden transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div
            className="flex gap-8 max-w-6xl"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
            }}
          >
            <TestimonialsColumn testimonials={testimonials.slice(0, 3)} duration={15} className="flex-1" />
            <TestimonialsColumn
              testimonials={testimonials.slice(2, 5)}
              duration={12}
              className="flex-1 hidden md:block"
            />
            <TestimonialsColumn
              testimonials={testimonials.slice(5, 8)}
              duration={18}
              className="flex-1 hidden lg:block"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
