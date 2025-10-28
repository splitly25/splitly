/* eslint-disable no-useless-catch */

const createNew = async (reqBody) => {
  try {
    const newObject = {
      ...reqBody,
   
    }

    // Call model to create in DB


    // Other logic if creation affects other collections is here

    // return the created object, service always return something
    return newObject
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew
}