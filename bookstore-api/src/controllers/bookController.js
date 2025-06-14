import { StatusCodes } from 'http-status-codes'
import { bookService } from '~/services/bookService'

const createNew = async (req, res, next) => {
  try {
    // console.log('req.body: ', req.body)
    // Điều hướng dữ liệu sang tầng Service
    const createdBook = await bookService.createNew(req.body)
    // throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'test error')
    // Có kết quả thì trả về phía client
    res.status(StatusCodes.CREATED).json(createdBook)

  } catch (error) {next(error)}
}

const getDetails = async (req, res, next) => {
  try {
    // console.log('req.params: ', req.params )
    const bookId = req.params.id
    // Điều hướng dữ liệu sang tầng Service
    const Book = await bookService.getDetails(bookId)
    // Có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(Book)

  } catch (error) {next(error)}
}

const deleteBook = async (req, res, next) => {
  try {
    const bookId = req.params.id
    // Điều hướng dữ liệu sang tầng Service
    const result = await bookService.deleteBook(bookId)
    // Có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(result)

  } catch (error) {next(error)}
}

const getAllBooks = async (req, res, next) => {
  try {
    const { page, itemsPerPage, categoryId, search } = req.query
    const result = await bookService.getAllBooks(
      parseInt(page, 10),
      parseInt(itemsPerPage, 10),
      categoryId,
      search
    )
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const updateBook = async (req, res, next) => {

  try {
    // console.log('req.params: ', req.params )
    const bookId = req.params.id
    // Điều hướng dữ liệu sang tầng Service
    const updatedBook = await bookService.updateBook( bookId, req.body)

    // Có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(updatedBook)

  } catch (error) {next(error)}
}

const searchBooks = async (req, res, next) => {
  try {
    const { page, itemsPerPage, categoryId, search } = req.query
    const result = await bookService.searchBooks(
      search,
      parseInt(page, 10),
      parseInt(itemsPerPage, 10),
      categoryId
    )
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getRelatedBooks = async (req, res, next) => {
  try {
    const { categoryId, currentBookId, limit } = req.query
    const result = await bookService.getRelatedBooks(
      categoryId,
      currentBookId,
      parseInt(limit, 10) || 4
    )
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const bookController = {
  createNew,
  getDetails,
  deleteBook,
  getAllBooks,
  updateBook,
  searchBooks,
  getRelatedBooks
}