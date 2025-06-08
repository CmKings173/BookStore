import Joi from 'joi'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { pagingSkipValue } from '~/utils/algorithms'

const USER_ROLE = {
  CLIENT: 'client',
  ADMIN: 'admin'
}

// Define Collection (name & schema)
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required(),
  // username cắt ra từ email sẽ có khả năng không unique bởi vì sẽ có những tên email trùng nhau từ những nhà cung cấp khác nhau
  username: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  avatar: Joi.string().default(null),
  role: Joi.string().valid(USER_ROLE.CLIENT, USER_ROLE.ADMIN).default(USER_ROLE.CLIENT),

  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// Chỉ định những fields mà chúng ta không muốn cập nhập trong hàm update()
const INVALID_UPDATE_FIELDS = ['_id', 'email', 'username', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const createdUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
    return createdUser

  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) { throw new Error(error)
  }
}

const findOneByEmail = async (emailValue) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email: emailValue })
    return result
  } catch (error) { throw new Error(error)
  }
}

const update = async (userId, updateData) => {
  try {
    // Lọc ra các field không được update
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) { throw new Error(error) }
}

const getAllUsers = async (page, itemsPerPage) => {
  try {
    const query = await GET_DB().collection(USER_COLLECTION_NAME).aggregate([
      { $match: { _destroy: false } },
      { $sort: { username: 1 } },
      // $facet để xử lý nhiều luồng trong 1 query
      {
        $facet: {
          // Luồng thứ nhất : query boards
          queryUsers: [
            { $skip: pagingSkipValue(page, itemsPerPage) }, // Tính toán giá trị skip
            { $limit: itemsPerPage } // Giới hạn số lượng bản ghi trả về
          ],
          // Luồng thứ hai : query đếm tổng số lượng bản ghi books trong db và trả về vào biến countedALLBooks
          queryTotalUsers: [{ $count: 'countedAllUsers' }]
        }
      }
    ],
    // Khai báo thêm thuộc tính collation locale 'en' để fix chữ B hoa và a thường
    { collation: { locale: 'en' } }).toArray()

    // console.log('query: ', query)
    const res = query[0]

    return {
      users: res.queryUsers || [],
      totalUsers: res.queryTotalUsers[0]?.countedAllUsers || 0
    }

  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (userId) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).deleteOne({ _id: new ObjectId(userId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findOneByEmail,
  update,
  getAllUsers,
  deleteOneById
}