import { categoryModel } from '~/models/categoryModel'
import { slugify } from '~/utils/formatter'


const createNew = async (reqBody) => {
  try {
    // Xử lí dữ liệu từy đặc thù dự án
    const newCategory = {
      ...reqBody,
      slug: slugify(reqBody.name)
    }
    const createdCategory = await categoryModel.createNew(newCategory)
    // Trả kết quả về controller
    return createdCategory
  } catch (error) { throw new Error(error)}
}

const getCategories = async () => {
  try {
    const result = await categoryModel.getCategories()
    return result
  } catch (error) { throw new Error(error)}
}

const deleteCategory = async (id) => {
  try {
    const result = await categoryModel.deleteCategory(id)
    return result
  } catch (error) { throw new Error(error)}
}

export const categoryService = {
  createNew,
  getCategories,
  deleteCategory
}
