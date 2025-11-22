import { useEffect, useRef, useState } from "react"

// Animated demo components for each feature
const AnimatedBillSplitDemo = ({ isActive }) => {
  const [splitAmount, setSplitAmount] = useState([0, 0, 0, 0])
  const total = 120

  useEffect(() => {
    if (!isActive) return
    const timer = setTimeout(() => {
      setSplitAmount([30, 30, 30, 30])
    }, 500)
    return () => clearTimeout(timer)
  }, [isActive])

  return (
    <div className="bg-slate-50 rounded-lg p-4 h-32">
      <div className="text-center mb-2">
        <span className="text-lg font-bold text-[#EF9A9A]">${total}</span>
        <span className="text-xs text-slate-500 ml-1">Tổng hóa đơn</span>
      </div>
      <div className="flex justify-center gap-2">
        {splitAmount.map((amount, i) => (
          <div
            key={i}
            className="flex flex-col items-center transition-all duration-500"
            style={{ opacity: amount > 0 ? 1 : 0.3, transform: amount > 0 ? 'scale(1)' : 'scale(0.8)' }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EF9A9A] to-[#CE93D8] flex items-center justify-center text-white text-xs font-bold">
              ${amount}
            </div>
            <span className="text-xs text-slate-500 mt-1">P{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const AnimatedGroupDemo = ({ isActive }) => {
  const [members, setMembers] = useState([
    { name: "Bạn", added: false },
    { name: "Alex", added: false },
    { name: "Sam", added: false },
  ])

  useEffect(() => {
    if (!isActive) return
    members.forEach((_, index) => {
      setTimeout(() => {
        setMembers(prev => prev.map((m, i) => i === index ? { ...m, added: true } : m))
      }, 300 + index * 400)
    })
  }, [isActive])

  return (
    <div className="bg-slate-50 rounded-lg p-4 h-32">
      <div className="text-xs text-slate-500 mb-2">Nhóm bạn cùng phòng</div>
      <div className="space-y-2">
        {members.map((member, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 transition-all duration-500 ${member.added ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#EF9A9A] to-[#CE93D8]" />
            <span className="text-sm text-slate-700">{member.name}</span>
            {member.added && (
              <svg className="w-4 h-4 text-green-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const AnimatedTrackingDemo = ({ isActive }) => {
  const [expenses, setExpenses] = useState([
    { name: "Tạp hóa", amount: 85, shown: false },
    { name: "Bữa tối", amount: 65, shown: false },
    { name: "Tiện điện nước", amount: 120, shown: false },
  ])

  useEffect(() => {
    if (!isActive) return
    expenses.forEach((_, index) => {
      setTimeout(() => {
        setExpenses(prev => prev.map((e, i) => i === index ? { ...e, shown: true } : e))
      }, 400 + index * 500)
    })
  }, [isActive])

  return (
    <div className="bg-slate-50 rounded-lg p-4 h-32 overflow-hidden">
      <div className="space-y-2">
        {expenses.map((expense, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-2 rounded bg-white transition-all duration-500 ${expense.shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <span className="text-xs text-slate-700">{expense.name}</span>
            <span className="text-xs font-bold text-[#EF9A9A]">${expense.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const AnimatedSettleUpDemo = ({ isActive }) => {
  const [settled, setSettled] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setSettled(true)
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 150)
    return () => clearInterval(interval)
  }, [isActive])

  return (
    <div className="bg-slate-50 rounded-lg p-4 h-32 flex flex-col items-center justify-center">
      {!settled ? (
        <>
          <div className="text-sm text-slate-600 mb-2">Đang thanh toán...</div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#EF9A9A] to-[#CE93D8] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      ) : (
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm font-medium text-green-600">Hoàn thành!</div>
        </div>
      )}
    </div>
  )
}

const AnimatedOCRDemo = ({ isActive }) => {
  const [scanning, setScanning] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!isActive) return
    setScanning(true)
    setTimeout(() => {
      setItems([
        { name: "Pizza", price: 24.99 },
        { name: "Nước uống", price: 12.50 },
        { name: "Thuế", price: 3.75 },
      ])
      setScanning(false)
    }, 1500)
  }, [isActive])

  return (
    <div className="bg-slate-50 rounded-lg p-4 h-32 overflow-hidden">
      {scanning ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-8 h-8 border-2 border-[#EF9A9A] border-t-transparent rounded-full animate-spin mb-2" />
          <span className="text-xs text-slate-500">Đang quét hóa đơn...</span>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="text-xs text-slate-500 mb-2">Mặt hàng được phát hiện:</div>
          {items.map((item, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-slate-700">{item.name}</span>
              <span className="text-[#EF9A9A] font-medium">${item.price}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const AnimatedNotificationDemo = ({ isActive }) => {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (!isActive) return
    const notifs = [
      "Alex đã thêm 45$ cho tạp hóa",
      "Sam đã trả bạn 30$",
      "Chi phí mới trong nhóm bạn cùng phòng",
    ]
    notifs.forEach((text, index) => {
      setTimeout(() => {
        setNotifications(prev => [...prev, text])
      }, 500 + index * 700)
    })
  }, [isActive])

  return (
    <div className="bg-slate-50 rounded-lg p-4 h-32 overflow-hidden">
      <div className="space-y-2">
        {notifications.map((notif, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-2 rounded bg-white shadow-sm animate-slide-in"
          >
            <div className="w-2 h-2 rounded-full bg-[#EF9A9A]" />
            <span className="text-xs text-slate-700">{notif}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const features = [
  {
    title: "Chia hóa đơn thông minh",
    description: "Chia đều, theo phần trăm hoặc số tiền cụ thể. Máy tính thông minh của chúng tôi sẽ xử lý tất cả phép toán cho bạn.",
    demo: AnimatedBillSplitDemo,
    size: "large",
  },
  {
    title: "Tạo nhóm",
    description: "Sắp xếp chi phí theo chuyến đi, hộ gia đình hoặc sự kiện. Giữ mọi thứ được tổ chức ở một nơi.",
    demo: AnimatedGroupDemo,
    size: "medium",
  },
  {
    title: "Theo dõi chi phí",
    description: "Theo dõi ai đã trả cái gì và ai nợ ai. Không bao giờ mất dấu chi phí chung nữa.",
    demo: AnimatedTrackingDemo,
    size: "medium",
  },
  {
    title: "Thanh toán dễ dàng",
    description: "Xem ngay ai nợ cái gì và thanh toán chỉ bằng một cú chạm. Không còn cuộc trò chuyện khó xử nữa.",
    demo: AnimatedSettleUpDemo,
    size: "large",
  },
  {
    title: "Quét hóa đơn",
    description: "Chụp ảnh bất kỳ hóa đơn nào và chúng tôi sẽ tự động trích xuất các mặt hàng và số tiền để chia dễ dàng.",
    demo: AnimatedOCRDemo,
    size: "medium",
  },
  {
    title: "Cập nhật thời gian thực",
    description: "Nhận thông báo ngay lập tức khi chi phí được thêm vào hoặc khi ai đó trả lại tiền cho bạn.",
    demo: AnimatedNotificationDemo,
    size: "medium",
  },
]

export function FeaturesSection() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeDemo, setActiveDemo] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section id="features" ref={sectionRef} className="relative z-10">
      <div className="bg-white rounded-t-[3rem] pt-16 sm:pt-24 pb-16 sm:pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div
            className={`text-center mb-12 sm:mb-20 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2 text-[#EF9A9A]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Tính năng mạnh mẽ
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 text-balance mb-4 sm:mb-6">
              Mọi thứ bạn cần để{" "}
              <span className="bg-gradient-to-r from-[#EF9A9A] to-[#E57373] bg-clip-text text-transparent">
                chia công bằng
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
              Từ bữa tối đơn giản đến chuyến đi phức tạp, Splitly xử lý tất cả. Theo dõi chi phí, chia hóa đơn và thanh toán một cách dễ dàng.
            </p>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group transition-all duration-1000 ${feature.size === "large" ? "md:col-span-2" : ""}`}
                style={{
                  transitionDelay: isVisible ? `${300 + index * 100}ms` : "0ms",
                }}
                onMouseEnter={() => setActiveDemo(index)}
                onMouseLeave={() => setActiveDemo(null)}
              >
                <div className="bg-white rounded-2xl p-6 sm:p-8 h-full shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200 hover:border-[#EF9A9A]/30">
                  <div className="mb-6">
                    <feature.demo isActive={activeDemo === index || isVisible} />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 group-hover:text-[#EF9A9A] transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
