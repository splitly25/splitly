import { StatusCodes } from 'http-status-codes'
import { groupService } from '~/services/groupService'

const createNew = async (req, res, next) => {
  try {
    console.log('Creating new group - controller')
    //const userId = req.jwtDecoded._id
    console.log('Creating new group with data:', req.body)
    const createdGroup = await groupService.createNew(req.body, '69103dbc2b799125f830376e')
    res.status(StatusCodes.CREATED).json(createdGroup)
  } catch (error) {
    next(error)
  }
}

const getAllGroups = async (req, res, next) => {
  try {
    const groups = await groupService.getAll()
    res.status(StatusCodes.OK).json(groups)
  } catch (error) {
    next(error)
  }
}

const getGroupById = async (req, res, next) => {
  try {
    const groupId = req.params.groupId
    const group = await groupService.findOneById(groupId)
    res.status(StatusCodes.OK).json(group)
  } catch (error) {
    next(error)
  }
}

const getGroupAndMembers = async (req, res, next) => {
  try {
    const groupId = req.params.groupId
    const groupWithMembers = await groupService.getGroupAndMembers(groupId)
    res.status(StatusCodes.OK).json(groupWithMembers)
  } catch (error) {
    next(error)
  }
}

const getAllGroupAndMembers = async (req, res, next) => {
  try {
    const allGroupsWithMembers = await groupService.getAllGroupsAndMembers()
    res.status(StatusCodes.OK).json(allGroupsWithMembers)
  } catch (error) {
    next(error)
  }
}

const getGroupsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const groups = await groupService.getGroupsByUserId(userId)
    res.status(StatusCodes.OK).json(groups)
  } catch (error) {
    next(error)
  }
}

export const groupController = {
  createNew,
  getGroupById,
  getAllGroups,
  getGroupAndMembers,
  getAllGroupAndMembers,
  getGroupsByUserId,
}
