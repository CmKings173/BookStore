/* eslint-disable no-unused-vars */
import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { pagingSkipValue } from '~/utils/algorithms'
import { categoryModel } from '~/models/categoryModel'
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
  inStock: Joi.boolean().required().default((parent) => parent.stock > 0),
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

// Tạo mới book
const createNew = async (data) => {
  try {
    // Validate data một lần nữa trước khi tạo book
    const validData = await validateBeforeCreate(data)
    validData.categoryId = new ObjectId(validData.categoryId)
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
const getAllBooks = async (page, itemsPerPage, filterCategoryId = null, searchTerm = '') => {
  try {
    // Tạo stage $match động
    const matchStage = { _destroy: false }

    if (filterCategoryId) {
      // Chuyển đổi categoryId thành ObjectId
      matchStage.categoryId = new ObjectId(filterCategoryId)
    }

    // Thêm điều kiện tìm kiếm nếu có searchTerm
    if (searchTerm) {
      matchStage.$or = [
        { title: { $regex: searchTerm, $options: 'i' } }, // Tìm kiếm không phân biệt hoa thường
        { author: { $regex: searchTerm, $options: 'i' } }
      ]
    }

    // Tách riêng pipeline để đếm tổng số sách
    const countPipeline = [
      { $match: matchStage }
    ]

    // Pipeline chính để lấy dữ liệu sách
    const dataPipeline = [
      { $match: matchStage },
      // Chuyển categoryId từ string sang ObjectId để lookup hoạt động
      {
        $addFields: {
          categoryIdObject: { $toObjectId: '$categoryId' }
        }
      },
      {
        $lookup: {
          from: categoryModel.CATEGORY_COLLECTION_NAME,
          localField: 'categoryIdObject',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          _id: 1,
          title: 1,
          slug: 1,
          author: 1,
          subtitle: 1,
          publisher: 1,
          publishYear: 1,
          pages: 1,
          format: 1,
          dimensions: 1,
          description: 1,
          weight: 1,
          price: 1,
          stock: 1,
          image: 1,
          inStock: 1,
          createdAt: 1,
          updatedAt: 1,
          categoryId: 1,
          'category._id': 1,
          'category.name': 1
        }
      },
      { $sort: { title: 1 } },
      { $skip: pagingSkipValue(page, itemsPerPage) },
      { $limit: itemsPerPage }
    ]

    // Thực hiện song song cả hai pipeline
    const [totalCount, books] = await Promise.all([
      GET_DB().collection(BOOK_COLLECTION_NAME).countDocuments(matchStage),
      GET_DB().collection(BOOK_COLLECTION_NAME).aggregate(dataPipeline).toArray()
    ])

    // // Log để debug
    // console.log('Query Result:', {
    //   totalBooks: totalCount,
    //   booksCount: books.length,
    //   firstBook: books[0],
    //   categoryId: books[0]?.categoryId,
    //   searchTerm: searchTerm
    // })

    return {
      books: books || [],
      totalBooks: totalCount
    }
  } catch (error) {
    // console.error('Error in getAllBooks:', error)
    throw new Error(error)
  }
}


const updateBook = async (bookId, updateData) => {
  try {
    // Lọc ra các field không được update
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })
    // Convert từ string sang ObjectId
    if (updateData.categoryId) {
      updateData.categoryId = new ObjectId(updateData.categoryId)
    }

    const result = await GET_DB()
      .collection(BOOK_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(bookId) },
        { $set: updateData },
        { returnDocument: 'after', upsert: false }
      )
      // console.log('result: ',result)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

// Tìm kiếm sách theo từ khóa
const searchBooks = async (searchTerm, page, itemsPerPage, filterCategoryId = null) => {
  try {
    // Tạo stage $match động
    const matchStage = { _destroy: false }

    // Thêm điều kiện tìm kiếm
    if (searchTerm) {
      matchStage.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { author: { $regex: searchTerm, $options: 'i' } },
        { publisher: { $regex: searchTerm, $options: 'i' } }
      ]
    }

    // Thêm điều kiện lọc theo category nếu có
    if (filterCategoryId) {
      matchStage.categoryId = new ObjectId(filterCategoryId)
    }

    // Pipeline chính để lấy dữ liệu sách
    const dataPipeline = [
      { $match: matchStage },
      {
        $addFields: {
          categoryIdObject: { $toObjectId: '$categoryId' }
        }
      },
      {
        $lookup: {
          from: categoryModel.CATEGORY_COLLECTION_NAME,
          localField: 'categoryIdObject',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          _id: 1,
          title: 1,
          slug: 1,
          author: 1,
          subtitle: 1,
          publisher: 1,
          publishYear: 1,
          pages: 1,
          format: 1,
          dimensions: 1,
          description: 1,
          weight: 1,
          price: 1,
          stock: 1,
          image: 1,
          inStock: 1,
          createdAt: 1,
          updatedAt: 1,
          categoryId: 1,
          'category._id': 1,
          'category.name': 1
        }
      },
      { $sort: { title: 1 } },
      { $skip: pagingSkipValue(page, itemsPerPage) },
      { $limit: itemsPerPage }
    ]

    // Thực hiện song song cả đếm và lấy dữ liệu
    const [totalCount, books] = await Promise.all([
      GET_DB().collection(BOOK_COLLECTION_NAME).countDocuments(matchStage),
      GET_DB().collection(BOOK_COLLECTION_NAME).aggregate(dataPipeline).toArray()
    ])

    // Log để debug
    console.log('Search Result:', {
      searchTerm,
      totalBooks: totalCount,
      booksCount: books.length,
      firstBook: books[0]
    })

    return {
      books: books || [],
      totalBooks: totalCount
    }
  } catch (error) {
    console.error('Error in searchBooks:', error)
    throw error
  }
}

export const bookModel = {
  BOOK_COLLECTION_NAME,
  BOOK_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  deleteBook,
  getAllBooks,
  updateBook,
  searchBooks
}