import { WEBSITE_DOMAIN } from '~/utils/constants.js';
import { allRequestTypes } from '~/utils/tools.js';
import { billModel } from '~/models/billModel.js';
import { userModel } from '~/models/userModel.js';
import { ObjectId } from 'mongodb';

export const generateUrl = (path, payload) => {
    const url = new URL(WEBSITE_DOMAIN, path);
    Object.keys(payload).forEach((key) =>
        url.searchParams.append(key, payload[key])
    );
    return url.toString();
};

export const getNewPrompt = ({ requestType }) => {
    // console.log("Request Type:", requestType);
    const request = allRequestTypes.find(
        (type) => type.name === requestType
    );
    if (request) {
        return request.prompt;
    }
    return null;
};

export const navigateBillCreateForm = ({
    billName,
    category,
    notes,
    creationDate,
    paymentDeadline,
    payer,
    splitType,
    totalAmount,
    items,
    participants
}) => {
    return {
        path: '/create',
        state: {
            chatbotWindowOpen: true,
            billFormData: {
                billName,
                category,
                notes,
                creationDate,
                paymentDeadline,
                payer,
                splitType,
                totalAmount,
                items,
                participants,
            }
        }
    };
};

export const getDataForAnalysis = async (userId) => {
    try {
        // Get all bills for the user
        const bills = await billModel.getBillsByUser(userId);
        
        // Get current date and first day of current month
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // 1. Kiểm tra xem user nợ ai bao nhiêu tiền, sắp quá hạn hay chưa
        const debtsIOwe = [];
        const upcomingDeadlines = [];
        
        // 2. Kiểm tra xem ai nợ user lâu ngày chưa trả
        const debtsOwedToMe = [];
        const overdueDebts = [];
        
        // 3. Kiểm tra xem ai nợ user nhiều nhất
        const debtorAmounts = {};
        
        // 4. Thống kê chi tiêu trong tháng
        let monthlyExpense = 0;
        let monthlyBillCount = 0;
        const categoryStats = {};
        
        // 5. Danh sách các sản phẩm user đã dùng trong tháng này
        const productsThisMonth = [];
        
        bills.forEach(bill => {
            const paymentDeadline = new Date(bill.paymentDeadline);
            const isPayer = bill.payerId?.toString() === userId;
            
            // Find user's payment status in this bill
            const userPayment = bill.paymentStatus?.find(
                ps => ps.userId?.toString() === userId
            );
            
            if (userPayment) {
                const amountOwed = userPayment.amountOwed || 0;
                const amountPaid = userPayment.amountPaid || 0;
                const remainingAmount = amountOwed - amountPaid;
                
                // User owes money (not the payer and hasn't fully paid)
                if (!isPayer && remainingAmount > 0) {
                    debtsIOwe.push({
                        billId: bill._id.toString(),
                        billName: bill.billName,
                        creditorId: bill.payerId?.toString(),
                        amount: remainingAmount,
                        deadline: paymentDeadline,
                        isOverdue: paymentDeadline < now,
                        daysUntilDeadline: Math.ceil((paymentDeadline - now) / (1000 * 60 * 60 * 24))
                    });
                    
                    // Check if deadline is within 7 days
                    const daysUntilDeadline = Math.ceil((paymentDeadline - now) / (1000 * 60 * 60 * 24));
                    if (daysUntilDeadline > 0 && daysUntilDeadline <= 7) {
                        upcomingDeadlines.push({
                            billName: bill.billName,
                            amount: remainingAmount,
                            daysUntilDeadline
                        });
                    }
                }
                
                // Others owe user money (user is payer)
                if (isPayer) {
                    bill.paymentStatus?.forEach(payment => {
                        if (payment.userId?.toString() === userId) return; // Skip self
                        
                        const owedAmount = (payment.amountOwed || 0) - (payment.amountPaid || 0);
                        if (owedAmount > 0) {
                            const debtorId = payment.userId?.toString();
                            
                            debtsOwedToMe.push({
                                billId: bill._id.toString(),
                                billName: bill.billName,
                                debtorId,
                                amount: owedAmount,
                                deadline: paymentDeadline,
                                isOverdue: paymentDeadline < now,
                                daysOverdue: Math.ceil((now - paymentDeadline) / (1000 * 60 * 60 * 24))
                            });
                            
                            // Track total debt per person
                            if (!debtorAmounts[debtorId]) {
                                debtorAmounts[debtorId] = 0;
                            }
                            debtorAmounts[debtorId] += owedAmount;
                            
                            // Check if overdue
                            if (paymentDeadline < now) {
                                overdueDebts.push({
                                    billName: bill.billName,
                                    debtorId,
                                    amount: owedAmount,
                                    daysOverdue: Math.ceil((now - paymentDeadline) / (1000 * 60 * 60 * 24))
                                });
                            }
                        }
                    });
                }
            }
            
            // Calculate monthly statistics (bills created this month)
            const billCreationDate = new Date(bill.creationDate);
            if (billCreationDate >= firstDayOfMonth) {
                monthlyBillCount++;
                
                // If user is payer or paid their share, count as expense
                if (isPayer || (userPayment && userPayment.amountPaid > 0)) {
                    const userExpense = isPayer ? bill.totalAmount : (userPayment?.amountPaid || 0);
                    monthlyExpense += userExpense;
                    
                    // Category statistics
                    const category = bill.category || 'Khác';
                    if (!categoryStats[category]) {
                        categoryStats[category] = {
                            totalAmount: 0,
                            billCount: 0
                        };
                    }
                    categoryStats[category].totalAmount += userExpense;
                    categoryStats[category].billCount++;
                    
                    // Collect products/items with detailed information
                    if (bill.items && Array.isArray(bill.items) && bill.items.length > 0) {
                        // For item-based bills, add each item
                        bill.items.forEach(item => {
                            productsThisMonth.push({
                                billName: bill.billName,
                                itemName: item.name || null,
                                quantity: item.quantity || null,
                                category: category,
                                userExpense: userExpense
                            });
                        });
                    } else {
                        // For bills without items, add bill as single entry
                        productsThisMonth.push({
                            billName: bill.billName,
                            itemName: null,
                            quantity: null,
                            category: category,
                            userExpense: userExpense
                        });
                    }
                }
            }
        });
        
        // Find person who owes the most
        let biggestDebtor = null;
        let maxDebt = 0;
        Object.entries(debtorAmounts).forEach(([debtorId, amount]) => {
            if (amount > maxDebt) {
                maxDebt = amount;
                biggestDebtor = debtorId;
            }
        });
        
        // Sort debts by amount
        debtsIOwe.sort((a, b) => b.amount - a.amount);
        debtsOwedToMe.sort((a, b) => b.amount - a.amount);
        overdueDebts.sort((a, b) => b.daysOverdue - a.daysOverdue);
        upcomingDeadlines.sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline);
        
        // Get all unique user IDs (creditors and debtors)
        const allUserIds = new Set();
        debtsIOwe.forEach(debt => allUserIds.add(debt.creditorId));
        debtsOwedToMe.forEach(debt => allUserIds.add(debt.debtorId));
        overdueDebts.forEach(debt => allUserIds.add(debt.debtorId));
        if (biggestDebtor) allUserIds.add(biggestDebtor);
        
        // Fetch user details
        const userIds = Array.from(allUserIds);
        const users = userIds.length > 0 ? await userModel.findManyByIds(userIds) : [];
        const userMap = {};
        users.forEach(user => {
            userMap[user._id.toString()] = {
                name: user.name,
                email: user.email
            };
        });
        
        // Add user info to debts
        debtsIOwe.forEach(debt => {
            const userInfo = userMap[debt.creditorId];
            if (userInfo) {
                debt.creditorName = userInfo.name;
                debt.creditorEmail = userInfo.email;
            }
        });
        
        debtsOwedToMe.forEach(debt => {
            const userInfo = userMap[debt.debtorId];
            if (userInfo) {
                debt.debtorName = userInfo.name;
                debt.debtorEmail = userInfo.email;
            }
        });
        
        overdueDebts.forEach(debt => {
            const userInfo = userMap[debt.debtorId];
            if (userInfo) {
                debt.debtorName = userInfo.name;
                debt.debtorEmail = userInfo.email;
            }
        });
        
        return {
            // 1. Debts user owes
            debtsIOwe: {
                total: debtsIOwe.reduce((sum, debt) => sum + debt.amount, 0),
                count: debtsIOwe.length,
                items: debtsIOwe,
                upcomingDeadlines
            },
            
            // 2 & 3. Debts owed to user
            debtsOwedToMe: {
                total: debtsOwedToMe.reduce((sum, debt) => sum + debt.amount, 0),
                count: debtsOwedToMe.length,
                items: debtsOwedToMe,
                overdueDebts,
                biggestDebtor: biggestDebtor ? {
                    debtorId: biggestDebtor,
                    debtorName: userMap[biggestDebtor]?.name,
                    debtorEmail: userMap[biggestDebtor]?.email,
                    totalAmount: maxDebt
                } : null
            },
            
            // 4. Monthly expense statistics
            monthlyStats: {
                totalExpense: Math.round(monthlyExpense),
                billCount: monthlyBillCount,
                categoryBreakdown: Object.entries(categoryStats).map(([category, stats]) => ({
                    category,
                    totalAmount: Math.round(stats.totalAmount),
                    billCount: stats.billCount,
                    percentage: Math.round((stats.totalAmount / monthlyExpense) * 100)
                })).sort((a, b) => b.totalAmount - a.totalAmount)
            },
            
            // 5. Products used this month
            productsThisMonth: productsThisMonth
        };
    } catch (error) {
        console.error('Error in analysisByAssistant:', error);
        throw error;
    }
};

export const suggestPayers = async (userId) => {
    // gợi ý người trả tiền dựa trên lịch sử thanh toán, tìm những người đang nợ bạn nhiều tiền hoặc những người thường xuyên trả tiền
    try {
        const bills = await billModel.getBillsByUser(userId);
        
        const now = new Date();
        const userStats = {}; // Statistics for each user
        
        bills.forEach(bill => {
            const isPayer = bill.payerId?.toString() === userId;
            
            // Only analyze bills where current user is the payer
            if (isPayer) {
                bill.paymentStatus?.forEach(payment => {
                    const participantId = payment.userId?.toString();
                    
                    // Skip self
                    if (participantId === userId) return;
                    
                    // Initialize user stats if not exists
                    if (!userStats[participantId]) {
                        userStats[participantId] = {
                            userId: participantId,
                            totalBills: 0,
                            totalOwed: 0,
                            totalPaid: 0,
                            currentDebt: 0,
                            overdueDebt: 0,
                            paymentRate: 0, // Percentage of amount paid vs owed
                            avgPaymentTime: 0, // Average days to pay
                            paymentTimes: [],
                            isReliable: false,
                            lastPaymentDate: null,
                            billDetails: []
                        };
                    }
                    
                    const stats = userStats[participantId];
                    const amountOwed = payment.amountOwed || 0;
                    const amountPaid = payment.amountPaid || 0;
                    const remainingAmount = amountOwed - amountPaid;
                    
                    stats.totalBills++;
                    stats.totalOwed += amountOwed;
                    stats.totalPaid += amountPaid;
                    stats.currentDebt += remainingAmount;
                    
                    // Check if overdue
                    const paymentDeadline = new Date(bill.paymentDeadline);
                    if (remainingAmount > 0 && paymentDeadline < now) {
                        stats.overdueDebt += remainingAmount;
                    }
                    
                    // Calculate payment time if paid
                    if (amountPaid > 0 && payment.paidDate) {
                        const paidDate = new Date(payment.paidDate);
                        const creationDate = new Date(bill.creationDate);
                        const daysToPayment = Math.ceil((paidDate - creationDate) / (1000 * 60 * 60 * 24));
                        stats.paymentTimes.push(daysToPayment);
                        
                        // Update last payment date
                        if (!stats.lastPaymentDate || paidDate > stats.lastPaymentDate) {
                            stats.lastPaymentDate = paidDate;
                        }
                    }
                    
                    // Store bill details
                    stats.billDetails.push({
                        billId: bill._id.toString(),
                        billName: bill.billName,
                        amountOwed,
                        amountPaid,
                        remainingAmount,
                        deadline: paymentDeadline,
                        isOverdue: remainingAmount > 0 && paymentDeadline < now
                    });
                });
            }
        });
        
        // Calculate derived metrics for each user
        const userSuggestions = Object.values(userStats).map(stats => {
            // Payment rate: how much they've paid vs how much they owe
            stats.paymentRate = stats.totalOwed > 0 
                ? Math.round((stats.totalPaid / stats.totalOwed) * 100) 
                : 0;
            
            // Average payment time
            if (stats.paymentTimes.length > 0) {
                stats.avgPaymentTime = Math.round(
                    stats.paymentTimes.reduce((sum, time) => sum + time, 0) / stats.paymentTimes.length
                );
            }
            
            // Determine reliability
            // Reliable if: payment rate > 80%, avg payment time < 14 days, and no overdue debt
            stats.isReliable = stats.paymentRate >= 80 && 
                              stats.avgPaymentTime <= 14 && 
                              stats.overdueDebt === 0;
            
            // Calculate suggestion score
            // Higher score = better candidate for paying
            let score = 0;
            
            // 1. High current debt = should pay (weight: 40%)
            score += (stats.currentDebt / 1000) * 40;
            
            // 2. High payment rate = reliable payer (weight: 30%)
            score += (stats.paymentRate / 100) * 30;
            
            // 3. Fast payment history = quick payer (weight: 20%)
            const paymentSpeedScore = stats.avgPaymentTime > 0 
                ? Math.max(0, (30 - stats.avgPaymentTime) / 30) 
                : 0;
            score += paymentSpeedScore * 20;
            
            // 4. Recent activity = active user (weight: 10%)
            const daysSinceLastPayment = stats.lastPaymentDate 
                ? Math.ceil((now - stats.lastPaymentDate) / (1000 * 60 * 60 * 24))
                : 999;
            const recentActivityScore = daysSinceLastPayment < 30 ? 1 : 
                                       daysSinceLastPayment < 90 ? 0.5 : 0;
            score += recentActivityScore * 10;
            
            // Penalty for overdue debt
            if (stats.overdueDebt > 0) {
                score -= 20; // Deduct points for being overdue
            }
            
            stats.suggestionScore = Math.round(score);
            
            return stats;
        });
        
        // Sort by suggestion score (highest first)
        userSuggestions.sort((a, b) => b.suggestionScore - a.suggestionScore);
        
        // Get user details for all participants
        const participantIds = Object.keys(userStats);
        const participantUsers = participantIds.length > 0 ? await userModel.findManyByIds(participantIds) : [];
        const participantMap = {};
        participantUsers.forEach(user => {
            participantMap[user._id.toString()] = {
                name: user.name,
                email: user.email
            };
        });
        
        // Add user info to suggestions
        userSuggestions.forEach(suggestion => {
            const userInfo = participantMap[suggestion.userId];
            if (userInfo) {
                suggestion.userName = userInfo.name;
                suggestion.userEmail = userInfo.email;
            }
        });
        
        // Categorize suggestions
        const recommendations = {
            // Top candidates: high score, reliable
            topCandidates: userSuggestions.filter(u => u.suggestionScore >= 50 && u.isReliable).slice(0, 3),
            
            // People who owe money: high current debt
            peopleWhoOwe: userSuggestions.filter(u => u.currentDebt > 0).slice(0, 5),
            
            // Reliable payers: good payment history
            reliablePayers: userSuggestions.filter(u => u.isReliable).slice(0, 5),
            
            // People with overdue debts: should pay back first
            overdueDebtors: userSuggestions.filter(u => u.overdueDebt > 0)
                .sort((a, b) => b.overdueDebt - a.overdueDebt)
                .slice(0, 5),
            
            // All users sorted by score
            allUsers: userSuggestions
        };
        
        return {
            suggestions: recommendations,
            summary: {
                totalParticipants: userSuggestions.length,
                totalDebtOwed: userSuggestions.reduce((sum, u) => sum + u.currentDebt, 0),
                totalOverdue: userSuggestions.reduce((sum, u) => sum + u.overdueDebt, 0),
                reliableCount: userSuggestions.filter(u => u.isReliable).length
            }
        };
    } catch (error) {
        console.error('Error in suggestPayers:', error);
        throw error;
    }
}


