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
    imageData: Joi.string().required(),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });

    const { imageData } = req.body;

    // Check base64 format
    if (!/^data:image\/(bmp|png|jpg|jpeg|webp);base64,/.test(imageData)) {
      return next(
        new ApiError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          'Unsupported image format. Allowed formats: BMP, PNG, JPG, JPEG, WEBP.'
        )
      );
    }

    const base64Data = imageData.split(',')[1];
    if (!base64Data) {
      return next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Missing base64 image data.'));
    }

    const buffer = Buffer.from(base64Data, 'base64');

    // Check file size
    const size = buffer.length;
    if (size < MIN_SIZE || size > MAX_SIZE) {
      return next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Image size must be between 0 and 20 MB.'));
    }

    // Verify actual MIME type
    const fileType = await fileTypeFromBuffer(buffer);
    if (!fileType || !SUPPORTED_FORMATS.includes(fileType.mime)) {
      return next(
        new ApiError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          'File type not supported. Allowed formats: BMP, PNG, JPG, JPEG, WEBP.'
        )
      );
    }

    // Get image dimensions
    const { width, height } = await sharp(buffer).metadata();
    if (!width || !height) {
      return next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Unable to read image dimensions.'));
    }

    // Check long/short side limits
    const longSide = Math.max(width, height);
    const shortSide = Math.min(width, height);
    
    let processedBuffer = buffer;
    
    if (longSide > MAX_LONG_SIDE) {
      // Scale image to fit within MAX_LONG_SIDE while maintaining aspect ratio
      const scaleFactor = MAX_LONG_SIDE / longSide;
      const newWidth = Math.round(width * scaleFactor);
      const newHeight = Math.round(height * scaleFactor);
      
      processedBuffer = await sharp(buffer)
        .resize(newWidth, newHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .toBuffer();
      
      // Update the imageData in req.body with the resized image
      const mimeType = fileType.mime.split('/')[1];
      const base64Image = processedBuffer.toString('base64');
      req.body.imageData = `data:image/${mimeType};base64,${base64Image}`;
    }
    
    if (shortSide < MIN_SHORT_SIDE) {
      return next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, `The shorter side must be at least ${MIN_SHORT_SIDE}px.`)
      );
    }

    // Check aspect ratio
    const ratio = longSide / shortSide;
    if (ratio > MAX_RATIO) {
      return next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Image aspect ratio must not exceed 5:1.'));
    }

    next();
  } catch (error) {
    return next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
  }
};

export const billValidation = {
  createNew,
  scan,
};
