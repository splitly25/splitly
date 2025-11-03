import Layout from '~/components/Layout'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const [userName] = useState('Phi Hùng')
  const [greeting, setGreeting] = useState('')
  const navigate = useNavigate()

  // Mock data - replace with actual data from API later
  const debtData = {
    youOwe: -300000,
    theyOweYou: 150000,
    debtDetails: [
      { name: 'Gia Thành', amount: -150000 },
      { name: 'Gia Khang', amount: -150000 }
    ],
    creditDetails: [
      { name: 'Anh Trà', amount: 75000 },
      { name: 'Gia Hưng', amount: 75000 }
    ]
  }

  const pendingBills = {
    count: 8,
    bills: [
      { name: 'Cơm hến 0 Mần', amount: 150000 },
      { name: 'Cơm hến 0 Mần', amount: 150000 },
      { name: 'Cơm hến 0 Mần', amount: 150000 }
    ]
  }

  const groups = [
    { id: 1, name: 'Bệt', members: [1, 2, 3, 4] },
    { id: 2, name: 'Bệt', members: [1, 2, 3, 4] },
    { id: 3, name: 'Bệt', members: [1, 2, 3, 4] },
    { id: 4, name: 'Bệt', members: [1, 2, 3, 4] }
  ]

  const activities = [
    { id: 1, type: 'newBill', message: 'Gia Thành đã thêm bạn vào hóa đơn Cơm hến O Mân ngày 29/10/2025 vào lúc ...' },
    { id: 2, type: 'remind', message: 'Gia Thành đã nhắc bạn trả tiền hóa đơn Cơm hến O Mân ngày 28/10/2025 vào lúc ...' },
    { id: 3, type: 'remind', message: 'Gia Thành đã nhắc bạn trả tiền hóa đơn Cơm hến O Mân ngày 28/10/2025' },
    { id: 4, type: 'remind', message: 'Gia Thành đã nhắc bạn trả tiền hóa đơn Cơm hến O Mân ngày 28/10/2025' }
  ]

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours()
      if (hour < 12) return 'Chào buổi sáng'
      if (hour < 18) return 'Chào buổi chiều'
      return 'Chào buổi tối'
    }
    setGreeting(getGreeting())
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(Math.abs(amount)) + 'đ'
  }

  const getActivityBgColor = (type) => {
    if (type === 'newBill') return 'bg-teal-100'
    if (type === 'remind') return 'bg-yellow-100'
    return 'bg-sky-100'
  }

  return (
    <Layout>
      <div className="p-8 md:p-10 min-h-screen bg-white">
        {/* Greeting */}
        <h3 className="text-2xl md:text-3xl text-[#574D98] mb-8">
          {greeting}, <span className="text-[#574D98] font-bold">{userName}</span>
        </h3>

        {/* Top Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-10 mb-10">
          {/* Số tiền bạn còn nợ */}
          <div className="lg:col-span-2 bg-red-100 rounded-3xl p-6 text-[#574D98] shadow-sm">
            <div className="text-center mb-6">
              <div className="text-4xl md:text-5xl font-bold mb-1">-{formatCurrency(debtData.youOwe)}</div>
              <div className="text-sm">là số tiền bạn còn nợ</div>
            </div>
            <div className="space-y-2 pt-4 border-t border-[#574D98]/20">
              {debtData.debtDetails.map((debt, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{debt.name}</span>
                  <span className="font-semibold">-{formatCurrency(debt.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Số tiền họ nợ bạn */}
          <div className="lg:col-span-2 bg-purple-900 rounded-3xl p-6 text-purple-50 shadow-sm">
            <div className="text-center mb-6">
              <div className="text-4xl md:text-5xl font-bold mb-1">+{formatCurrency(debtData.theyOweYou)}</div>
              <div className="text-sm">là số tiền họ nợ bạn</div>
            </div>
            <div className="space-y-2 pt-4 border-t border-purple-50/20">
              {debtData.creditDetails.map((credit, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{credit.name}</span>
                  <span className="font-semibold">+{formatCurrency(credit.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bạn còn hóa đơn chưa xử lý */}
          <div className="md:col-span-2 lg:col-span-3 bg-red-50 rounded-3xl p-6 text-[#574D98] shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base font-semibold">
                Bạn còn {pendingBills.count} hóa đơn chưa xử lý
              </h4>
              <button 
                onClick={() => navigate('/bills')}
                className="text-sm text-[#574D98] hover:underline cursor-pointer"
              >
                Xem thêm
              </button>
            </div>
            <div className="space-y-2">
              {pendingBills.bills.map((bill, index) => (
                <div key={index} className="flex items-center justify-between gap-3 p-2">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      OP
                    </div>
                    <div className="text-sm font-medium truncate">{bill.name}</div>
                  </div>
                  <div className="font-semibold text-sm">{formatCurrency(bill.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Activities and Groups */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Nhóm của tôi - Left on desktop, Second on mobile */}
          <div className="order-2 lg:order-1">
            <h4 className="text-2xl font-semibold text-[#574D98] mb-4">Nhóm của tôi</h4>
            <div className="space-y-3">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-red-50 rounded-3xl p-4 shadow text-zinc-900 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-base">{group.name}</span>
                    <div className="flex -space-x-2">
                      {group.members.slice(0, 3).map((member, index) => (
                        <div
                          key={index}
                          className="w-9 h-9 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                        >
                          {index + 1}
                        </div>
                      ))}
                      {group.members.length > 3 && (
                        <div className="w-9 h-9 rounded-full bg-gray-500 border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
                          +{group.members.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Các hoạt động gần đây - Right on desktop, First on mobile */}
          <div className="order-1 lg:order-2">
            <h4 className="text-2xl font-semibold text-[#574D98] mb-4">Các hoạt động gần đây</h4>
            <div className="rounded-3xl p-5 space-y-3 shadow-md">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className={`${getActivityBgColor(activity.type)} rounded-xl p-4 font-semibold text-base leading-relaxed shadow-md`}
                >
                  {activity.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
