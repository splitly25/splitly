// ONLY CODE ABOUT DATA STRUCTURE AND DATABASE INTERACTION
// PLEASE DO NOT ADD ANY LOGIC TO MY MODEL PLEASE
// WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING
// WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING
// WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING

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
      .findOne({ _id: ObjectId.createFromHexString(billId) });
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
      .findOneAndUpdate({ _id: ObjectId.createFromHexString(billId) }, { $set: updateData }, { returnDocument: 'after' });
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
};
