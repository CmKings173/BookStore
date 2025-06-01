/* eslint-disable no-useless-catch */

import { slugify } from '~/utils/formatter'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'

const createNew = async (userId, reqBody) => {
  try {
    // Xử lí dữ liệu từy đặc thù dự ánán
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    // Gọi tới tầng Model để xử lí lưu bản ghi newBoard vào Database
    const createdBoard = await boardModel.createNew(userId, newBoard)

    // Lấy bản ghi sau khi gọi  ( tùy mục đích dự án )
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    // Trả kết quả về controller ( luôn phải có return)
    return getNewBoard
  } catch (error) { throw new Error(error)}
}

const getDetails = async (userId, boardId) => {
  try {

    const board = await boardModel.getDetails(userId, boardId)
    // console.log(board)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }
    // B1: Deep Clone board ra một cái mới để xử lí, không ảnh hưởng tới board ban đầu
    // (Tùy mục đích về sau mà có cần clone deep hay không)
    const resBoard = cloneDeep(board)

    // B2: Đưa card về đúng column của nó
    resBoard.columns.forEach( column => {
      //Convert bằng hàm equals của mongodb
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))

      //Convert bằng hàm toString của javascript
      // column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })

    // B3: Xóa mảng cards khỏi board ban đầu
    delete resBoard.cards

    return resBoard
  } catch (error) { throw error }
}

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)

    return updatedBoard
  } catch (error) { throw new Error(error)}
}

const moveCardToDifferentColumn = async ( reqBody ) => {
  try {
    // Cập nhật mảng cardOrderIds của column ban đầu chứa nó ( xóa cái _id của card cần kéo)
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })
    // Cập nhật mảng cardOrderIds của column mới chứa nó ( thêm cái _id của card cần kéo)
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })
    // Cập nhật lại columnId của card đã kéo
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
      updatedAt: Date.now()
    })
    return { updateResult: 'Successfully!' }
  } catch (error) { throw new Error(error)}
}
// Get list board
const getBoards = async (userId, page, itemsPerPage) => {
  try {
    // Nếu không có giá trị page hoặc itemsPerPage được truyền từ FE, gán giá trị mặc định
    if (!page) page = DEFAULT_PAGE
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE

    const results = await boardModel.getBoards(userId, parseInt(page, 10), parseInt(itemsPerPage, 10))
    return results
  } catch (error) {throw error}
}
export const bookService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getBoards

}