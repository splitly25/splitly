import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError.js';


// sample JSON for postman
/*
  {
    "billName": "Dinner Bill",
    "description": "Dinner at a restaurant",
    "creatorId": "user123",
    "payerId": "user456",
    "totalAmount": 150.75,
    "paymentDate": "2024-06-15",
    "splittingMethod": "equal",
    "participants": ["user123", "user456", "user789"],
    "items": [
      {
        "name": "Pizza",
        "amount": 50.25,    
        "allocatedTo": ["user123", "user456"]
      },
      {
        "name": "Pasta",
        "amount": 40.50,
        "allocatedTo": ["user456", "user789"]
      },
    ] ,
    "paymentStatus": [
      {
        "userId": "user123",
        "amountOwed": 50.25,
        "isPaid": false
      },  
      {
        "userId": "user456",
        "amountOwed": 60.75,
        "isPaid": false 
      },
      {
        "userId": "user789",
        "amountOwed": 39.75,
        "isPaid": false
      }
    ],
    "isSettled": false,
    "optedOutUsers": []
  }

*/

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    // Define the validation schema for a bill
    billName: Joi.string().min(1).max(200).required(),
    description: Joi.string().max(500).optional(),
    creatorId: Joi.string().required(),
    payerId: Joi.string().required(),
    totalAmount: Joi.number().min(0).required(),
    paymentDate: Joi.date().optional(),
    splittingMethod: Joi.string().valid('equal', 'item-based').optional(),
    participants: Joi.array().items(Joi.string()).optional(),
    items: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      amount: Joi.number().required(),
      allocatedTo: Joi.array().items(Joi.string()).optional()
    })).optional(),
    paymentStatus: Joi.array().items(Joi.object({
      userId: Joi.string().required(),
      amountOwed: Joi.number().required(),
      isPaid: Joi.boolean().required(),
      paidDate: Joi.date().optional()
    })).optional(),
    isSettled: Joi.boolean().optional(),
    optedOutUsers: Joi.array().items(Joi.string()).optional(),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};

export const billValidation = {
  createNew,
};
