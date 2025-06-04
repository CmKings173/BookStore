/* eslint-disable no-unused-vars */
import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { pagingSkipValue } from '~/utils/algorithms'
import {categoryModel} from '~/models/categoryModel'
// Define collection (Name & Schema)
const BOOK_COLLECTION_NAME = 'books'
const BOOK_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  author: Joi.string().required().min(3).max(100).trim().strict(),
  subtitle: Joi.string().optional().max(255).trim().strict(),
  description: Joi.string().optional().min(3).max(5000).trim().strict(),
  price: Joi.number().required().min(0),
  categoryId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  stock: Joi.number().required().min(0),
  publisher: Joi.string().required().min(2).max(100).trim().strict(),
  publishYear: Joi.string().pattern(/^\d{4}$/).required(),
  pages: Joi.number().required().min(1),
  image:Joi.string().default(null),
  format: Joi.string().optional(),
  dimensions:Joi.string().optional().trim().strict(),
  weight:Joi.number().optional().min(1),
  inStock: Joi.boolean().required().default(false),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// Chỉ định field không được update
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

// const categoryId = categoryModel.findOneById('683dbf0b81f5b0715b0df7f5')
const validateBeforeCreate = async (data) => {
  return await BOOK_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

// Tạo mới board
const createNew = async (data) => {
  try {
    // Validate data một lần nữa trước khi tạo bảng
    const validData = await validateBeforeCreate(data)
    // const newBookToAdd = {
    //   ...validData,
    //   categoryId: new ObjectId('683dbf0b81f5b0715b0df7f5')
    // }

    // const createdBook = await GET_DB().collection(BOOK_COLLECTION_NAME).insertOne(validData)
    // return createdBook

    // // Ngắn gọn hơn
    return await GET_DB().collection(BOOK_COLLECTION_NAME).insertOne(validData)
  } catch (error) {
    throw new Error(error)
  }
}

// Tìm book thông qua Id
const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(BOOK_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Xóa book theo Id
const deleteBook = async (bookId) => {
  try {
    const result = await GET_DB().collection(BOOK_COLLECTION_NAME).deleteOne({ _id: new ObjectId(bookId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Lấy tất cả sách và tên category tương ứng
const getAllBooks = async (page, itemsPerPage) => {
  try {
    const query = await GET_DB().collection(BOOK_COLLECTION_NAME).aggregate([
      { $match: { _destroy: false } },
      // Chuyển đổi categoryId từ string sang ObjectId
      { $addFields: {
        categoryIdObject: { $toObjectId: '$categoryId' }
      } },
      { $lookup: {
        from: categoryModel.CATEGORY_COLLECTION_NAME,
        localField: 'categoryIdObject',
        foreignField: '_id',
        as: 'category'
      } },
      { $unwind: '$category' },
      { $project: {
        _id: 1,
        title: 1,
        slug: 1,
        author: 1,
        subtitle: 1,
        price: 1,
        stock: 1,
        image:1,
        inStock: 1,
        createdAt: 1,
        updatedAt: 1,
        'category._id': 1,
        'category.name': 1
      } },
      { $sort: { title: 1 } },
      // $facet để xử lý nhiều luồng trong 1 query
      {
        $facet: {
          // Luồng thứ nhất : query boards
          queryBooks: [
            { $skip: pagingSkipValue(page, itemsPerPage) }, // Tính toán giá trị skip
            { $limit: itemsPerPage } // Giới hạn số lượng bản ghi trả về
          ],
          // Luồng thứ hai : query đếm tổng số lượng bản ghi books trong db và trả về vào biến countedALLBooks
          queryTotalBooks: [{ $count: 'countedAllBooks' }]
        }
      }
    ],
    // Khai báo thêm thuộc tính collation locale 'en' để fix chữ B hoa và a thường
    { collation: { locale: 'en' } }).toArray()

    // console.log('query: ', query)
    const res = query[0]

    return {
      books: res.queryBooks || [],
      totalBooks: res.queryTotalBooks[0]?.countedAllBooks || 0
    }

  } catch (error) {
    console.error('Error in getAllBooks:', error)
    throw new Error(error)
  }
}

export const bookModel = {
  BOOK_COLLECTION_NAME,
  BOOK_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  deleteBook,
  getAllBooks
  // getDetails,
//   update,
}