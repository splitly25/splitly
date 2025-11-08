import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';

// Define Collection name and schema
const BILL_COLLECTION_NAME = 'bills';

const BILL_COLLECTION_SCHEMA = Joi.object({
  billName: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(500).optional(),
  creatorId: Joi.string().required(),
  payerId: Joi.string().required(),
  totalAmount: Joi.number().min(0).required(),
  paymentDate: Joi.date().optional(),
  splittingMethod: Joi.string().valid('equal', 'item-based').optional(),
  participants: Joi.array().items(Joi.string()).optional(),
  items: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        amount: Joi.number().required(),
        allocatedTo: Joi.array().items(Joi.string()).optional(),
      })
    )
    .optional(),
  paymentStatus: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string().required(),
        amountOwed: Joi.number().required(),
        isPaid: Joi.boolean().required(),
        paidDate: Joi.date().optional(),
      })
    )
    .optional(),
  isSettled: Joi.boolean().optional(),
  optedOutUsers: Joi.array().items(Joi.string()).optional(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});

// fields that cannot be updated
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt'];

const validateBeforeCreate = async (data) => {
  return await BILL_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const createdBill = await GET_DB().collection(BILL_COLLECTION_NAME).insertOne(validData);
    return createdBill;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (billId) => {
  try {
    return await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(billId) });
  } catch (error) {
    throw new Error(error);
  }
};

// NOT CHECKED YET
const update = async (billId, updateData) => {
  try {
    // Remove invalid fields from updateData
    Object.keys(updateData).forEach((key) => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete updateData[key];
      }
    });
    const result = await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(billId) }, { $set: updateData }, { returnDocument: 'after' });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAll = async () => {
  try {
    return await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .find({ _destroy: false })
      .sort({ createdAt: -1 })
      .toArray();
  } catch (error) {
    throw new Error(error);
  }
};

const getAllWithPagination = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const bills = await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .find({ _destroy: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    const total = await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .countDocuments({ _destroy: false });
    
    return {
      bills,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw new Error(error);
  }
};

const getBillsByUser = async (userId) => {
  try {
    return await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .find({
        participants: userId,
        _destroy: false
      })
      .sort({ createdAt: -1 })
      .toArray();
  } catch (error) {
    throw new Error(error);
  }
};

const getBillsByUserWithPagination = async (userId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const bills = await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .find({
        participants: userId,
        _destroy: false
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    const total = await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .countDocuments({
        participants: userId,
        _destroy: false
      });
    
    return {
      bills,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Search bills by user with pagination
 * Accepts a custom query object for flexible searching
 * @param {string} userId - User ID
 * @param {Object} customQuery - Custom MongoDB query filters (e.g., for billName, paymentDate)
 * @param {number} page - Page number (starts from 1)
 * @param {number} limit - Number of bills per page
 * @returns {Promise<{bills: Array, pagination: Object}>}
 */
const searchBillsByUserWithPagination = async (userId, customQuery = {}, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    
    // Build base query with user filter
    const query = {
      participants: userId,
      _destroy: false,
      ...customQuery
    };
    
    const bills = await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    const total = await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .countDocuments(query);
    
    return {
      bills,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw new Error(error);
  }
};

const getBillsByCreator = async (creatorId) => {
  try {
    return await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .find({
        creatorId: creatorId,
        _destroy: false
      })
      .sort({ createdAt: -1 })
      .toArray();
  } catch (error) {
    throw new Error(error);
  }
};

const markAsPaid = async (billId, userId) => {
  try {
    const result = await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(billId),
          'paymentStatus.userId': userId
        },
        {
          $set: {
            'paymentStatus.$.isPaid': true,
            'paymentStatus.$.paidDate': Date.now(),
            updatedAt: Date.now()
          }
        },
        { returnDocument: 'after' }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const optOutUser = async (billId, userId) => {
  try {
    const result = await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(billId) },
        {
          $addToSet: { optedOutUsers: userId },
          $pull: { participants: userId },
          $set: { updatedAt: Date.now() }
        },
        { returnDocument: 'after' }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOneById = async (billId) => {
  try {
    const result = await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(billId) },
        { $set: { _destroy: true, updatedAt: Date.now() } },
        { returnDocument: 'after' }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const billModel = {
  BILL_COLLECTION_NAME,
  BILL_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  getAll,
  getAllWithPagination,
  getBillsByUser,
  getBillsByUserWithPagination,
  searchBillsByUserWithPagination,
  getBillsByCreator,
  markAsPaid,
  optOutUser,
  deleteOneById,
};
