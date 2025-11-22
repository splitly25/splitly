import { StatusCodes } from 'http-status-codes'
import { groupService } from '~/services/groupService'

const createNew = async (req, res, next) => {
  try {
    const createdGroup = await groupService.createNew(req.jwtDecoded._id, req.body)
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

const fetchGroups = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ''

    const result = await groupService.fetchGroups(page, limit, search)
    res.status(StatusCodes.OK).json(result)
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

const deleteGroup = async (req, res, next) => {
  try {
    const groupId = req.params.id
    const userId = req.jwtDecoded._id
    await groupService.deleteGroup(groupId, userId)
    res.status(StatusCodes.NO_CONTENT).send()
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const groupId = req.params.id
    const userId = req.jwtDecoded._id
    const updatedGroup = await groupService.updateGroup(groupId, req.body, userId)
    res.status(StatusCodes.OK).json(updatedGroup)
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
  fetchGroups,
  update,
  deleteGroup,
}
