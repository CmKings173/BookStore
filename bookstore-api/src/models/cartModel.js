import Joi from 'joi'
// import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const CART_COLLECTION_NAME = 'carts'
const CART_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  items: Joi.array().items(
    Joi.object({
      bookId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).default(null),
      quantity: Joi.number().min(0).default(null),
      price: Joi.number().min(0).default(null)
    })
  ).default([]),
  totalAmount: Joi.number().min(0).default(0),
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

const findOneByUserId = async (id) => {
  try {
    const result = await GET_DB().collection(CART_COLLECTION_NAME).findOne({ userId: new ObjectId(id) })
    return result
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


export const cartModel = {
  CART_COLLECTION_NAME,
  CART_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  deleteOneById,
  findOneByUserId
  // update,
}