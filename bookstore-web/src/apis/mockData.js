export const mockBooks = [
  {
    _id: 'book01',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    price: 299000,
    subtitle: 'A handbook of agile software craftsmanship',
    description: 'Clean Code là một cuốn sách kinh điển giúp lập trình viên hiểu cách viết mã sạch, dễ bảo trì và hiệu quả hơn.',
    categoryId: 'cat001',
    stockQuantity: 12,
    publisher: 'Prentice Hall',
    publishYear: '2008',
    isbn: "9780132350884",
    weight: "650g",
    dimensions: "23.5 x 17.8 x 2.5 cm",
    pages: 464,
    image: 'https://bizweb.dktcdn.net/thumb/grande/100/180/408/products/clean-code.jpg?v=1649847195810',
    inStock: true,
    format: "Paperback",
    createdAt: new Date('2025-05-01T09:00:00Z'),
    updatedAt: new Date('2025-05-25T10:00:00Z')
  },
  {
    _id: 'book02',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas',
    price: 350000,
    subtitle: 'Your journey to mastery',
    description: 'Cuốn sách cung cấp những bài học thực tế và triết lý phát triển phần mềm từ góc nhìn của lập trình viên lão luyện.',
    categoryId: 'cat001',
    stockQuantity: 8,
    publisher: 'Addison-Wesley',
    publishYear: '1999',
    isbn: "9780132350884",
    weight: "650g",
    dimensions: "23.5 x 17.8 x 2.5 cm",
    pages: 352,
    image: 'https://edwardthienhoang.wordpress.com/wp-content/uploads/2021/09/pracmatic-programmer.jpg',
    inStock: true,
    format: "Paperback",
    createdAt: new Date('2025-05-01T09:00:00Z'),
    updatedAt: new Date('2025-05-25T10:00:00Z')
  },
  {
    _id: 'book03',
    title: 'JavaScript: The Good Parts',
    author: 'Douglas Crockford',
    price: 250000,
    subtitle: 'Unearthing the excellence in JavaScript',
    description: 'Một cuốn sách nhỏ gọn nhưng súc tích chỉ ra những phần tốt nhất của ngôn ngữ JavaScript mà mọi lập trình viên nên biết.',
    categoryId: 'cat001',
    stockQuantity: 15,
    publisher: 'O\'Reilly Media',
    publishYear: '2008',
    isbn: "9780132350884",
    weight: "650g",
    dimensions: "23.5 x 17.8 x 2.5 cm",
    pages: 176,
    image: 'https://m.media-amazon.com/images/I/41w+nN8Kg0L._SY445_SX342_.jpg',
    inStock: true,
    format: "Paperback",
    createdAt: new Date('2025-05-01T09:00:00Z'),
    updatedAt: new Date('2025-05-25T10:00:00Z')
  },
  {
    _id: 'book04',
    title: 'Design Patterns',
    author: 'Gang of Four',
    price: 400000,
    subtitle: 'Elements of reusable object-oriented software',
    description: 'Cuốn sách định nghĩa và mô tả 23 mẫu thiết kế phần mềm hướng đối tượng, nền tảng cho phát triển phần mềm hiện đại.',
    categoryId: 'cat001',
    stockQuantity: 0,
    publisher: 'Addison-Wesley',
    publishYear: '1994',
    isbn: "9780132350884",
    weight: "650g",
    dimensions: "23.5 x 17.8 x 2.5 cm",
    pages: 395,
    image: 'https://miro.medium.com/v2/resize:fit:720/format:webp/1*20_KDN4DXQP4SkANncW41Q.png',
    inStock: false,
    format: "Paperback",
    createdAt: new Date('2025-05-01T09:00:00Z'),
    updatedAt: new Date('2025-05-25T10:00:00Z')
  },
  {
    _id: 'book05',
    title: 'Dune',
    author: 'Frank Herbert',
    price: 180000,
    subtitle: 'A science fiction masterpiece',
    description: 'Dune là một kiệt tác khoa học viễn tưởng với cốt truyện đầy hấp dẫn, chính trị và tôn giáo được dệt thành một thế giới hư cấu phức tạp.',
    categoryId: 'cat002',
    stockQuantity: 10,
    publisher: 'Chilton Books',
    publishYear: '1965',
    isbn: "9780132350884",
    weight: "650g",
    dimensions: "23.5 x 17.8 x 2.5 cm",
    pages: 412,
    image: 'https://www.elleman.vn/wp-content/uploads/2021/11/16/206244/tieu-thuyet-Dune-elle-man-1.jpeg',
    inStock: true,
    format: "Paperback",
    createdAt: new Date('2025-05-01T09:00:00Z'),
    updatedAt: new Date('2025-05-25T10:00:00Z')
  },
  {
    _id: 'book06',
    title: '1984',
    author: 'George Orwell',
    price: 150000,
    subtitle: 'A dystopian social science fiction novel',
    description: '1984 mô tả một xã hội tương lai bị kiểm soát bởi chính quyền toàn trị, là lời cảnh tỉnh về quyền lực và tự do cá nhân.',
    categoryId: 'cat002',
    stockQuantity: 6,
    publisher: 'Secker & Warburg',
    publishYear: '1949',
    pages: 328,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcXrheLZws2gW8wnag2HMRf6f9oF2B2ii5A889vMgW3DTA8N8vxbF1NEBATQdW4_kxWtc&usqp=CAU',
    inStock: true,
    format: "Paperback",
    createdAt: new Date('2025-05-01T09:00:00Z'),
    updatedAt: new Date('2025-05-25T10:00:00Z')
  }
]


export const mockCategories = [
  {
    _id: 'cat001',
    name: 'Lập trình',
    slug: 'lap-trinh',
    count: 4
  },
  {
    _id: 'cat002',
    name: 'Tiểu thuyết',
    slug: 'tieu-thuyet',
    count: 2
  },
  {
    _id: 'cat003',
    name: 'Khoa học',
    slug: 'khoa-hoc',
    count: 0
  },
  {
    _id: 'cat004',
    name: 'Lịch sử',
    slug: 'lich-su',
    count: 0
  }
]


export const mockOrders = [
  {
    _id: 'order001',
    userId: 'user001',
    items: [
      {
        bookId: 'book001',
        quantity: 2,
        price: 150000
      },
      {
        bookId: 'book002',
        quantity: 1,
        price: 90000
      }
    ],
    totalPrice: 390000,
    shippingAddress: {
      street: '123 Lê Lợi',
      city: 'Hà Nội',
      phone: '0912345678'
    },
    paymentMethod: 'COD',
    createdAt: new Date('2025-05-27T09:00:00Z'),
    updatedAt: new Date('2025-05-27T10:00:00Z')
  },
  {
    _id: 'order002',
    userId: 'user002',
    items: [
      {
        bookId: 'book003',
        quantity: 1,
        price: 120000
      }
    ],
    totalPrice: 120000,
    shippingAddress: {
      street: '456 Trần Hưng Đạo',
      city: 'TP. HCM',
      phone: '0987654321'
    },
    paymentMethod: 'COD',
    createdAt: new Date('2025-05-28T08:30:00Z'),
    updatedAt: new Date('2025-05-28T09:00:00Z')
  }
]


export const mockCartItems = [
  {
    _id: "cart001",
    userId: "user001",
    items: [
      {
        bookId: "book01",
        quantity: 2,
      },
      {
        bookId: "book02",
        quantity: 1,
      },
      {
        bookId: "book03",
        quantity: 1,
      },
    ],
    updatedAt: new Date("2025-05-28T10:30:00Z"),
  },
  // {
  //   _id: 'cart002',
  //   userId: 'user002',
  //   items: [
  //     {
  //       bookId: 'book003',
  //       quantity: 1
  //     }
  //   ],
  //   updatedAt: new Date('2025-05-29T14:15:00Z')
  // }
]


export const mockUsers = [

]


// Mock data cho tin tức
export const newsList = [
  {
    id: '1',
    title: 'Ra mắt sách mới: Dune',
    summary: 'Dune - một trong những tiểu thuyết khoa học viễn tưởng vĩ đại nhất đã có mặt tại cửa hàng.',
    content: 'Dune là tác phẩm nổi tiếng của Frank Herbert, kể về hành trình của Paul Atreides trên hành tinh sa mạc Arrakis...',
    image: '/public/tieu-thuyet-Dune-elle-man-1.jpeg',
    createdAt: '2024-06-01',
  },
  {
    id: '2',
    title: 'Sự kiện giảm giá hè 2024',
    summary: 'Chương trình giảm giá lên đến 50% cho nhiều đầu sách hot.',
    content: 'Từ ngày 10/6 đến 20/6, Bookstore tổ chức sự kiện giảm giá lớn nhất năm...',
    image: '/public/vite.svg',
    createdAt: '2024-06-05',
  },
  {
    id: '3',
    title: 'Tác giả nổi bật: Nguyễn Nhật Ánh',
    summary: 'Khám phá các tác phẩm nổi bật của nhà văn Nguyễn Nhật Ánh.',
    content: 'Nguyễn Nhật Ánh là tác giả được yêu thích với nhiều tác phẩm dành cho thiếu nhi...',
    image: '/public/trello.svg',
    createdAt: '2024-06-10',
  },
]; 