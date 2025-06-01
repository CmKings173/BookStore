import { StatusCodes } from 'http-status-codes'
import { bookService } from '~/services/bookService'

const createNew = async (req, res, next) => {


  try {
    // console.log('req.body: ', req.body)
    const userId = req.jwtDecoded._id
    // Điều hướng dữ liệu sang tầng Service
    const createdBoard = await bookService.createNew(userId, req.body)
    // throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'test error')
    // Có kết quả thì trả về phía client
    res.status(StatusCodes.CREATED).json(createdBoard)

  } catch (error) {next(error)}
}

const getDetails = async (req, res, next) => {


  try {
    // console.log('req.params: ', req.params )
    const boardId = req.params.id
    const userId = req.jwtDecoded._id


    // Điều hướng dữ liệu sang tầng Service
    const Board = await bookService.getDetails(userId, boardId)

    // Có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(Board)

  } catch (error) {next(error)}
}

const update = async (req, res, next) => {


  try {
    // console.log('req.params: ', req.params )
    const boardId = req.params.id

    // Điều hướng dữ liệu sang tầng Service
    const updatedBoard = await bookService.update(boardId, req.body)

    // Có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(updatedBoard)

  } catch (error) {next(error)}
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await bookService.moveCardToDifferentColumn(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {next(error)}
}

const getBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    // Page và itemPerPage được truyển vào trong query url từ phía FE nên BE sẽ lấy thông qua req.query
    const { page, itemsPerPage } = req.query
    const result = await bookService.getBoards(userId, page, itemsPerPage)

    res.status(StatusCodes.OK).json(result)

  } catch (error) {next(error)}
}
export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getBoards
}