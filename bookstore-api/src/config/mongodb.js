import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

// Khởi tạo một đối tượng bookStoreDatabaseInstance ban đầu là null (vì chúng ta chưa connect)
let bookStoreDatabaseInstance = null

// Khởi tạo một đối tượng MongoClientInstance để connect tới MongoDB
const MongoClientInstance = new MongoClient(env.MONGODB_URI, {
  // Lưu ý: cái serverApi có từ phiên bản MongoDB 5.0.0 trở lên , có thể không cần dùng nó , còn nếu dùng nó là chúng ta sẽ chỉ định một cái Stable API Version của MongoDB

  // serverApi: {
  //   version: ServerApiVersion.v1,
  //   strict: true,
  //   deprecationErrors: true
  // }
})

// Kết nối tới DatabaseDatabase
export const CONNECT_DB = async () => {
  // Gọi kết nối tới MongoDB Atlas với URI được khai báo trong thân của MongoClientInstance
  await MongoClientInstance.connect()
  // Kết nối thành công thì lấy ra Database thep tên và gán ngược nó lại vào biến trelloDatabaseInstance ở trên của chúng tata
  bookStoreDatabaseInstance = MongoClientInstance.db(env.DATABASE_NAME)
}


// Function GET_DB (không async) này có nhiệm vụ export ra cái trello database instance sau khi đã connect thành công tới MongoDB để chúng ta sử dụng ở nhiều nơi khác nhau trong code
// Lưu ý phải đảm bảo chỉ luôn gọi cái GET_DB này sau khi đã kết nối thành công tới MongoDB
export const GET_DB = () => {
  if (!bookStoreDatabaseInstance) throw new Error(' Must connect to database first')
  return bookStoreDatabaseInstance
}
// Đóng kết nối tới db khi cần
export const CLOSE_DB = async () => {
  await bookStoreDatabaseInstance.close()
}