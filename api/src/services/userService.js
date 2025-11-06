/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes';
import { userModel } from '~/models/rawModels/userModel';
import ApiError from '~/utils/APIError';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { pickUser } from '~/utils/formatters';
import { WEBSITE_DOMAIN } from '~/utils/constants';
import { BrevoEmailProvider } from '~/providers/BrevoEmailProvider';
import { JwtProvider } from '~/providers/JwtProvider';
import { env } from '~/config/environment';

const createNew = async (reqBody) => {
  try {
    const existingUser = await userModel.findOneByEmail(reqBody.email);
    if (existingUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already in use');
    }

    const nameFromEmail = reqBody.email.split('@')[0];
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 10),
      name: reqBody.name || nameFromEmail,
      verifyToken: uuidv4(),
    };

    const createdUser = await userModel.createNew(newUser);
    const getNewUser = await userModel.findOneById(createdUser.insertedId.toString());

    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`;
    const emailSubject = 'Please verify your email';
    const textContent = `Here is your verification link: ${verificationLink}\n\nThank you for registering!`;
    const htmlContent = `
      <h3>Here is your verification link:</h3>
      <h3><a href="${verificationLink}">${verificationLink}</a></h3>
      <h3>Thank you for registering!</h3>
    `;

    try {
      await BrevoEmailProvider.sendEmail(getNewUser.email, emailSubject, textContent, htmlContent);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError.message);
      // Continue execution - user is created successfully even if email fails
    }

    return pickUser(getNewUser);
  } catch (error) {
    throw error;
  }
};

const verifyAccount = async (reqBody) => {
  try {
    const email = reqBody.email.toLowerCase().trim();
    const token = reqBody.token.trim();

    const existingUser = await userModel.findOneByEmail(email);
    if (!existingUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found with this email');
    }

    if (existingUser.isVerified) {
      throw new ApiError(StatusCodes.CONFLICT, 'Account is already verified');
    }

    if (!existingUser.verifyToken) {
      throw new ApiError(StatusCodes.GONE, 'Verification token has already been used or expired');
    }

    if (existingUser.verifyToken !== token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid or incorrect verification token');
    }

    const updateData = {
      isVerified: true,
      verifyToken: null,
      updatedAt: Date.now(),
    };

    const updatedUser = await userModel.update(existingUser._id.toString(), updateData);
    return pickUser(updatedUser);
  } catch (error) {
    throw error;
  }
};

const login = async (reqBody) => {
  try {
    const existingUser = await userModel.findOneByEmail(reqBody.email);
    if (!existingUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    if (!existingUser.isVerified) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Account not verified. Please verify your email first');
    }

    if (existingUser._destroy) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Account has been deleted');
    }

    if (!bcryptjs.compareSync(reqBody.password, existingUser.password)) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials, your email or password is incorrect');
    }

    await userModel.update(existingUser._id.toString(), {
      lastActivityDate: Date.now(),
      updatedAt: Date.now()
    });

    const userInfo = {
      _id: existingUser._id,
      email: existingUser.email,
    };
    const accessToken = await JwtProvider.generateToken(userInfo, env.ACCESS_JWT_SECRET_KEY, env.ACCESS_JWT_EXPIRES_IN);

    return {
      accessToken,
      ...pickUser(existingUser),
    };
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
  verifyAccount,
  login,
};
