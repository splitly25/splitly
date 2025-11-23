import { Link } from 'react-router-dom'
import RotatingText from './RotatingText'

const ArrowRight = () => (
  <svg
    className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const Play = () => (
  <svg
    className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
)

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-hero">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-rose-200 text-slate-700 text-sm font-medium mb-8 mt-12 animate-fade-in-badge shadow-sm">
          <span className="w-2 h-2 bg-rose-500 rounded-full mr-2 animate-pulse"></span>
          Chia hóa đơn dễ dàng
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6 animate-fade-in-heading">
          <span className="text-slate-800">Chia sẻ chi phí</span>
          <br />
          <span className="inline-flex items-center justify-center flex-wrap gap-2 mt-4 sm:mt-6 md:mt-8">
            <span className="text-slate-800">cùng</span>
            <RotatingText
              texts={['Bạn bè', 'Gia đình', 'Roommates', 'Nhóm bạn', 'Ai cũng được']}
              mainClassName="px-2 sm:px-2 md:px-3 bg-gradient-to-r from-[#EF9A9A] to-[#E57373] text-white overflow-hidden py-1 sm:py-1 md:py-2 justify-center rounded-lg shadow-lg min-w-[140px] sm:min-w-[160px] md:min-w-[180px]"
              staggerFrom={'last'}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-120%' }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-1 sm:pb-1 md:pb-1"
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-xl md:text-2xl text-slate-600 text-balance max-w-sm sm:max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4 sm:px-0 animate-fade-in-subheading font-light">
          Tạm biệt những cuộc trò chuyện khó xử về tiền bạc. Splitly giúp bạn dễ dàng theo dõi chi phí chung, chia hóa
          đơn công bằng và thanh toán với bạn bè.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 sm:mb-16 animate-fade-in-buttons">
          <Link
            to="/register"
            className="bg-gradient-to-r from-[#EF9A9A] to-[#E57373] text-white rounded-full px-8 py-4 text-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 group cursor-pointer relative overflow-hidden flex items-center"
          >
            Bắt đầu chia miễn phí
            <ArrowRight />
          </Link>

          <button
            onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
            className="rounded-full px-8 py-4 text-lg font-medium border border-slate-300 hover:bg-white/50 transition-all duration-200 hover:scale-105 group bg-white/30 backdrop-blur-sm cursor-pointer text-slate-700 flex items-center"
          >
            <Play />
            Xem cách hoạt động
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="text-center px-4 hidden sm:block overflow-hidden animate-fade-in-trust">
          {/* <p className="text-sm text-slate-500 mb-6">Trusted by thousands of groups worldwide</p> */}
          <p className="text-sm text-slate-500 mb-6">Vòng chung kết Naver AI Hackathon</p>
          <div className="relative overflow-hidden w-full max-w-4xl mx-auto">
            <div className="flex items-center gap-8 opacity-70 hover:opacity-90 transition-all duration-500 animate-slide-left">
              <div className="flex items-center gap-8 whitespace-nowrap">
                <div className="text-base sm:text-lg font-semibold text-slate-700">NaverAI</div>
                <div className="text-base sm:text-lg font-semibold text-slate-700">Hackathon</div>
                <div className="text-base sm:text-lg font-semibold text-slate-700">FIT</div>
                <div className="text-base sm:text-lg font-semibold text-slate-700">HCMUS</div>
                <div className="text-base sm:text-lg font-semibold text-slate-700">Supper Wow</div>
                <div className="text-base sm:text-lg font-semibold text-slate-700">99% Happy</div>
              </div>
              {/* Duplicate for seamless loop */}
              <div className="flex items-center gap-8 whitespace-nowrap">
                <div className="text-base sm:text-lg font-semibold text-slate-700">NaverAI</div>
                <div className="text-base sm:text-lg font-semibold text-slate-700">Hackathon</div>
                <div className="text-base sm:text-lg font-semibold text-slate-700">FIT</div>
                <div className="text-base sm:text-lg font-semibold text-slate-700">HCMUS</div>
                <div className="text-base sm:text-lg font-semibold text-slate-700">Supper Wow</div>
                <div className="text-base sm:text-lg font-semibold text-slate-700">99% Happy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Trust Indicators */}
        <div className="text-center px-4 mb-8 sm:hidden overflow-hidden animate-fade-in-trust">
          <p className="text-sm text-slate-500 mb-6">Được hàng ngàn nhóm trên toàn thế giới tin tưởng</p>
          <div className="relative overflow-hidden w-full max-w-sm mx-auto">
            <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-[#FFF5F5] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-[#FFF5F5] to-transparent z-10 pointer-events-none"></div>
            <div className="flex items-center gap-6 opacity-70 animate-slide-left-mobile">
              <div className="flex items-center gap-6 whitespace-nowrap">
                <div className="text-sm font-semibold text-slate-700">50K+ Người dùng</div>
                <div className="text-sm font-semibold text-slate-700">$2M+ Đã chia</div>
                <div className="text-sm font-semibold text-slate-700">10K+ Nhóm</div>
                <div className="text-sm font-semibold text-slate-700">4.9★</div>
              </div>
              <div className="flex items-center gap-6 whitespace-nowrap">
                <div className="text-sm font-semibold text-slate-700">50K+ Người dùng</div>
                <div className="text-sm font-semibold text-slate-700">$2M+ Đã chia</div>
                <div className="text-sm font-semibold text-slate-700">10K+ Nhóm</div>
                <div className="text-sm font-semibold text-slate-700">4.9★</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
