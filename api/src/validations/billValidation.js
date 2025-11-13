import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/APIError.js';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    // Define the validation schema for a bill
    billName: Joi.string().min(1).max(200).required(),
    description: Joi.string().max(500).allow('').optional(),
    category: Joi.string().max(100).allow('').optional(),
    creatorId: Joi.string().required(),
    payerId: Joi.string().required(),
    totalAmount: Joi.number().min(0).required(),
    paymentDate: Joi.date().optional(),
    splittingMethod: Joi.string().valid('equal', 'item-based', 'people-based'),
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
          amountPaid: Joi.number().optional(),
          paidDate: Joi.date().optional(),
        })
      )
      .optional(),
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

const SUPPORTED_FORMATS = ['image/bmp', 'image/png', 'image/jpeg', 'image/webp'];
const MAX_SIZE = 20 * 1024 * 1024; 
const MIN_SIZE = 0; 
const MAX_LONG_SIDE = 2240;
const MIN_SHORT_SIDE = 4;
const MAX_RATIO = 5; 

const scan = async (req, res, next) => {
  const correctCondition = Joi.object({
    userId: Joi.string().required(),

    imageData: Joi.string()
      .required()
      .custom(async (value, helpers) => {
        if (!/^data:image\/(bmp|png|jpg|jpeg|webp);base64,/.test(value)) {
          return helpers.error('any.invalid', {
            message: 'Unsupported image format. Allowed formats: BMP, PNG, JPG, JPEG, WEBP.',
          });
        }

        const base64Data = value.split(',')[1];
        if (!base64Data) {
          return helpers.error('any.invalid', { message: 'Missing base64 image data.' });
        }

        const buffer = Buffer.from(base64Data, 'base64');

        //Check file size
        const size = buffer.length;
        if (size < MIN_SIZE || size > MAX_SIZE) {
          return helpers.error('any.invalid', { message: 'Image size must be between 0 and 20 MB.' });
        }

        //Verify actual MIME type
        const fileType = await fileTypeFromBuffer(buffer);
        if (!fileType || !SUPPORTED_FORMATS.includes(fileType.mime)) {
          return helpers.error('any.invalid', {
            message: 'File type not supported. Allowed formats: BMP, PNG, JPG, JPEG, WEBP.',
          });
        }

        //Get image dimensions
        const { width, height } = await sharp(buffer).metadata();
        if (!width || !height) {
          return helpers.error('any.invalid', { message: 'Unable to read image dimensions.' });
        }

        //Check long/short side limits
        const longSide = Math.max(width, height);
        const shortSide = Math.min(width, height);
        if (longSide > MAX_LONG_SIDE) {
          return helpers.error('any.invalid', { message: `The longer side must not exceed ${MAX_LONG_SIDE}px.` });
        }
        if (shortSide < MIN_SHORT_SIDE) {
          return helpers.error('any.invalid', { message: `The shorter side must be at least ${MIN_SHORT_SIDE}px.` });
        }

        //Check aspect ratio
        const ratio = longSide / shortSide;
        if (ratio > MAX_RATIO) {
          return helpers.error('any.invalid', { message: 'Image aspect ratio must not exceed 5:1.' });
        }

        return value;
      }),
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
  scan,
};
