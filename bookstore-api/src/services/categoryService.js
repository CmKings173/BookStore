/* eslint-disable no-useless-catch */
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { boardModel } from '~/models/boardModel'
// import ApiError from '~/utils/ApiError'
// import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  try {
    // Xử lí dữ liệu từy đặc thù dự ánán
    const newColumn = {
      ...reqBody
    }
    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)
    // console.log(getNewColumn)
    //Xử lí cấu trúc data trước khi trả dữ liệu về
    if (getNewColumn) {
      getNewColumn.cards = []

      // Cập nhật lại mảng columnOrderIds trong collection boards
      await boardModel.pushColumnOrderIds(getNewColumn)
    }
    // Trả kết quả về controller
    return getNewColumn
  } catch (error) { throw new Error(error)}
}

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)

    return updatedColumn
  } catch (error) { throw new Error(error)}
}

const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)
    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
    }

    // Xóa column theo Id
    await columnModel.deleteOneById(targetColumn._id)
    // Xóa tất cả card thuộc column
    await cardModel.deleteManyByColumnId(targetColumn._id)
    // Xóa columnId trong collection boards
    await boardModel.pullColumnOrderIds(targetColumn)
    return { deleteMessage: 'Column and its Cards deleted successfully!' }
  } catch (error) { throw error }
}
export const columnService = {
  createNew,
  update,
  deleteItem
}