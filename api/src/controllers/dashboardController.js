/**
 * Dashboard Controller
 * Provides aggregated data for the dashboard view
 */

import { StatusCodes } from 'http-status-codes'
import { userModel, billModel, groupModel, activityModel } from '~/models/index.js'
import ApiError from '~/utils/APIError.js'

/**
 * Get dashboard data for a specific user
 * This includes debt summary, pending bills, groups, and recent activities
 */
const getDashboardData = async (req, res, next) => {
  try {
    const { userId } = req.params
    
    // Validate user exists
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    
    // Get user's bills
    const userBills = await billModel.getBillsByUser(userId)
    
    // Calculate debt data
    const debtData = await calculateDebtData(userBills, userId)
    
    // Get pending bills (bills where user hasn't paid yet)
    const pendingBills = getPendingBills(userBills, userId)
    
    // Get user's groups
    const userGroups = await groupModel.getGroupsByUser(userId)
    
    // Get group details with member information
    const groupsWithMembers = await Promise.all(
      userGroups.map(async (group) => {
        const members = await Promise.all(
          group.members.map(memberId => userModel.findOneById(memberId))
        )
        return {
          ...group,
          memberDetails: members.filter(member => member) // Filter out null members
        }
      })
    )
    
    // Get recent activities for user (excluding login activities)
    const recentActivities = await activityModel.getActivitiesByUser(userId, 20) // Get more to filter
    
    // Filter out login/logout activities
    const filteredActivities = recentActivities.filter(activity => 
      !['user_login', 'user_logout'].includes(activity.activityType)
    ).slice(0, 10) // Take only 10 after filtering
    
    // Format activities for display
    const formattedActivities = await formatActivitiesForDisplay(filteredActivities, userId)
    
    const dashboardData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      debtData,
      pendingBills: {
        count: pendingBills.length,
        bills: pendingBills.slice(0, 3) // Show only first 3 for dashboard
      },
      groups: groupsWithMembers,
      activities: formattedActivities
    }
    
    res.status(StatusCodes.OK).json(dashboardData)
    
  } catch (error) {
    next(error)
  }
}

/**
 * Calculate debt data (what user owes and what others owe them)
 */
const calculateDebtData = async (bills, userId) => {
  let youOwe = 0
  let theyOweYou = 0
  const debtDetails = {}
  const creditDetails = {}
  
  for (const bill of bills) {
    for (const status of bill.paymentStatus) {
      if (status.userId === userId) {
        // This is what the current user owes/is owed
        if (!status.isPaid && bill.payerId !== userId) {
          // User owes money
          youOwe += status.amountOwed
          
          // Find who paid (who user owes money to)
          const payer = await userModel.findOneById(bill.payerId)
          const payerName = payer ? payer.name : 'Unknown'
          if (!debtDetails[payerName]) {
            debtDetails[payerName] = 0
          }
          debtDetails[payerName] += status.amountOwed
        }
      } else {
        // This is what others owe the current user
        if (!status.isPaid && bill.payerId === userId) {
          // Others owe current user money
          theyOweYou += status.amountOwed
          
          // Find who owes money
          const debtor = await userModel.findOneById(status.userId)
          const debtorName = debtor ? debtor.name : 'Unknown'
          if (!creditDetails[debtorName]) {
            creditDetails[debtorName] = 0
          }
          creditDetails[debtorName] += status.amountOwed
        }
      }
    }
  }
  
  return {
    youOwe,
    theyOweYou,
    debtDetails: Object.entries(debtDetails).map(([name, amount]) => ({ name, amount })),
    creditDetails: Object.entries(creditDetails).map(([name, amount]) => ({ name, amount }))
  }
}

/**
 * Get bills where user hasn't paid yet
 */
const getPendingBills = (bills, userId) => {
  const pending = []
  
  bills.forEach(bill => {
    const userPaymentStatus = bill.paymentStatus.find(status => status.userId === userId)
    if (userPaymentStatus && !userPaymentStatus.isPaid) {
      pending.push({
        id: bill._id,
        name: bill.billName,
        amount: userPaymentStatus.amountOwed,
        createdAt: bill.createdAt,
        paymentDate: bill.paymentDate
      })
    }
  })
  
  // Sort by creation date, newest first
  return pending.sort((a, b) => b.createdAt - a.createdAt)
}

/**
 * Format activities for display in dashboard
 */
const formatActivitiesForDisplay = async (activities, currentUserId) => {
  const formatted = []
  
  for (const activity of activities) {
    let message = ''
    let type = 'default'
    
    // Get user who performed the action
    const actor = await userModel.findOneById(activity.userId)
    const actorName = actor ? actor.name : 'Someone'
    const isCurrentUser = activity.userId === currentUserId
    const actorDisplay = isCurrentUser ? 'Bạn' : actorName
    
    switch (activity.activityType) {
      // Bill activities
      case 'bill_created':
        message = `${actorDisplay} đã tạo hóa đơn ${activity.details.billName || 'mới'}`
        type = 'newBill'
        break
        
      case 'bill_updated':
        message = `${actorDisplay} đã cập nhật hóa đơn ${activity.details.billName || 'Unknown'}`
        type = 'newBill'
        break
        
      case 'bill_deleted':
        message = `${actorDisplay} đã xóa hóa đơn ${activity.details.billName || 'Unknown'}`
        type = 'default'
        break
        
      case 'bill_reminder_sent':
        message = `${actorDisplay} đã gửi nhắc nhở thanh toán hóa đơn ${activity.details.billName || 'Unknown'}`
        type = 'remind'
        break
        
      case 'bill_paid':
        message = `${actorDisplay} đã thanh toán hóa đơn ${activity.details.billName || 'Unknown'}`
        type = 'payment'
        break
        
      case 'bill_settled':
        message = `Hóa đơn ${activity.details.billName || 'Unknown'} đã được thanh toán hoàn tất`
        type = 'settled'
        break
        
      case 'bill_user_opted_out':
        message = `${actorDisplay} đã rời khỏi hóa đơn ${activity.details.billName || 'Unknown'}`
        type = 'default'
        break
        
      // Payment activities
      case 'payment_initiated': {
        const amount = activity.details.amount ? `${activity.details.amount.toLocaleString('vi-VN')} đ` : 'số tiền'
        if (isCurrentUser) {
          // Current user is paying someone else
          message = `Bạn đã gửi ${amount} cho ${activity.details.creditorName || 'người nhận'}`
        } else {
          // Someone else is paying the current user
          message = `${actorName} đã gửi bạn ${amount}`
        }
        type = 'payment'
        break
      }
        
      case 'payment_confirmed': {
        const amount = activity.details.amount ? `${activity.details.amount.toLocaleString('vi-VN')} đ` : 'số tiền'
        if (isCurrentUser) {
          // Current user confirmed someone's payment
          message = `Bạn đã xác nhận thanh toán ${amount} từ ${activity.details.debtorName || 'người gửi'}`
        } else {
          // Someone confirmed current user's payment
          message = `${actorName} đã xác nhận thanh toán ${amount} từ bạn`
        }
        type = 'payment'
        break
      }
        
      case 'payment_rejected': {
        const amount = activity.details.amount ? `${activity.details.amount.toLocaleString('vi-VN')} đ` : 'số tiền'
        if (isCurrentUser) {
          // Current user rejected someone's payment
          message = `Bạn đã từ chối thanh toán ${amount} từ ${activity.details.debtorName || 'người gửi'}`
        } else {
          // Someone rejected current user's payment
          message = `${actorName} đã từ chối thanh toán ${amount} từ bạn`
        }
        type = 'default'
        break
      }
        
      // Group activities
      case 'group_created':
        message = `${actorDisplay} đã tạo nhóm ${activity.details.groupName || 'mới'}`
        type = 'group'
        break
        
      case 'group_updated':
        message = `${actorDisplay} đã cập nhật nhóm ${activity.details.groupName || 'Unknown'}`
        type = 'group'
        break
        
      case 'group_deleted':
        message = `${actorDisplay} đã xóa nhóm ${activity.details.groupName || 'Unknown'}`
        type = 'default'
        break
        
      case 'group_member_added':
        message = `${actorDisplay} đã thêm ${activity.details.memberEmail || 'thành viên mới'} vào nhóm ${activity.details.groupName || 'Unknown'}`
        type = 'group'
        break
        
      case 'group_member_removed':
        message = `${actorDisplay} đã xóa ${activity.details.memberEmail || 'thành viên'} khỏi nhóm ${activity.details.groupName || 'Unknown'}`
        type = 'group'
        break
        
      case 'group_bill_added':
        message = `${actorDisplay} đã thêm hóa đơn ${activity.details.billName || 'mới'} vào nhóm ${activity.details.groupName || 'Unknown'}`
        type = 'newBill'
        break
        
      default:
        message = activity.details.description || `${actorDisplay} đã thực hiện hoạt động ${activity.activityType || 'không xác định'}`
        type = 'default'
    }
    
    // Add timestamp information
    const timeAgo = getTimeAgo(activity.createdAt)
    message += ` ${timeAgo}`
    
    formatted.push({
      id: activity._id,
      type,
      message
    })
  }
  
  return formatted
}

/**
 * Helper function to format time ago
 */
const getTimeAgo = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))
  const hours = Math.floor(diff / (60 * 60 * 1000))
  const minutes = Math.floor(diff / (60 * 1000))
  
  if (days > 0) {
    return `ngày ${new Date(timestamp).toLocaleDateString('vi-VN')}`
  } else if (hours > 0) {
    return `${hours} giờ trước`
  } else if (minutes > 0) {
    return `${minutes} phút trước`
  } else {
    return 'vừa xong'
  }
}

export const dashboardController = {
  getDashboardData
}