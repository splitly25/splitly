import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/JwtProvider'
import ApiError from '~/utils/APIError'

const isAuthorized = async (req, res, next) => {
  const clientAccessToken = req.cookies?.accessToken

  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authorized, no access token provided'))
    return
  }
  try {
    const accessTokenDecoded = await JwtProvider.verifyToken(clientAccessToken, env.ACCESS_JWT_SECRET_KEY)
    req.jwtDecoded = accessTokenDecoded
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'You are not authorized, invalid access token'))
  }
}

export const authMiddleware = {
  isAuthorized,
}
