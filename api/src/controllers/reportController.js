/**
 * Report Controller
 * Provides analytics and reporting data for user spending
 */

import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { userModel, billModel } from '~/models/index.js'
import ApiError from '~/utils/APIError.js'

/**
 * Get report data for a specific user and month
 * @route GET /api/v1/reports/:userId
 * @query year - Year (YYYY)
 * @query month - Month (1-12)
 */
const getMonthlyReport = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { year, month } = req.query

    // Security check: Verify that the authenticated user is requesting their own data
    if (req.jwtDecoded._id !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You can only access your own report data')
    }

    // Validate required parameters
    if (!year || !month) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Year and month parameters are required')
    }

    const yearNum = parseInt(year)
    const monthNum = parseInt(month)

    // Validate year and month ranges
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid year parameter')
    }

    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid month parameter (must be 1-12)')
    }

    // Convert userId to ObjectId
    const userIdObj = new ObjectId(userId)

    // Validate user exists
    const user = await userModel.findOneById(userIdObj)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // Get all user bills
    const userBills = await billModel.getBillsByUser(userIdObj)

    // Calculate report metrics
    const reportData = await calculateReportMetrics(userBills, userIdObj, yearNum, monthNum)

    res.status(StatusCodes.OK).json(reportData)
  } catch (error) {
    next(error)
  }
}

/**
 * Calculate comprehensive report metrics for a user in a specific month
 */
const calculateReportMetrics = async (bills, userId, year, month) => {
  // Get date range for current month
  const startDate = new Date(year, month - 1, 1) // month is 0-indexed in Date
  const endDate = new Date(year, month, 0, 23, 59, 59, 999) // Last day of month

  // Get date range for previous month
  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year
  const prevStartDate = new Date(prevYear, prevMonth - 1, 1)
  const prevEndDate = new Date(prevYear, prevMonth, 0, 23, 59, 59, 999)

  // Filter bills for current month
  const currentMonthBills = bills.filter((bill) => {
    const billDate = new Date(bill.createdAt)
    return billDate >= startDate && billDate <= endDate
  })

  // Filter bills for previous month
  const previousMonthBills = bills.filter((bill) => {
    const billDate = new Date(bill.createdAt)
    return billDate >= prevStartDate && billDate <= prevEndDate
  })

  // Calculate metrics
  const totalSpending = calculateTotalSpending(currentMonthBills, userId)
  const previousTotalSpending = calculateTotalSpending(previousMonthBills, userId)
  const billCount = currentMonthBills.length
  const previousBillCount = previousMonthBills.length
  const overdueBills = calculateOverdueBills(currentMonthBills, userId)
  const unpaidDebt = calculateUnpaidDebt(currentMonthBills, userId)
  const spendingTrend = calculateDailySpendingTrend(currentMonthBills, userId, year, month)
  const categoryBreakdown = calculateCategoryBreakdown(currentMonthBills, userId)
  const aiInsights = generateAIInsights(
    totalSpending,
    previousTotalSpending,
    billCount,
    previousBillCount,
    categoryBreakdown,
    spendingTrend
  )

  // Calculate percentage changes
  const spendingChange = calculatePercentageChange(totalSpending, previousTotalSpending)
  const billCountChange = calculatePercentageChange(billCount, previousBillCount)

  return {
    period: {
      year,
      month,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    metrics: {
      totalSpending: {
        amount: totalSpending,
        change: spendingChange,
        previousAmount: previousTotalSpending,
      },
      billCount: {
        count: billCount,
        change: billCountChange,
        previousCount: previousBillCount,
      },
      overdueBills: {
        count: overdueBills.count,
        amount: overdueBills.amount,
      },
      unpaidDebt: {
        amount: unpaidDebt,
      },
    },
    spendingTrend,
    categoryBreakdown,
    aiInsights,
  }
}

/**
 * Calculate total spending for bills in a period
 */
const calculateTotalSpending = (bills, userId) => {
  let total = 0

  bills.forEach((bill) => {
    const userPaymentStatus = bill.paymentStatus.find((status) => status.userId.equals(userId))
    if (userPaymentStatus) {
      total += userPaymentStatus.amountOwed
    }
  })

  return total
}

/**
 * Calculate overdue bills
 */
const calculateOverdueBills = (bills, userId) => {
  const now = new Date()
  let count = 0
  let amount = 0

  bills.forEach((bill) => {
    const userPaymentStatus = bill.paymentStatus.find((status) => status.userId.equals(userId))

    if (userPaymentStatus && !userPaymentStatus.isPaid) {
      const deadline = new Date(bill.paymentDeadline)
      if (deadline < now) {
        count++
        amount += userPaymentStatus.amountOwed - (userPaymentStatus.amountPaid || 0)
      }
    }
  })

  return { count, amount }
}

/**
 * Calculate unpaid debt
 */
const calculateUnpaidDebt = (bills, userId) => {
  let unpaid = 0

  bills.forEach((bill) => {
    const userPaymentStatus = bill.paymentStatus.find((status) => status.userId.equals(userId))

    if (userPaymentStatus && !userPaymentStatus.isPaid) {
      unpaid += userPaymentStatus.amountOwed - (userPaymentStatus.amountPaid || 0)
    }
  })

  return unpaid
}

/**
 * Calculate daily spending trend for the month
 */
const calculateDailySpendingTrend = (bills, userId, year, month) => {
  const daysInMonth = new Date(year, month, 0).getDate()
  const dailyData = Array.from({ length: daysInMonth }, (_, index) => ({
    day: index + 1,
    amount: 0,
    count: 0,
    date: new Date(year, month - 1, index + 1).toISOString(),
  }))

  bills.forEach((bill) => {
    const billDate = new Date(bill.createdAt)
    const day = billDate.getDate()

    const userPaymentStatus = bill.paymentStatus.find((status) => status.userId.equals(userId))
    if (userPaymentStatus) {
      dailyData[day - 1].amount += userPaymentStatus.amountOwed
      dailyData[day - 1].count += 1
    }
  })

  return dailyData
}

/**
 * Calculate spending breakdown by category
 */
const calculateCategoryBreakdown = (bills, userId) => {
  const categoryTotals = {}

  bills.forEach((bill) => {
    const category = bill.category || 'Khác'
    const userPaymentStatus = bill.paymentStatus.find((status) => status.userId.equals(userId))

    if (userPaymentStatus) {
      if (!categoryTotals[category]) {
        categoryTotals[category] = {
          amount: 0,
          count: 0,
        }
      }
      categoryTotals[category].amount += userPaymentStatus.amountOwed
      categoryTotals[category].count += 1
    }
  })

  // Convert to array and sort by amount
  const categoryArray = Object.entries(categoryTotals)
    .map(([category, data]) => ({
      category,
      amount: data.amount,
      count: data.count,
    }))
    .sort((a, b) => b.amount - a.amount)

  return categoryArray
}

/**
 * Calculate percentage change between two values
 */
const calculatePercentageChange = (current, previous) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0
  }
  return Math.round(((current - previous) / previous) * 1000) / 10 // Round to 1 decimal
}

/**
 * Generate AI insights based on spending data
 */
const generateAIInsights = (
  totalSpending,
  previousTotalSpending,
  billCount,
  previousBillCount,
  categoryBreakdown,
  spendingTrend
) => {
  const insights = []

  // Average transaction analysis
  const avgTransaction = billCount > 0 ? totalSpending / billCount : 0
  const prevAvgTransaction = previousBillCount > 0 ? previousTotalSpending / previousBillCount : 0
  const avgChange = calculatePercentageChange(avgTransaction, prevAvgTransaction)

  insights.push({
    title: 'Phân tích chi tiêu trung bình',
    description: `Trung bình bạn chi ${formatCurrency(avgTransaction)} cho mỗi giao dịch. ${
      billCount > previousBillCount
        ? `Số giao dịch tăng ${Math.abs(
            calculatePercentageChange(billCount, previousBillCount)
          )}% so với tháng trước.`
        : billCount < previousBillCount
          ? `Số giao dịch giảm ${Math.abs(
              calculatePercentageChange(billCount, previousBillCount)
            )}% so với tháng trước.`
          : 'Số giao dịch không đổi so với tháng trước.'
    }`,
    suggestion:
      avgChange > 20
        ? 'Giá trị mỗi giao dịch tăng cao. Hãy xem xét các khoản chi tiêu lớn có thực sự cần thiết.'
        : avgChange < -20
          ? 'Bạn đang chi tiêu hiệu quả hơn cho mỗi giao dịch!'
          : 'Duy trì mức chi tiêu ổn định này.',
  })

  // Category spending analysis
  if (categoryBreakdown.length > 0) {
    const topCategory = categoryBreakdown[0]
    const topCategoryPercent = Math.round((topCategory.amount / totalSpending) * 100)

    insights.push({
      title: 'Chi tiêu theo danh mục',
      description: `Danh mục "${topCategory.category}" chiếm ${topCategoryPercent}% tổng chi tiêu với ${formatCurrency(topCategory.amount)}.`,
      suggestion:
        topCategoryPercent > 50
          ? `Danh mục này chiếm phần lớn chi tiêu của bạn. Hãy xem xét có thể tối ưu hóa không.`
          : 'Chi tiêu của bạn được phân bổ cân đối giữa các danh mục.',
    })
  }

  // Spending trend analysis
  const nonZeroDays = spendingTrend.filter((day) => day.amount > 0).length
  if (nonZeroDays > 0) {
    insights.push({
      title: 'Tần suất chi tiêu',
      description: `Bạn có chi tiêu trong ${nonZeroDays} ngày trong tháng này.`,
      suggestion:
        nonZeroDays > 20
          ? 'Bạn chi tiêu khá thường xuyên. Hãy thử lập kế hoạch mua sắm để giảm tần suất.'
          : 'Tần suất chi tiêu của bạn khá hợp lý.',
    })
  }

  return insights
}

/**
 * Helper function to format currency
 */
const formatCurrency = (amount) => {
  return `${Math.round(amount).toLocaleString('vi-VN')} ₫`
}

export const reportController = {
  getMonthlyReport,
}
