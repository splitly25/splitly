/* eslint-disable no-useless-catch */
import { billModel } from "~/models/rawModels/billModel";
import { userModel } from "~/models/index.js";

const createNew = async (reqBody) => {
  try {
    // Other logic if creation affects other collections is here
    const createdBill = await billModel.createNew(reqBody);
    const getNewBill = await billModel.findOneById(createdBill.insertedId);

    return getNewBill;
  } catch (error) {
    throw error;
  }
};

/**
 * Search bills by name for a user with pagination and formatted data
 * @param {string} userId - User ID to search bills for
 * @param {string} searchTerm - Search term for bill name
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Formatted bills with user info and pagination
 */
const searchBillsByUserWithPagination = async (userId, searchTerm, page = 1, limit = 10) => {
  try {
    // Get bills from model
    const { bills, pagination } = await billModel.searchBillsByUserWithPagination(
      userId,
      searchTerm,
      page,
      limit
    );

    // Collect all unique user IDs
    const userIdsToFetch = new Set();
    bills.forEach((bill) => {
      if (bill.payerId) {
        userIdsToFetch.add(bill.payerId.toString());
      }
      bill.participants.forEach((participantId) => {
        userIdsToFetch.add(participantId.toString());
      });
    });

    // Fetch all users at once
    let userMap = new Map();
    if (userIdsToFetch.size > 0) {
      const users = await userModel.findManyByIds(Array.from(userIdsToFetch));
      userMap = new Map(users.map((u) => [u._id.toString(), u]));
    }

    // Format bills with user information
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

      const userPaymentStatus = bill.paymentStatus.find(
        (status) => status.userId === userId
      );

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
        userAmountOwed: userPaymentStatus ? userPaymentStatus.amountOwed : 0,
        userPaidStatus: userPaymentStatus ? userPaymentStatus.isPaid : false,
        createdAt: bill.createdAt,
        updatedAt: bill.updatedAt,
      };
    });

    return {
      bills: formattedBills,
      pagination
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get bills by user with pagination and formatted data
 * @param {string} userId - User ID to get bills for
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Formatted bills with user info and pagination
 */
const getBillsByUserWithPagination = async (userId, page = 1, limit = 10) => {
  try {
    // Get bills from model
    const { bills, pagination } = await billModel.getBillsByUserWithPagination(
      userId,
      page,
      limit
    );

    // Collect all unique user IDs
    const userIdsToFetch = new Set();
    bills.forEach((bill) => {
      if (bill.payerId) {
        userIdsToFetch.add(bill.payerId.toString());
      }
      bill.participants.forEach((participantId) => {
        userIdsToFetch.add(participantId.toString());
      });
    });

    // Fetch all users at once
    let userMap = new Map();
    if (userIdsToFetch.size > 0) {
      const users = await userModel.findManyByIds(Array.from(userIdsToFetch));
      userMap = new Map(users.map((u) => [u._id.toString(), u]));
    }

    // Format bills with user information
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

      const userPaymentStatus = bill.paymentStatus.find(
        (status) => status.userId === userId
      );

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
        userAmountOwed: userPaymentStatus ? userPaymentStatus.amountOwed : 0,
        userPaidStatus: userPaymentStatus ? userPaymentStatus.isPaid : false,
        createdAt: bill.createdAt,
        updatedAt: bill.updatedAt,
      };
    });

    return {
      bills: formattedBills,
      pagination
    };
  } catch (error) {
    throw error;
  }
};

export const billService = {
  createNew,
  searchBillsByUserWithPagination,
  getBillsByUserWithPagination
};
