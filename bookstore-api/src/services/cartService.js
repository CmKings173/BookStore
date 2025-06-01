
import { cardModel } from '~/models/cardModel'
import {columnModel } from '~/models/columnModel'
const createNew = async (reqBody) => {
  try {
    // Xử lí dữ liệu từy đặc thù dự án
    const newCard = {
      ...reqBody
    }
    const createdCard = await cardModel.createNew(newCard)

    const getNewCard = await cardModel.findOneById(createdCard.insertedId)
    // console.log(getNewCard)
    if (getNewCard) {
      // Cập nhật lại mảng cardOrderIds trong collection columns
      await columnModel.pushCardOrderIds(getNewCard)

    }
    // Trả kết quả về controller
    return getNewCard
  } catch (error) { throw new Error(error)}
}

export const cardService = {
  createNew
}