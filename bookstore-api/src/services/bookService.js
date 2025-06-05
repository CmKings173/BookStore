/* eslint-disable no-useless-catch */

import { slugify } from '~/utils/formatter'
import { bookModel } from '~/models/bookModel'
import { categoryModel } from '~/models/categoryModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'

const createNew = async (reqBody) => {
  try {
    // Xử lí dữ liệu từy đặc thù dự án
    const newBook = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    console.log(newBook)
    // Gọi tới tầng Model để xử lí lưu bản ghi newBook vào Database
    const createdBook = await bookModel.createNew(newBook)

    // Lấy bản ghi sau khi gọi  ( tùy mục đích dự án )
    const getNewBook = await bookModel.findOneById(createdBook.insertedId)

    // Trả kết quả về controller ( luôn phải có return)
    return getNewBook
  } catch (error) { throw new Error(error)}
}

const getDetails = async (bookId) => {
  try {
    // Lấy thông tin sách
    const book = await bookModel.findOneById(bookId)
    if (!book) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Book not found!')
    }

    // Lấy thông tin category
    const category = await categoryModel.findOneById(book.categoryId)
    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found!')
    }

    // Kết hợp thông tin
    const result = {
      ...book,
      categoryName: category.name
    }

    return result
  } catch (error) { throw error }
}

const deleteBook = async (bookId) => {
  try {
    // Xóa book theo Id
    await bookModel.deleteBook(bookId)
    return { deleteMessage: 'Book deleted successfully!' }
  } catch (error) { throw error }
}


const getAllBooks = async (page, itemsPerPage) => {
  try {

    // Nếu không có giá trị page hoặc itemsPerPage được truyền từ FE, gán giá trị mặc định
    if (!page) page = DEFAULT_PAGE
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE

    const results = await bookModel.getAllBooks(parseInt(page, 10), parseInt(itemsPerPage, 10))

    return results
  } catch (error) { throw error }
}

const updateBook = async (bookId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBook = await bookModel.updateBook(bookId, updateData)

    return updatedBook
  } catch (error) { throw new Error(error)}
}

const bookService = {
  createNew,
  getDetails,
  deleteBook,
  getAllBooks,
  updateBook
  // moveCardToDifferentColumn,
  // getBoards

}

export { bookService }