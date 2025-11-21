/**
 * History Controller
 * Provides bill history data with detailed information about payments, participants, and settlement status
 */

import { StatusCodes } from "http-status-codes";
import { userModel, billModel } from "~/models/index.js";
import { billService } from "~/services/billService.js";
import ApiError from "~/utils/APIError.js";

/**
 * Get history data for a specific user
 * Returns bills for the requested page with payment details, payer info, participants, and settlement status
 */
const getHistoryData = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page, limit, fromDate, toDate, payer, search, status } = req.query;

    console.log(req.query);

    const user = await userModel.findOneById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const { bills, pagination } =
      await billService.getBillsWithConditions(userId, fromDate, toDate, payer, search, status, pageNum, limitNum);

    const userIdsToFetch = new Set();

    bills.forEach((bill) => {
      if (bill.payerId) {
        userIdsToFetch.add(bill.payerId.toString());
      }
      bill.participants.forEach((participantId) => {
        userIdsToFetch.add(participantId.toString());
      });
    });

    let userMap = new Map();

    if (userIdsToFetch.size > 0) {
      const users = await userModel.findManyByIds(Array.from(userIdsToFetch));

      userMap = new Map(users.map((u) => [u._id.toString(), u]));
    }
    const formattedBills = bills.map((bill) => {
      const payerData = userMap.get(bill.payerId?.toString());
      const payer = payerData
        ? {
            id: payerData._id,
            name: payerData.name,
            email: payerData.email,
            avatar: payerData.avatar,
          }
        : {
            id: bill.payerId,
            name: "Unknown User",
            email: "",
            avatar: null,
          };
      const participants = bill.participants
        .map((participantId) => {
          const participantData = userMap.get(participantId?.toString());
          return participantData
            ? {
                id: participantData._id,
                name: participantData.name,
                email: participantData.email,
                avatar: participantData.avatar,
              }
            : null;
        })
        .filter((p) => p !== null);

      return {
        id: bill._id,
        paymentDate: bill.paymentDate,
        billName: bill.billName,
        description: bill.description,
        totalAmount: bill.totalAmount,
        payer: payer,
        participants: participants,
        settled: bill.isSettled,
        splittingMethod: bill.splittingMethod,
        paymentStatus: bill.paymentStatus,
        createdAt: bill.createdAt,
        updatedAt: bill.updatedAt,
      };
    });

    const historyData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      bills: formattedBills,
      pagination: pagination,
    };

    res.status(StatusCodes.OK).json(historyData);
  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed information for a single bill
 */
const getBillDetail = async (req, res, next) => {
  try {
    const { billId } = req.params;

    // Get bill
    const bill = await billModel.findOneById(billId);
    if (!bill) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Bill not found");
    }

    const userIdsToFetch = new Set();
    if (bill.payerId) userIdsToFetch.add(bill.payerId.toString());
    if (bill.creatorId) userIdsToFetch.add(bill.creatorId.toString());
    bill.participants.forEach((participantId) => {
      userIdsToFetch.add(participantId.toString());
    });

    const userMap = new Map();
    if (userIdsToFetch.size > 0) {
      const users = await userModel.findManyByIds(Array.from(userIdsToFetch));
      userMap = new Map(
        users.map((u) => {
          u._id.toString(), u;
        })
      );
    }

    const payerData = userMap.get(bill.payerId?.toString());
    const payer = payerData
      ? {
          id: payerData._id,
          name: payerData.name,
          email: payerData.email,
          avatar: payerData.avatar,
        }
      : null;

    const creatorData = userMap.get(bill.creatorId?.toString());
    const creator = creatorData
      ? {
          id: creatorData._id,
          name: creatorData.name,
          email: creatorData.email,
          avatar: creatorData.avatar,
        }
      : null;

    const participantsWithStatus = bill.participants
      .map((participantId) => {
        const participantData = userMap.get(participantId?.toString());
        if (!participantData) return null; // Bỏ qua nếu user không còn tồn tại

        // Tìm trạng thái thanh toán
        const paymentStatus = bill.paymentStatus.find(
          (status) => status.userId.equals(participantId)
        );

        return {
          id: participantData._id,
          name: participantData.name,
          email: participantData.email,
          avatar: participantData.avatar,
          amountOwed: paymentStatus ? paymentStatus.amountOwed : 0,
          isPaid: paymentStatus ? paymentStatus.isPaid : false,
          paidDate: paymentStatus ? paymentStatus.paidDate : null,
        };
      })
      .filter((p) => p !== null);

    const billDetail = {
      id: bill._id,
      billName: bill.billName,
      description: bill.description,
      totalAmount: bill.totalAmount,
      paymentDate: bill.paymentDate,
      splittingMethod: bill.splittingMethod,
      settled: bill.isSettled,
      payer: payer,
      creator: creator,
      participants: participantsWithStatus,
      items: bill.items || [],
      paymentStatus: bill.paymentStatus,
      createdAt: bill.createdAt,
      updatedAt: bill.updatedAt,
    };

    res.status(StatusCodes.OK).json(billDetail);
  } catch (error) {
    next(error);
  }
};

// const getBillBySearching = async (req, res, next) => {
//   try {
//     const { userId } = req.params;
//     const { search, page = 1, limit = 10 } = req.query;

//     const user = await userModel.findOneById(userId);
//     if (!user) {
//       throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
//     }

//     const pageNum = parseInt(page);
//     const limitNum = parseInt(limit);

//     const { bills: userBills, pagination } =
//       await billService.searchBillsByUserWithPagination(
//         userId,
//         search || '',
//         pageNum,
//         limitNum
//       );

//     const userIdsToFetch = new Set();
//     userBills.forEach((bill) => {
//       if (bill.payerId) {
//         userIdsToFetch.add(bill.payerId.toString());
//       }
//       bill.participants.forEach((participantId) => {
//         userIdsToFetch.add(participantId.toString());
//       });
//     });

//     let userMap = new Map();

//     if (userIdsToFetch.size > 0) {
//       const users = await userModel.findManyByIds(Array.from(userIdsToFetch));
//       userMap = new Map(users.map((u) => [u._id.toString(), u]));
//     }

//     const formattedBills = userBills.map((bill) => {
//       const payerData = userMap.get(bill.payerId?.toString());
//       const payer = payerData
//         ? {
//             id: payerData._id,
//             name: payerData.name,
//             email: payerData.email,
//             avatar: payerData.avatar,
//           }
//         : {
//             id: bill.payerId,
//             name: "Unknown User",
//             email: "",
//             avatar: null,
//           };
      
//       const participants = bill.participants
//         .map((participantId) => {
//           const participantData = userMap.get(participantId?.toString());
//           return participantData
//             ? {
//                 id: participantData._id,
//                 name: participantData.name,
//                 email: participantData.email,
//                 avatar: participantData.avatar,
//               }
//             : null;
//         })
//         .filter((p) => p !== null);

//       // Find the payment status for the user making the request
//       const userPaymentStatus = bill.paymentStatus.find(
//         (status) => status.userId.equals(userId)
//       );

//       return {
//         id: bill._id,
//         paymentDate: bill.paymentDate,
//         billName: bill.billName,
//         description: bill.description,
//         totalAmount: bill.totalAmount,
//         payer: payer,
//         participants: participants,
//         settled: bill.isSettled,
//         splittingMethod: bill.splittingMethod,
//         userAmountOwed: userPaymentStatus ? userPaymentStatus.amountOwed : 0,
//         userPaidStatus: userPaymentStatus ? userPaymentStatus.isPaid : false,
//         createdAt: bill.createdAt,
//         updatedAt: bill.updatedAt,
//       };
//     });
//     // 4. --- End Data Formatting ---

//     // 5. Construct final response
//     const searchResultData = {
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//       bills: formattedBills,
//       pagination: pagination,
//     };

//     res.status(StatusCodes.OK).json(searchResultData);
//   } catch (error) {
//     next(error);
//   }
// };

/**
 * Filter bills by date range and payer
 */
// const filterBillsByUser = async (req, res, next) => {
//   try {
//     const { userId } = req.params;
//     const { fromDate, toDate, payer, search, status, page = 1, limit = 10 } = req.query;

//     // 1. Validate user
//     const user = await userModel.findOneById(userId);
//     if (!user) {
//       throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
//     }

//     // 2. Parse pagination
//     const pageNum = parseInt(page);
//     const limitNum = parseInt(limit);

//     // 3. Call the filter function from billService with all parameters
//     const { bills: userBills, pagination } =
//       await billService.filterBillsByUser(
//         userId,
//         fromDate,
//         toDate,
//         payer,
//         search,
//         status,
//         pageNum,
//         limitNum
//       );

//     // 4. --- Begin Data Formatting (Same as other functions) ---
//     const userIdsToFetch = new Set();
//     userBills.forEach((bill) => {
//       if (bill.payerId) {
//         userIdsToFetch.add(bill.payerId.toString());
//       }
//       bill.participants.forEach((participantId) => {
//         userIdsToFetch.add(participantId.toString());
//       });
//     });

//     let userMap = new Map();

//     if (userIdsToFetch.size > 0) {
//       const users = await userModel.findManyByIds(Array.from(userIdsToFetch));
//       userMap = new Map(users.map((u) => [u._id.toString(), u]));
//     }

//     const formattedBills = userBills.map((bill) => {
//       const payerData = userMap.get(bill.payerId?.toString());
//       const payer = payerData
//         ? {
//             id: payerData._id,
//             name: payerData.name,
//             email: payerData.email,
//             avatar: payerData.avatar,
//           }
//         : {
//             id: bill.payerId,
//             name: "Unknown User",
//             email: "",
//             avatar: null,
//           };
      
//       const participants = bill.participants
//         .map((participantId) => {
//           const participantData = userMap.get(participantId?.toString());
//           return participantData
//             ? {
//                 id: participantData._id,
//                 name: participantData.name,
//                 email: participantData.email,
//                 avatar: participantData.avatar,
//               }
//             : null;
//         })
//         .filter((p) => p !== null);

//       // Find the payment status for the user making the request
//       const userPaymentStatus = bill.paymentStatus.find(
//         (status) => status.userId.equals(userId)
//       );

//       return {
//         id: bill._id,
//         paymentDate: bill.paymentDate,
//         billName: bill.billName,
//         description: bill.description,
//         totalAmount: bill.totalAmount,
//         payer: payer,
//         participants: participants,
//         settled: bill.isSettled,
//         splittingMethod: bill.splittingMethod,
//         userAmountOwed: userPaymentStatus ? userPaymentStatus.amountOwed : 0,
//         userPaidStatus: userPaymentStatus ? userPaymentStatus.isPaid : false,
//         createdAt: bill.createdAt,
//         updatedAt: bill.updatedAt,
//       };
//     });
//     // 4. --- End Data Formatting ---

//     // 5. Construct final response
//     const filterResultData = {
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//       bills: formattedBills,
//       pagination: pagination,
//       filters: {
//         fromDate: fromDate || null,
//         toDate: toDate || null,
//         payer: payer === 'true' || payer === true ? true : false,
//         search: search || null,
//         status: status || 'all',
//       }
//     };

//     res.status(StatusCodes.OK).json(filterResultData);
//   } catch (error) {
//     next(error);
//   }
// };

export const historyController = {
  getHistoryData,
  getBillDetail,
  // getBillBySearching,
  // filterBillsByUser
};
