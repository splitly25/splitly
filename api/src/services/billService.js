/* eslint-disable no-useless-catch */
import { billModel } from "~/models/rawModels/billModel";

const createNew = async (reqBody) => {
  try {
    // Other logic if creation affects other collections is here
    const createdBill = await billModel.createNew(reqBody);
    const getNewBill = await billModel.findOneById(createdBill.insertedId);

    return getNewBill;
  } catch (error) {
    throw error;
  }
};

export const billService = {
  createNew,
};
