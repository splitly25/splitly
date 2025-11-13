/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel.js'
import { activityModel } from '~/models/activityModel.js'
import ApiError from '~/utils/APIError.js'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoEmailProvider } from '~/providers/BrevoEmailProvider'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'

/**
 * Create a new user with email verification
 * @param {Object} reqBody - User registration data
 * @param {Object} options - Additional options (ipAddress, userAgent)
 * @returns {Promise<Object>} Created user
 */
const createNew = async (reqBody, options = {}) => {
  try {
    const existingUser = await userModel.findOneByEmail(reqBody.email)
    if (existingUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already in use')
    }

    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 10),
      name: reqBody.name || nameFromEmail,
      verifyToken: uuidv4(),
    }

    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId.toString())

    // Log user creation activity
    try {
      await activityModel.logUserActivity(
        activityModel.ACTIVITY_TYPES.USER_CREATED,
        createdUser.insertedId.toString(),
        createdUser.insertedId.toString(),
        {
          userEmail: newUser.email,
          userName: newUser.name,
          ipAddress: options.ipAddress,
          userAgent: options.userAgent,
          description: `New user account created: ${newUser.email}`,
        }
      )
    } catch (activityError) {
      console.warn('Failed to log user creation activity:', activityError.message)
    }

    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const emailSubject = 'Please verify your email'
    const textContent = `Here is your verification link: ${verificationLink}\n\nThank you for registering!`
    const htmlContent = `
      <h3>Here is your verification link:</h3>
      <h3><a href="${verificationLink}">${verificationLink}</a></h3>
      <h3>Thank you for registering!</h3>
    `

    try {
      await BrevoEmailProvider.sendEmail(getNewUser.email, emailSubject, textContent, htmlContent)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError.message)
      // Continue execution - user is created successfully even if email fails
    }

    return pickUser(getNewUser)
  } catch (error) {
    throw error
  }
}

/**
 * Verify user account with token
 * @param {Object} reqBody - Verification data (email, token)
 * @returns {Promise<Object>} Verified user
 */
const verifyAccount = async (reqBody) => {
  try {
    const email = reqBody.email.toLowerCase().trim()
    const token = reqBody.token.trim()

    const existingUser = await userModel.findOneByEmail(email)
    if (!existingUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found with this email')
    }

    if (existingUser.isVerified) {
      throw new ApiError(StatusCodes.CONFLICT, 'Account is already verified')
    }

    if (!existingUser.verifyToken) {
      throw new ApiError(StatusCodes.GONE, 'Verification token has already been used or expired')
    }

    if (existingUser.verifyToken !== token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid or incorrect verification token')
    }

    const updateData = {
      isVerified: true,
      verifyToken: null,
      updatedAt: Date.now(),
    }

    const updatedUser = await userModel.update(existingUser._id.toString(), updateData)
    return pickUser(updatedUser)
  } catch (error) {
    throw error
  }
}

/**
 * User login with activity logging
 * @param {Object} reqBody - Login credentials (email, password)
 * @param {Object} loginDetails - Login metadata (ipAddress, userAgent)
 * @returns {Promise<Object>} Access token and user info
 */
const login = async (reqBody, loginDetails = {}) => {
  try {
    const existingUser = await userModel.findOneByEmail(reqBody.email)
    if (!existingUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    if (!existingUser.isVerified) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Account not verified. Please verify your email first')
    }

    if (existingUser._destroy) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Account has been deleted')
    }

    if (!bcryptjs.compareSync(reqBody.password, existingUser.password)) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials, your email or password is incorrect')
    }

    await userModel.update(existingUser._id.toString(), {
      lastActivityDate: Date.now(),
      updatedAt: Date.now(),
    })

    // Log login activity
    try {
      await activityModel.logUserActivity(
        activityModel.ACTIVITY_TYPES.USER_LOGIN,
        existingUser._id.toString(),
        existingUser._id.toString(),
        {
          userEmail: existingUser.email,
          userName: existingUser.name,
          ipAddress: loginDetails.ipAddress,
          userAgent: loginDetails.userAgent,
          description: `User logged in: ${existingUser.email}`,
        }
      )
    } catch (activityError) {
      console.warn('Failed to log user login activity:', activityError.message)
    }

    const userInfo = {
      _id: existingUser._id,
      email: existingUser.email,
    }
    const accessToken = await JwtProvider.generateToken(userInfo, env.ACCESS_JWT_SECRET_KEY, env.ACCESS_JWT_EXPIRES_IN)

    return {
      accessToken,
      ...pickUser(existingUser),
    }
  } catch (error) {
    throw error
  }
}

/**
 * User logout with activity logging
 * @param {string} userId - User ID
 * @param {Object} logoutDetails - Logout metadata (ipAddress, userAgent)
 * @returns {Promise<void>}
 */
const logout = async (userId, logoutDetails = {}) => {
  try {
    const user = await userModel.findOneById(userId)
    if (!user) return

    // Log logout activity
    try {
      await activityModel.logUserActivity(activityModel.ACTIVITY_TYPES.USER_LOGOUT, userId, userId, {
        userEmail: user.email,
        userName: user.name,
        ipAddress: logoutDetails.ipAddress,
        userAgent: logoutDetails.userAgent,
        description: `User logged out: ${user.email}`,
      })
    } catch (activityError) {
      console.warn('Failed to log user logout activity:', activityError.message)
    }
  } catch (error) {
    throw error
  }
}

/**
 * Get all users
 * @returns {Promise<Array>} Array of users
 */
const getAll = async () => {
  try {
    const users = await userModel.getAll()
    return users.map((user) => pickUser(user))
  } catch (error) {
    throw error
  }
}

const fetchUsers = async (page = 1, limit = 10, search = '') => {
  try {
    const result = await userModel.fetchUsers(page, limit, search)
    return {
      users: result.users.map((user) => pickUser(user)),
      pagination: result.pagination,
    }
  } catch (error) {
    throw error
  }
}

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User object
 */
const findOneById = async (userId) => {
  try {
    const user = await userModel.findOneById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    return pickUser(user)
  } catch (error) {
    throw error
  }
}

const findOneByEmail = async (email) => {
  try {
    const user = await userModel.findOneByEmail(email)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
    return pickUser(user)
  } catch (error) {
    throw error
  }
}

/**
 * Get multiple users by IDs
 * @param {Array<string>} userIds - Array of user IDs
 * @returns {Promise<Array>} Array of users
 */
const findManyByIds = async (userIds) => {
  try {
    return await userModel.findManyByIds(userIds)
  } catch (error) {
    throw error
  }
}

/**
 * Update user with activity logging
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @param {string} updatedBy - User ID who updates
 * @returns {Promise<Object>} Updated user
 */
const update = async (userId, updateData, updatedBy) => {
  try {
    // Get original user data for activity logging
    const originalUser = await userModel.findOneById(userId)

    const result = await userModel.update(userId, updateData)

    // Log activity if updatedBy is provided
    if (updatedBy && originalUser) {
      try {
        await activityModel.logUserActivity(activityModel.ACTIVITY_TYPES.USER_UPDATED, updatedBy, userId, {
          userEmail: originalUser.email,
          userName: originalUser.name,
          previousValue: {
            name: originalUser.name,
            phone: originalUser.phone,
            avatar: originalUser.avatar,
          },
          newValue: updateData,
          description: `Updated user profile: ${originalUser.email}`,
        })
      } catch (activityError) {
        console.warn('Failed to log user update activity:', activityError.message)
      }
    }

    return result
  } catch (error) {
    throw error
  }
}

/**
 * Delete user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Delete result
 */
const deleteOneById = async (userId) => {
  try {
    return await userModel.deleteOneById(userId)
  } catch (error) {
    throw error
  }
}

/**
 * Find user by email, or create if not exists
 * @param {string} email - User email
 * @param {Object} options - Options for logging and metadata
 * @returns {Promise<Object>} User object
 */
const findOrCreateUserByEmail = async (email, options = {}) => {
  try {
    const normalizedEmail = email.toLowerCase().trim()
    let user = await userModel.findOneByEmail(normalizedEmail)

    if (!user) {
      // Extract name from email (everything before '@')
      const name = normalizedEmail.split('@')[0]
      // Generate a random password for guest users
      const randomPassword = uuidv4()

      const newUserData = {
        email: normalizedEmail,
        name: name,
        password: randomPassword,
        isGuest: true,
        userType: userModel.USER_TYPE.GUEST,
      }

      const result = await createNew(newUserData, {
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
      })
      user = await userModel.findOneById(result._id)
    }

    return user
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew,
  verifyAccount,
  login,
  logout,
  getAll,
  findOneById,
  findOneByEmail,
  findManyByIds,
  update,
  deleteOneById,
  findOrCreateUserByEmail,
  fetchUsers,
}
