import { Link } from "react-router-dom"

const footerLinks = [
  {
    label: "Sản phẩm",
    links: [
      { title: "Tính năng", href: "#features" },
      { title: "Cách hoạt động", href: "#how-it-works" },
      { title: "Bảng giá", href: "#" },
    ],
  },
  {
    label: "Công ty",
    links: [
      { title: "Về chúng tôi", href: "#" },
      { title: "Liên hệ", href: "#" },
      { title: "Chính sách quyền riêng tư", href: "#" },
    ],
  },
  {
    label: "Hỗ trợ",
    links: [
      { title: "Trung tâm trợ giúp", href: "#" },
      { title: "Câu hỏi thường gặp", href: "#" },
      { title: "Phản hồi", href: "#" },
    ],
  },
]

export function Footer() {
  const scrollToSection = (href) => {
    if (href.startsWith("#") && href !== "#") {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <footer className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t border-[#EF9A9A]/20 px-6 py-12 lg:py-16">
      <div className="bg-[#EF9A9A]/50 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

      <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
        {/* Logo and description */}
        <div className="space-y-4">
          <div className="text-2xl font-bold text-slate-800">
            Split<span className="text-[#EF9A9A]">ly</span>
          </div>
          <p className="text-slate-500 text-sm max-w-xs">
            Cách dễ nhất để chia chi phí với bạn bè, gia đình và bạn cùng phòng. Không còn cuộc trò chuyện khó xử về tiền bạc.
          </p>
          <div className="text-slate-400 mt-8 text-sm hidden md:block">
            <p>© {new Date().getFullYear()} Splitly. Bảo lưu mọi quyền.</p>
          </div>
        </div>

        {/* Links */}
        <div className="mt-10 grid grid-cols-3 gap-8 xl:col-span-2 xl:mt-0">
          {footerLinks.map((section) => (
            <div key={section.label} className="mb-10 md:mb-0">
              <h3 className="text-xs text-slate-700 font-medium mb-4">{section.label}</h3>
              <ul className="text-slate-500 space-y-3 text-sm">
                {section.links.map((link) => (
                  <li key={link.title}>
                    {link.href.startsWith("#") ? (
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="hover:text-[#EF9A9A] transition-all duration-300 cursor-pointer"
                      >
                        {link.title}
                      </button>
                    ) : (
                      <Link
                        to={link.href}
                        className="hover:text-[#EF9A9A] transition-all duration-300"
                      >
                        {link.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="md:hidden mt-8 text-center space-y-2">
        <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Splitly. Bảo lưu mọi quyền.</p>
      </div>

      <div className="hidden md:block mt-8 pt-6 border-t border-[#EF9A9A]/20 w-full">
        <p className="text-slate-400 text-xs text-center">
          Được tạo ra với tình yêu cho các nhóm ở khắp mọi nơi
        </p>
      </div>
    </footer>
  )
}
