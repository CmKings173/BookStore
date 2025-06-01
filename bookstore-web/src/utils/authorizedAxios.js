import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

/*
* Không thể import { store } from '~/redux/store' theo cách thông thường ở đây
* Giải pháp: Inject store — là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component như file authorizeAxios hiện tại.
* Hiểu đơn giản: khi ứng dụng bắt đầu chạy lên, code sẽ chạy vào main.jsx đầu tiên, từ bên đó chúng ta gọi
* hàm injectStore ngay lập tức để gán biến mainStore vào biến axiosReduxStore cục bộ trong file này.
* https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
*/

let axiosReduxStore
export const injectStore = mainStore => { axiosReduxStore = mainStore }

// Khởi tạo axios instance mục đích để custom và cấu hình chung cho dự án
let authorizedAxiosInstance = axios.create()
// Thời gian chờ tối đa của 1 request : 10p
authorizedAxiosInstance.defaults.timeout = 1000 * 10 * 60
// withCredentials: sẽ cho phép axios tự động đính kèm và gửi cookie trong mỗi request lên BE 
// ( phục vụ trường hợp sử dụng JWT tokens (refresh và access) theo cơ chế httpOnly Cookie)
authorizedAxiosInstance.defaults.withCredentials = true


// Interceptor request : can thiệp vào giữa những cái request API
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Kỹ thuật chặn spam click
  interceptorLoadingElements(true)

  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// Khởi tạo một cái promise cho việc gọi API refresh_token
// Mục đích tạo Promise này để khi nào gọi API refresh_token xong xuôi thì mới retry lại nhiều API bị lỗi trước đó.
// Tham khảo: https://www.thedutchlab.com/en/insights/using-axios-interceptors-for-refreshing-your-api-token

let refreshTokenPromise = null
// Interceptor response: can thiệp vào giữa những cái response nhận về từ API
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Kỹ thuật chặn spam click
  interceptorLoadingElements(false)
  return response
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  // Kỹ thuật chặn spam click
  interceptorLoadingElements(false)

  // TH1: nhận mã 401 từ BE, thì gọi API logout luôn
  if ( error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }
  // TH2: Nếu nhận mã 410 từ BE, thì gọi API refreshtoken để làm mới lại accessToken
  // Lấy các request API bị lỗi thông qua error.config
  const originalRequests = error.config
  if ( error.response?.status === 410 && originalRequests) {

    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI() // dùng cookie thì không cần truyền tham số
        .then(data => {
          // Đồng thời accessToken đã nằm trong htppOnly Cookie (Xử lí phía BE)
          // console.log(data)
          return data?.accessToken
        })
        .catch((_err) => {
          // Nếu nhận bất kỳ lỗi nào từ api refresh token thì cứ logout luôn
          axiosReduxStore.dispatch(logoutUserAPI(false))
          return Promise.reject(_err)
        })
        .finally(() => {
          refreshTokenPromise = null
        })
    }
    // Cuối cùng mới return cái refreshTokenPromise trong trường hợp success ở đây
    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then((accessToken) => {
      /**
       * Bước 1: Đối với trường hợp nếu dự án cần lưu accessToken vào localStorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây.
       * Ví dụ: axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
       * → Hiện tại ở đây không cần bước 1 này vì chúng ta đã đưa accessToken vào cookie
       *    (xử lý từ phía BE) sau khi API refreshToken được gọi thành công.
       */

      // Bước 2: Bước quan trọng: Return lại axios instance của chúng ta kết hợp các originalRequests
      // để gọi lại những API ban đầu bị lỗi.

      return authorizedAxiosInstance(originalRequests)
    })
  }

  // Xử lí lỗi tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (CLEAN CODE)
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response.data.message
  }

  if (error.response?.data?.statusCode !== 410) {
    toast.error(errorMessage, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    })


  }
  return Promise.reject(error)
})

export default authorizedAxiosInstance