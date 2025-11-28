import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService.js'
import ms from 'ms'
import { env } from '~/config/environment'

const createNew = async (req, res, next) => {
  try {
    const createdUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}

const verifyAccount = async (req, res, next) => {
  try {
    const result = await userService.verifyAccount(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body)
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms(env.ACCESS_JWT_EXPIRES_IN),
    })
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
    res.status(StatusCodes.OK).json({ loggedOut: true })
  } catch (error) {
    next(error)
  }
}

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAll()
    res.status(StatusCodes.OK).json(users)
  } catch (error) {
    next(error)
  }
}

const fetchUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ''

    const result = await userService.fetchUsers(page, limit, search)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const user = await userService.findOneById(userId)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const getUserByEmail = async (req, res, next) => {
  try {
    const email = req.params.email
    const user = await userService.findOneByEmail(email)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const editProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const profileData = req.body
    const profile = await userService.editProfile(userId, profileData)
    res.status(StatusCodes.OK).json(profile)
  } catch (error) {
    next(error)
  }
}

const createGuestUser = async (req, res, next) => {
  try {
    const result = await userService.createGuestUser(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const updatedUser = await userService.updateProfile(userId, req.body)
    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  createNew,
  verifyAccount,
  login,
  logout,
  getAllUsers,
  getUserById,
  getUserByEmail,
  fetchUsers,
  editProfile,
  createGuestUser,
  update,
}
