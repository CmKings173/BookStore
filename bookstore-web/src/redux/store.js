import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './user/userSlice'
import { cartReducer } from './cart/cartSlice'

// Config redux-persist
import { combineReducers } from 'redux' // Cài redux-toolkit là có
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' //default là localstorage

// Config persist
const rootPersistConfig = {
  key: 'root', // Key của persist do chúng ta chỉ định ( mặc định là root )
  storage: storage, // Biến storage ở trên - lưu vào localstorage
  whitelist: ['user', 'cart'] // Định nghĩa các slide dữ liệu ĐƯỢC PHÉP duy trì qua mỗi f5 trình duyệt
  // blacklist: ['user'] // Định nghĩa các slice KHÔNG ĐƯỢC PHÉP duy trì qua mỗi f5 trình duyệt 
}

// Combine các reducer
const reducers = combineReducers({
  user: userReducer,
  cart: cartReducer
})

// Thực hiện persist Reducer
const persistedReducers = persistReducer(rootPersistConfig, reducers )

export const store = configureStore({
  reducer: persistedReducers,
  // Fix warning error when implement redux-persist
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  // devTools: process.env.NODE_ENV !== 'production',
})