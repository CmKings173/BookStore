import { createContext, useContext, useState, useEffect } from 'react'
import { fetchCategoriesAPI } from '~/apis/index'

const CategoryContext = createContext()

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetchCategoriesAPI()
      if (Array.isArray(response)) {
        setCategories(response)
      } else {
        console.error('Invalid categories data:', response)
        setCategories([])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      setError(error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const value = {
    categories,
    loading,
    error,
    refetchCategories: fetchCategories
  }

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  )
}

export const useCategories = () => {
  const context = useContext(CategoryContext)
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider')
  }
  return context
} 