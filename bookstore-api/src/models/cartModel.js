import Joi from 'joi'
// import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { bookModel } from '~/models/bookModel'

const CART_COLLECTION_NAME = 'carts'
const CART_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  items: Joi.array().items(
    Joi.object({
      bookId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null),
      quantity: Joi.number().min(0).default(null)
    })
  ).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']
const validateBeforeCreate = async (data) => {
  return await CART_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

// Tạo mới Cart
const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    if (validData.userId) {
      validData.userId = new ObjectId(validData.userId)
    }
    console.log(validData)
    const createdCart = await GET_DB().collection(CART_COLLECTION_NAME).insertOne(validData)
    return createdCart

    // // Ngắn gọn hơn
    // return await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(validData)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(CART_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByUserId = async (userId) => {
  try {
    const result = await GET_DB().collection(CART_COLLECTION_NAME).findOne({ userId: new ObjectId(userId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getCartByUserId = async (userId) => {
  try {
    const currentCart = await GET_DB().collection(CART_COLLECTION_NAME).findOne({ userId: new ObjectId(userId) })
    // console.log('currentCart: ', currentCart)
    if (!currentCart) {
      return null
    }

    const queryConditions = [
      { _id: currentCart._id },
      // { _destroy: false }
    ]

    const result = await GET_DB().collection(CART_COLLECTION_NAME).aggregate([
      { $match: { $and: queryConditions } },
      {
        $lookup: {
          from: bookModel.BOOK_COLLECTION_NAME,
          localField: 'items.bookId',
          foreignField: '_id',
          as: 'bookDetails'
        }
      },
      {
        $addFields: {
          items: {
            $map: {
              input: '$items',
              as: 'item',
              in: {
                $mergeObjects: [
                  '$$item',
                  {
                    $let: {
                      vars: {
                        bookDetail: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: '$bookDetails',
                                as: 'book',
                                cond: { $eq: ['$$book._id', '$$item.bookId'] }
                              }
                            },
                            0
                          ]
                        }
                      },
                      in: {
                        title: '$$bookDetail.title',
                        author: '$$bookDetail.author',
                        publisher: '$$bookDetail.publisher',
                        publishYear: '$$bookDetail.publishYear',
                        pages: '$$bookDetail.pages',
                        price: '$$bookDetail.price',
                        image: '$$bookDetail.image',
                        inStock: '$$bookDetail.inStock',
                        stock: '$$bookDetail.stock'
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          items: 1
        }
      }
    ]).toArray()
    // console.log('result: ', result)
    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (cartId) => {
  try {
    const result = await GET_DB().collection(CART_COLLECTION_NAME).deleteOne({ _id: new ObjectId(cartId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const addToCart = async (userId, bookId, quantity) => {
  try {
    const cart = await GET_DB().collection(CART_COLLECTION_NAME).findOne({ userId: new ObjectId(userId) })

    if (!cart) {
      throw new Error('Cart not found')
    }

    // Kiểm tra xem sách đã có trong giỏ hàng chưa
    const existingItemIndex = cart.items.findIndex(item => item.bookId.toString() === bookId.toString())

    if (existingItemIndex > -1) {
      // Nếu đã có, cập nhật số lượng
      cart.items[existingItemIndex].quantity += quantity
    } else {
      // Nếu chưa có, thêm mới
      cart.items.push({
        bookId: new ObjectId(bookId),
        quantity: quantity
      })
    }

    // Cập nhật giỏ hàng
    const result = await GET_DB().collection(CART_COLLECTION_NAME).updateOne(
      { _id: cart._id },
      {
        $set: {
          items: cart.items,
          updatedAt: new Date()
        }
      }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const removeFromCart = async (userId, bookId) => {
  try {
    const cart = await GET_DB().collection(CART_COLLECTION_NAME).findOne({ userId: new ObjectId(userId) })

    if (!cart) {
      throw new Error('Cart not found')
    }

    // Filter out the item to be removed
    const updatedItems = cart.items.filter(item => item.bookId.toString() !== bookId.toString())

    // Update the cart with the new items array
    const result = await GET_DB().collection(CART_COLLECTION_NAME).updateOne(
      { _id: cart._id },
      {
        $set: {
          items: updatedItems,
          updatedAt: new Date()
        }
      }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getTotalItems = async (userId) => {
  try {
    const currentCart = await GET_DB().collection(CART_COLLECTION_NAME).findOne({ userId: new ObjectId(userId) })
    // console.log(currentCart)
    if (!currentCart) {
      return 0
    }
    // Lọc các item không bị hủy và đếm số lượng
    const items = (currentCart.items.length === 0 ? 0 : currentCart.items.length)
    return items
  } catch (error) {
    throw new Error(error)
  }
}

export const cartModel = {
  CART_COLLECTION_NAME,
  CART_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  deleteOneById,
  getCartByUserId,
  findOneByUserId,
  addToCart,
  removeFromCart,
  getTotalItems
}